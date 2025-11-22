import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.avis.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newReview = await prisma.avis.create({
      data: {
        name: data.name,
        comment: data.comment,
        rating: data.rating,
      },
    });
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
