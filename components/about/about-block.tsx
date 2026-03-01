import Image from "next/image";
import { cn } from "@/lib/utils";

interface AboutBlockProps {
  title: string;
  content: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  className?: string;
}

export function AboutBlock({
  title,
  content,
  imageSrc,
  imageAlt,
  reverse = false,
  className,
}: AboutBlockProps) {
  return (
    <div
      className={cn(
        "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
        reverse && "md:grid-flow-dense",
        className
      )}
    >
      <div className={reverse ? "md:col-start-2" : ""}>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className={reverse ? "md:col-start-1 md:row-start-1" : ""}>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          {title}
        </h2>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          {content}
        </div>
      </div>
    </div>
  );
}
