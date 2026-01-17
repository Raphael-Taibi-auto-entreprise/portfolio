"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Approuve un avis et le rend public
 */
export async function approveReview(reviewId: string) {
  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { 
        status: "approved",
        isPublic: true,
      },
    });
    
    revalidatePath("/admin/avis");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
    return { success: false, error: "Erreur lors de l'approbation" };
  }
}

/**
 * Refuse un avis
 */
export async function rejectReview(reviewId: string) {
  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { 
        status: "rejected",
        isPublic: false,
      },
    });
    
    revalidatePath("/admin/avis");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    return { success: false, error: "Erreur lors du refus" };
  }
}

/**
 * Masque un avis public
 */
export async function hideReview(reviewId: string) {
  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isPublic: false },
    });
    
    revalidatePath("/admin/avis");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du masquage:", error);
    return { success: false, error: "Erreur lors du masquage" };
  }
}
