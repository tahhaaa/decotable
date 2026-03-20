export default function OfflinePage() {
  return (
    <div className="container-shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="surface max-w-xl space-y-4 p-10 text-center">
        <p className="font-serif text-4xl">Vous etes hors ligne</p>
        <p className="text-sm leading-7 text-stone">
          Certaines pages restent accessibles grace au mode PWA. Reconnectez-vous pour actualiser votre panier et vos commandes.
        </p>
      </div>
    </div>
  );
}
