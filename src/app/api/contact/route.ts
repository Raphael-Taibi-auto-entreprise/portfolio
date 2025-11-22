import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newMessage = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        content: data.content,
      },
    });
    return NextResponse.json(newMessage, { status: 201 });
  } catch (e) {
    return NextResponse.json({ e: "Error creating message" }, { status: 500 });
  }
}
