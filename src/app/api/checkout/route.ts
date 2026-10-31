import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Order, Product } from "@/models";
import { jsonError, safeError } from "@/lib/http";

const schema = z.object({
  items: z.array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(5) })).min(1).max(10),
  address: z.object({ name: z.string().min(2), email: z.string().email(), line1: z.string().min(3), line2: z.string().optional(), city: z.string().min(2), region: z.string().min(2), postalCode: z.string().min(2), country: z.string().min(2) }),
});

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return jsonError("Sign in before checkout.", 401);
  if (process.env.PAYMENT_MODE !== "sandbox") return jsonError("No payment provider is configured. Checkout is unavailable.", 503);
  try {
    const body = schema.parse(await req.json());
    await connectDB();
    const session = await mongoose.startSession();
    let order: any;
    try {
      await session.withTransaction(async () => {
        const now = new Date();
        const expired = await Order.find({ paymentStatus: "pending", fulfillmentStatus: "pending", reservationExpiresAt: { $lte: now } }).session(session);
        for (const prior of expired) {
          for (const item of prior.items) await Product.updateOne({ _id: item.product, reservedStock: { $gte: item.quantity } }, { $inc: { reservedStock: -item.quantity } }, { session });
          prior.fulfillmentStatus = "cancelled";
          await prior.save({ session });
        }
        const products: any[] = [];
        for (const item of body.items) {
          const product = await Product.findOne({ slug: item.slug, published: true }).session(session);
          if (!product) throw new Error(`Timepiece ${item.slug} is unavailable.`);
          const reserved = await Product.updateOne({ _id: product._id, $expr: { $gte: [{ $subtract: ["$stock", { $ifNull: ["$reservedStock", 0] }] }, item.quantity] } }, { $inc: { reservedStock: item.quantity } }, { session });
          if (reserved.modifiedCount !== 1) throw new Error(`${product.name} does not have enough available stock.`);
          products.push({ product, quantity: item.quantity });
        }
        const snapshots = products.map(({ product, quantity }) => ({ product: product._id, name: product.name, reference: product.reference, image: product.image, price: product.price, quantity }));
        const subtotal = snapshots.reduce((sum, item) => sum + item.price * item.quantity, 0);
        order = (await Order.create([{ orderNumber: `CX-${Date.now().toString(36).toUpperCase()}`, user: user.id, items: snapshots, subtotal, shipping: 0, tax: 0, total: subtotal, reservationExpiresAt: new Date(Date.now() + 15 * 60 * 1000), paymentStatus: "pending", fulfillmentStatus: "pending", shippingAddress: body.address }], { session }))[0];
      });
    } finally { await session.endSession(); }
    return Response.json({ orderNumber: order.orderNumber, paymentStatus: "pending", reservationExpiresAt: order.reservationExpiresAt, message: "Sandbox mode: no payment was taken. Stock is reserved for 15 minutes." }, { status: 201 });
  } catch (error) { return jsonError(safeError(error), 400); }
}
