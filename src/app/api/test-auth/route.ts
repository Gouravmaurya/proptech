import { handlers } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const typeofHandlers = typeof handlers;
    return NextResponse.json({ success: true, handlers: typeofHandlers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
