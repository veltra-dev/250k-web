import type { CSSProperties } from "react";
import Image from "next/image";
import { BrandKTitleFirstScroll } from "@/components/about/brand-k-title-first-scroll";
import { splitBrandKTitle } from "@/lib/solucoes-brand-title";
import { cn } from "@/lib/utils";

interface AboutBlockProps {
  title: string;
  /** Quando informado, exibe a marca como imagem no lugar do texto do título. */
  titleLogoSrc?: string;
  titleLogoClassName?: string;
  /** Aplicado ao título em texto (sem titleLogoSrc). */
  titleClassName?: string;
  titleStyle?: CSSProperties;
  /** Destaca o "K" da marca em laranja (títulos tipo "…-K" ou "250K …"). */
  brandOrangeK?: boolean;
  /** Requer `SolucoesFirstScrollProvider` no ancestral: K começa em primary e vai a laranja no primeiro scroll. */
  animateBrandKOnFirstScroll?: boolean;
  content: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  className?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
}

function titleWithBrandOrangeK(title: string) {
  const { before, accent, after } = splitBrandKTitle(title);
  if (!accent) return title;
  return (
    <>
      {before}
      <span className="text-brand-orange dark:text-[hsl(11_55%_62%)]">
        {accent}
      </span>
      {after}
    </>
  );
}

export function AboutBlock({
  title,
  titleLogoSrc,
  titleLogoClassName,
  titleClassName,
  titleStyle,
  brandOrangeK = false,
  animateBrandKOnFirstScroll = false,
  content,
  imageSrc,
  imageAlt,
  reverse = false,
  className,
  imageWrapperClassName,
  imageClassName,
  contentClassName,
}: AboutBlockProps) {
  return (
    <div
      className={cn(
        "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
        reverse && "md:grid-flow-dense",
        className,
      )}
    >
      <div className={reverse ? "md:col-start-2" : ""}>
        <div
          className={cn(
            "relative aspect-4/3 rounded-lg overflow-hidden bg-muted",
            imageWrapperClassName,
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={cn("object-cover", imageClassName)}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
        </div>
      </div>
      <div className={reverse ? "md:col-start-1 md:row-start-1" : ""}>
        <h2 className="mb-4">
          {titleLogoSrc ? (
            <Image
              src={titleLogoSrc}
              alt={title}
              width={320}
              height={72}
              className={cn(
                "h-9 w-auto max-w-full object-contain object-left md:h-11",
                titleLogoClassName,
              )}
            />
          ) : (
            <span
              className={cn(
                "text-2xl text-primary md:text-6xl",
                !titleClassName && "font-bold",
                titleClassName,
              )}
              style={titleStyle}
            >
              {brandOrangeK ? (
                animateBrandKOnFirstScroll ? (
                  <BrandKTitleFirstScroll title={title} />
                ) : (
                  titleWithBrandOrangeK(title)
                )
              ) : (
                title
              )}
            </span>
          )}
        </h2>
        <div
          className={cn(
            "text-muted-foreground leading-relaxed space-y-4",
            contentClassName,
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
