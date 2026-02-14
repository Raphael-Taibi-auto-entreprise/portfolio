import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";

export async function GET() {
  const messages = await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newMessage = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        status: "unread",
        subject: data.subject || null,
        userId: data.userId || null,
      },
    });

    /* Notifier les admins du nouveau message */
    sseManager.sendToAdmins({
      type: "new_message",
      data: { 
        messageId: newMessage.id, 
        subject: newMessage.subject || "Message sans objet", 
        from: newMessage.name 
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (e) {
    console.error("Error creating message:", e);
    return NextResponse.json({ error: "Error creating message" }, { status: 500 });
  }
}
