"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconMenu } from "@tabler/icons-react";
import Logo from "@/assets/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 96;

const nav = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre" },
  // { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-[background-color,border-color,height] duration-500",
        isTransparent
          ? "h-24 border-b border-transparent bg-transparent"
          : "h-12 border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background",
      )}
    >
      <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 hover:opacity-90 transition-opacity duration-300",
            isTransparent ? "text-white" : "text-primary",
          )}
          aria-label="250k - Página inicial"
        >
          <Logo
            className={cn(
              "w-auto transition-[height,filter] duration-300",
              isTransparent ? "h-12" : "h-6",
              isTransparent && "brightness-0 invert",
            )}
          />
          <span
            className={cn(
              "font-black",
              isTransparent ? "text-xl text-white" : "text-lg text-primary",
            )}
          >
            250k
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Navegação principal"
        >
          {nav.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors duration-500",
                  isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                  isActive &&
                    (isTransparent
                      ? "text-white font-bold"
                      : "text-foreground font-bold"),
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <Button
            asChild
            size={isTransparent ? "default" : "sm"}
            variant={isTransparent ? "outline" : "default"}
            className={cn(
              isTransparent &&
                "border-white text-white bg-transparent hover:bg-white/10 hover:text-white",
            )}
          >
            <Link href="/contato">Fale conosco</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            asChild
            size="sm"
            className={cn(
              isTransparent &&
                "border-white text-white bg-transparent hover:bg-white/10 hover:text-white",
            )}
          >
            <Link href="/contato">Contato</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menu"
                className={cn(
                  isTransparent &&
                    "text-white hover:bg-white/10 hover:text-white",
                )}
              >
                <IconMenu className="h-5 w-5" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-4 pt-6"
                aria-label="Navegação mobile"
              >
                {nav.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-foreground hover:text-primary transition-colors duration-500 py-2 border-b border-border last:border-0"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
