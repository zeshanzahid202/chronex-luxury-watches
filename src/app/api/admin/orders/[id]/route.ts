import { z } from "zod";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order, Product } from "@/models";
import { jsonError, safeError } from "@/lib/http";
const schema = z.object({ fulfillmentStatus: z.enum(["processing", "shipped", "delivered", "cancelled"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getSession();
  if (admin?.role !== "admin") return jsonError("Admin access required.", 403);
  try {
    const { id } = await params;
    const data = schema.parse(await req.json());
    await connectDB();
    const session = await mongoose.startSession();
    let order: any;
    try {
      await session.withTransaction(async () => {
        order = await Order.findById(id).session(session);
        if (!order) throw new Error("Order not found.");
        if (order.paymentStatus !== "paid" && data.fulfillmentStatus !== "cancelled") throw new Error("Unpaid orders cannot move to fulfillment.");
        if (data.fulfillmentStatus === "cancelled" && order.paymentStatus === "paid") throw new Error("Paid order cancellation needs an authorized refund workflow, which is not configured.");
        if (["delivered", "cancelled"].includes(order.fulfillmentStatus)) throw new Error("This order can no longer change status.");
        if (data.fulfillmentStatus === "cancelled" && order.paymentStatus === "pending") {
          for (const item of order.items) await Product.updateOne({ _id: item.product, reservedStock: { $gte: item.quantity } }, { $inc: { reservedStock: -item.quantity } }, { session });
          order.reservationExpiresAt = undefined;
        }
        order.fulfillmentStatus = data.fulfillmentStatus;
        await order.save({ session });
      });
    } finally { await session.endSession(); }
    return Response.json({ order });
  } catch (error) { return jsonError(safeError(error), 400); }
}
