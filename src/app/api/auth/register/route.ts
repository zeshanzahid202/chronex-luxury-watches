import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models";
import { createSession } from "@/lib/auth";
import { jsonError, safeError } from "@/lib/http";
const schema=z.object({name:z.string().min(2).max(100),email:z.string().email().max(200),password:z.string().min(10).max(100)});
export async function POST(req:Request){try{const data=schema.parse(await req.json());await connectDB();if(await User.exists({email:data.email.toLowerCase()}))return jsonError("An account with this email already exists.",409);const user=await User.create({name:data.name,email:data.email,passwordHash:await bcrypt.hash(data.password,12)});await createSession({id:String(user._id),email:user.email,name:user.name,role:"customer"});return Response.json({user:{name:user.name,email:user.email}} ,{status:201});}catch(e){return jsonError(safeError(e),400)}}
