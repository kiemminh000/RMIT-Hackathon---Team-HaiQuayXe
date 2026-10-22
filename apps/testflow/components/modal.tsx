'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import './modal.css';

/** Native modal semantics keep keyboard focus inside and make the page inert. */
export function Modal({ children, labelledBy, onClose, busy = false, className = '' }: {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  busy?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return <dialog ref={ref} className={`dialog ${className}`} aria-labelledby={labelledBy}
    aria-busy={busy}
    onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
    onClick={event => {
      if (busy || event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    {children}
  </dialog>;
}
