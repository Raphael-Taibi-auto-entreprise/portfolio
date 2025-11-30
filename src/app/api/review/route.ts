import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { isPublic: true, status: "approved" },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newReview = await prisma.review.create({
      data: {
        name: data.name,
        email: data.email || null,
        company: data.company || null,
        role: data.role || null,
        rating: data.rating,
        comment: data.comment,
        status: "pending",
        isPublic: false,
      },
    });
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
