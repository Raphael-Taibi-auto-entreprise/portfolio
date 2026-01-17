"use client";

import { useContext } from "react";
import { ToastContext, ToastType } from "@/contexts/ToastContext";

/**
 * Hook pour utiliser facilement le système de toast
 * @returns Méthodes pour afficher les différents types de toasts
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast doit être utilisé dans un ToastProvider");
  }

  const { addToast } = context;

  return {
    success: (message: string, duration?: number) => addToast(message, "success", duration),
    error: (message: string, duration?: number) => addToast(message, "error", duration),
    info: (message: string, duration?: number) => addToast(message, "info", duration),
    warning: (message: string, duration?: number) => addToast(message, "warning", duration),
  };
};
