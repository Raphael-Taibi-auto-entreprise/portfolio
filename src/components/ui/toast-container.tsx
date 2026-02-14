"use client";

import React, { useContext } from "react";
import { ToastContext } from "@/contexts/ToastContext";
import Toast from "./toast";

const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("ToastContainer doit être utilisé dans un ToastProvider");
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
