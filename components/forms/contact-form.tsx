"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ContactValues = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<ContactValues>();

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        await fetch("/api/email/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setSent(true);
      })}
      className="surface grid gap-4 p-6"
    >
      <Input placeholder="Votre nom" {...form.register("name", { required: true })} />
      <Input type="email" placeholder="Votre email" {...form.register("email", { required: true })} />
      <textarea
        {...form.register("message", { required: true })}
        placeholder="Votre message"
        className="min-h-[180px] rounded-[1.5rem] border border-black/10 bg-white p-4 text-sm outline-none focus:border-beige"
      />
      <Button type="submit">Envoyer</Button>
      {sent ? <p className="text-sm text-green-700">Message envoye avec succes.</p> : null}
    </form>
  );
}
