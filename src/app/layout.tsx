import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), title: { default: "CHRONEX — Beyond Time. Beyond Ordinary.", template: "%s | CHRONEX" }, description: "Explore considered timepieces by CHRONEX, a fictional luxury watch house." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html>}
