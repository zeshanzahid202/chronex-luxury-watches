import {z} from "zod";import {jsonError} from "@/lib/http";
const schema=z.object({name:z.string().min(2).max(100),email:z.string().email(),message:z.string().min(10).max(3000)});
export async function POST(req:Request){const data=schema.safeParse(Object.fromEntries(await req.formData()));if(!data.success)return jsonError("Please provide a valid name, email, and message.");return jsonError("Contact delivery is not configured; your message was not sent.",503)}
