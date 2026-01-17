"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { 
  sendQuoteApprovedEmail, 
  sendQuoteRejectedEmail, 
  sendQuoteNegotiationEmail 
} from "@/lib/email";

/**
 * Valide un devis et envoie un email de confirmation
 */
export async function approveQuote(quoteId: string) {
  try {
    /* Récupérer les infos du devis */
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote) {
      return { success: false, error: "Devis non trouvé" };
    }

    /* Mettre à jour le statut */
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: "approved" },
    });

    /* Envoyer l'email de confirmation */
    const emailResult = await sendQuoteApprovedEmail({
      to: quote.email,
      name: quote.name,
      projectType: quote.projectType,
    });

    if (!emailResult.success) {
      console.warn("Email non envoyé, mais devis approuvé:", emailResult.error);
    }
    
    revalidatePath("/admin/devis");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return { success: false, error: "Erreur lors de la validation" };
  }
}

/**
 * Refuse un devis et envoie un email
 */
export async function rejectQuote(quoteId: string, reason?: string) {
  try {
    /* Récupérer les infos du devis */
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote) {
      return { success: false, error: "Devis non trouvé" };
    }

    /* Mettre à jour le statut */
    await prisma.quote.update({
      where: { id: quoteId },
      data: { 
        status: "rejected",
      },
    });

    /* Envoyer l'email de refus */
    const emailResult = await sendQuoteRejectedEmail({
      to: quote.email,
      name: quote.name,
      projectType: quote.projectType,
    });

    if (!emailResult.success) {
      console.warn("Email non envoyé, mais devis refusé:", emailResult.error);
    }
    
    revalidatePath("/admin/devis");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    return { success: false, error: "Erreur lors du refus" };
  }
}

/**
 * Renégocie un devis avec une nouvelle deadline et envoie un email
 */
export async function negotiateQuote(quoteId: string, newDeadline: string, message: string) {
  try {
    /* Récupérer les infos du devis */
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote) {
      return { success: false, error: "Devis non trouvé" };
    }

    /* Mettre à jour le statut et la deadline */
    await prisma.quote.update({
      where: { id: quoteId },
      data: { 
        status: "negotiating",
        deadline: newDeadline,
      },
    });

    /* Envoyer l'email de négociation */
    const emailResult = await sendQuoteNegotiationEmail({
      to: quote.email,
      name: quote.name,
      projectType: quote.projectType,
      newDeadline: new Date(newDeadline),
    });

    if (!emailResult.success) {
      console.warn("Email non envoyé, mais devis en négociation:", emailResult.error);
    }
    
    revalidatePath("/admin/devis");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la négociation:", error);
    return { success: false, error: "Erreur lors de la négociation" };
  }
}
