import { NextResponse } from "next/server";
export function jsonError(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
export function safeError(error: unknown) { return error instanceof Error ? error.message : "Something went wrong."; }
