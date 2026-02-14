import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";

export async function GET() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newQuote = await prisma.quote.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        projectType: data.projectType,
        budget: data.budget || null,
        deadline: data.deadline || null,
        description: data.description,
        status: "pending",
        userId: data.userId || null,
      },
    });

    /* Notifier les admins du nouveau devis */
    sseManager.sendToAdmins({
      type: "new_quote",
      data: { 
        quoteId: newQuote.id, 
        projectType: newQuote.projectType, 
        from: newQuote.name 
      },
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (e) {
    console.error("Error creating quote:", e);
    return NextResponse.json({ error: "Error creating quote" }, { status: 500 });
  }
}
