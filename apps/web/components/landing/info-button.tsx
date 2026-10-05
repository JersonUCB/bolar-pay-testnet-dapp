"use client";

import { useId, useRef, type ReactNode } from "react";

export function InfoButton({ children, title, message, className = "", label }: {
  children: ReactNode; title: string; message: string; className?: string; label?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  return <>
    <button type="button" className={className} aria-label={label} onClick={() => dialog.current?.showModal()}>{children}</button>
    <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId} className="bolar-dialog">
      <h2 id={titleId} className="text-2xl font-bold leading-tight">{title}</h2>
      <p id={descriptionId} className="mt-4 text-base leading-relaxed text-content-secondary">{message}</p>
      <button type="button" className="primary-button mt-6 w-full" onClick={() => dialog.current?.close()} autoFocus>Cerrar</button>
    </dialog>
  </>;
}
