"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function RemittanceDialog({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={dialog} className="remittance-dialog" aria-labelledby="remittance-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <button type="button" aria-label="Cerrar envío" onClick={onClose} className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full text-xl text-content-secondary hover:bg-field">×</button>
      {children}
    </dialog>
  );
}
