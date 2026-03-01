import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | 250k Consultoria Agrícola",
  description:
    "Entre em contato com a 250k. Envie sua mensagem e retornaremos em breve.",
};

export default function ContatoPage() {
  return (
    <>
      <Section
        title="Contato"
        subtitle="Envie sua mensagem e retornaremos o mais breve possível."
        variant="wide"
        className="bg-muted/20"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Card className="border-border shadow-sm">
            <CardContent className="pt-8 pb-8 px-6 md:px-8">
              <ContactForm />
            </CardContent>
          </Card>
          <div className="flex flex-col justify-center">
            <ContactInfo />
          </div>
        </div>
      </Section>
    </>
  );
}
