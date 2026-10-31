import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../src/models";
import { showcase } from "../src/lib/products";
async function main(){if(!process.env.MONGODB_URI)throw new Error("Set MONGODB_URI before seeding.");await mongoose.connect(process.env.MONGODB_URI);for(const item of showcase){const { _id,...doc}=item;await Product.updateOne({slug:item.slug},{$set:{...doc,published:true}},{upsert:true});}console.log(`Seeded ${showcase.length} fictional development watches.`);await mongoose.disconnect();}
main().catch(e=>{console.error(e);process.exit(1)});
