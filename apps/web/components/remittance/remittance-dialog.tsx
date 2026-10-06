"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

export function RemittanceDialog({ children, onClose, returnFocusRef }: { children: ReactNode; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement | null> }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    const returnFocus = returnFocusRef.current;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  return (
    <dialog ref={dialog} className="remittance-dialog" aria-labelledby="remittance-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <button type="button" aria-label="Cerrar envío" onClick={onClose} className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full text-xl text-content-secondary hover:bg-field">×</button>
      {children}
    </dialog>
  );
}
