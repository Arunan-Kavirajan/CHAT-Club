"use client";

import { useCallback, useState } from "react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
};

/**
 * Promise-based confirmation, usable inline: `if (await confirm({...}))`.
 * Each component that needs confirmations gets its own instance of this
 * hook and renders its own <ConfirmDialog> — no shared global state,
 * no prop drilling between unrelated components.
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  function handleConfirm() {
    resolver?.(true);
    setOptions(null);
  }

  function handleCancel() {
    resolver?.(false);
    setOptions(null);
  }

  return { confirm, confirmProps: options, handleConfirm, handleCancel };
}