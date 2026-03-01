import Link from "next/link";
import {
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandYoutube,
  IconMail,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";

const footerLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/contato", label: "Contato" },
];

const socials = [
  {
    href: "https://linkedin.com/company/250k",
    label: "LinkedIn",
    icon: IconBrandLinkedin,
  },
  {
    href: "https://instagram.com/250k",
    label: "Instagram",
    icon: IconBrandInstagram,
  },
  {
    href: "https://youtube.com/@250k",
    label: "YouTube",
    icon: IconBrandYoutube,
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link
              href="/"
              className="font-bold text-xl text-primary-foreground hover:opacity-90"
            >
              250k
            </Link>
            <p className="text-sm text-primary-foreground/80 max-w-xs">
              Consultoria agrícola com foco em estratégia, gestão e resultados no campo.
            </p>
            <div className="flex gap-3 pt-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-foreground mb-3">
              Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary-foreground mb-3">
              Contato
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <IconMail className="h-4 w-4 shrink-0" size={16} />
                <a
                  href="mailto:contato@250k.com.br"
                  className="hover:text-primary-foreground transition-colors"
                >
                  contato@250k.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 shrink-0" size={16} />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4 shrink-0" size={16} />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} 250k — Consultoria Agrícola
          </p>
          <Link
            href="#"
            className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            Política de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
