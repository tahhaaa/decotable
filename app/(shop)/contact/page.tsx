import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <div className="container-shell grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-stone">Contact</p>
        <h1 className="section-title">Parlons de votre prochain projet de table.</h1>
        <p className="section-copy">
          Besoin d&apos;une recommandation, d&apos;une commande cadeau ou d&apos;une demande pour un evenement ? Ecrivez-nous ou appelez le 0622222430.
        </p>
        <div className="surface overflow-hidden">
          <iframe
            title="Decotable map"
            src="https://www.google.com/maps?q=Decotable%20Rabat&output=embed"
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
