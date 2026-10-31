import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, index: true },
  reference: { type: String, required: true, unique: true }, collection: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 }, currency: { type: String, default: "USD" },
  description: { type: String, required: true }, image: { type: String, required: true },
  material: String, dial: String, strap: String, movement: String, diameter: String, waterResistance: String,
  stock: { type: Number, default: 0, min: 0 }, reservedStock: { type: Number, default: 0, min: 0 }, featured: { type: Boolean, default: false }, published: { type: Boolean, default: false },
}, { timestamps: true });
ProductSchema.index({ name: "text", description: "text", reference: "text" });

const UserSchema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true, index: true }, passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ["customer", "admin"], default: "customer" } }, { timestamps: true });

const OrderSchema = new Schema({ orderNumber: { type: String, required: true, unique: true }, user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, items: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, name: String, reference: String, image: String, price: Number, quantity: Number }], currency: { type: String, default: "USD" }, subtotal: Number, shipping: Number, tax: Number, total: Number, reservationExpiresAt: Date, paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" }, fulfillmentStatus: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" }, shippingAddress: { name: String, email: String, line1: String, line2: String, city: String, region: String, postalCode: String, country: String } }, { timestamps: true });

const ArticleSchema = new Schema({ title: String, slug: { type: String, unique: true }, excerpt: String, body: String, image: String, published: { type: Boolean, default: false }, publishedAt: Date }, { timestamps: true });
const CollectionSchema = new Schema({ name: { type: String, required: true }, slug: { type: String, unique: true }, description: String, image: String, published: { type: Boolean, default: false } }, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);
export const User = models.User || model("User", UserSchema);
export const Order = models.Order || model("Order", OrderSchema);
export const Article = models.Article || model("Article", ArticleSchema);
export const Collection = models.Collection || model("Collection", CollectionSchema);
export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema>;
