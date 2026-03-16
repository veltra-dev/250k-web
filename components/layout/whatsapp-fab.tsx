"use client";

import Link from "next/link";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import {
  useShowAfterHeroHalf,
  getFloatingVisibilityClassName,
} from "@/hooks/use-show-after-hero-half";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5511999999999";
const WHATSAPP_MESSAGE = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "";
const whatsappUrl = WHATSAPP_MESSAGE
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppFAB() {
  const visible = useShowAfterHeroHalf();

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 ${getFloatingVisibilityClassName(visible)}`}
    >
      <IconBrandWhatsapp className="h-8 w-8" strokeWidth={1.5} />
    </Link>
  );
}
