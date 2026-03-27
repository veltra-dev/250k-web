"use client";

import type { MouseEvent, ReactElement } from "react";
import { cloneElement } from "react";
import { useRouter } from "next/navigation";

type TriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

interface LeadCaptureDialogProps {
  trigger: ReactElement<TriggerProps>;
}

export function LeadCaptureDialog({ trigger }: LeadCaptureDialogProps) {
  const router = useRouter();

  return cloneElement(trigger, {
    onClick: (event: MouseEvent<HTMLElement>) => {
      // preserva comportamento original, se existir
      trigger.props.onClick?.(event);
      router.push("/questionario");
    },
  });
}

