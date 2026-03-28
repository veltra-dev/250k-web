import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

const contactItems = [
  {
    icon: IconMail,
    label: "E-mail",
    value: "teste@mail.com",
    href: "mailto:teste@mail.com",
  },
  {
    icon: IconPhone,
    label: "Telefone",
    value: "(66) 9.9220-6117",
    href: "tel:+5566992206117",
  },
  {
    icon: IconMapPin,
    label: "Endereço",
    value: "R. das Leucenas, 74 - St. Comercial, Sinop - MT, 78550-132",
    href: null,
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-primary">
        Outras formas de contato
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Preferimos retornar o mais breve possível. Para demandas urgentes,
        utilize o telefone.
      </p>
      <ul className="space-y-4">
        {contactItems.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              {href ? (
                <a
                  href={href}
                  className="text-foreground font-medium hover:text-primary transition-colors"
                >
                  {value}
                </a>
              ) : (
                <p className="text-foreground font-medium">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
