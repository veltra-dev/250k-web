"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { PARTNER_LOGOS } from "@/lib/partner-logos";

export function PartnersCarousel() {
  const [isPaused, setIsPaused] = useState(false);

  const logos = useMemo(
    () => [...PARTNER_LOGOS, ...PARTNER_LOGOS],
    [],
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-muted/20 py-2"
      aria-label="Logos de parceiros"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-10 px-6 md:px-10 will-change-transform"
        animate={isPaused ? undefined : { x: ["0%", "-50%"] }}
        transition={
          isPaused
            ? undefined
            : {
                duration: 60,
                ease: "linear",
                repeat: Infinity,
              }
        }
      >
        {logos.map((partner, idx) => (
          <div
            key={`${partner.src}-${idx}`}
            className="flex h-24 shrink-0 items-center justify-center md:h-28"
            aria-hidden={idx >= PARTNER_LOGOS.length}
          >
            <Image
              src={partner.src}
              alt={partner.alt}
              width={200}
              height={80}
              className="max-h-14 w-auto object-contain md:max-h-16"
              sizes="(max-width: 768px) 40vw, 140px"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
