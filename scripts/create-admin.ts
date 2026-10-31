import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models";
async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!uri || !email || !password || password.length < 12) throw new Error("Set MONGODB_URI, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.");
  await mongoose.connect(uri);
  const user = await User.findOneAndUpdate({ email }, { $set: { name: "CHRONEX Administrator", role: "admin", passwordHash: await bcrypt.hash(password, 12) }, $setOnInsert: { email } }, { upsert: true, new: true, runValidators: true });
  console.log(`Admin account configured for ${user.email}.`);
  await mongoose.disconnect();
}
main().catch(error => { console.error(error); process.exit(1); });
