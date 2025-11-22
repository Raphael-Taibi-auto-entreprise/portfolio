import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quote = await prisma.devis.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quote);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newQuote = await prisma.devis.create({
      data: {
        name: data.name,
        email: data.email,
        projectType: data.projectType,
        details: data.details,
      },
    });
    return NextResponse.json(newQuote, { status: 201 });
  } catch (e) {
    return NextResponse.json({ e: "Error creating quote" }, { status: 500 });
  }
}
