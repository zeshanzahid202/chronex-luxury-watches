import {connectDB} from "@/lib/db";import {getSession} from "@/lib/auth";import {Order} from "@/models";import {jsonError} from "@/lib/http";
export async function GET(){const user=await getSession();if(!user)return jsonError("Sign in to view your orders.",401);await connectDB();const orders=await Order.find({user:user.id}).sort({createdAt:-1}).lean();return Response.json({orders})}
