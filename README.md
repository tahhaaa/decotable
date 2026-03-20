# Decotable

Decotable est une boutique e-commerce premium construite avec Next.js 14, TypeScript, Tailwind CSS et Supabase.

## Fonctionnalites

- Storefront complet: accueil, boutique, page produit, panier, checkout, auth, dashboard, contact
- Admin dashboard: produits, categories, commandes, promotions, villes de livraison
- Tarification dynamique par ville marocaine
- PWA installable avec mode hors ligne
- Notifications push via Service Worker + Web Push
- Notifications email via EmailJS
- Structure Supabase avec Auth, RLS, Storage-ready

## Lancer en local

1. Copier `.env.example` vers `.env.local`
2. Renseigner les cles Supabase, EmailJS et VAPID
3. Installer les dependances
4. Lancer `npm run dev`

## Deploiement Vercel

1. Importer le projet dans Vercel
2. Ajouter toutes les variables d'environnement de `.env.example`
3. Executer la migration SQL dans Supabase
4. Creer un bucket Storage pour les images produits
5. Deployer

## Supabase

- Executer `supabase/migrations/0001_init.sql`
- Ajouter un utilisateur admin puis mettre `role = 'admin'` dans `profiles`
- Configurer les redirections email pour Auth
- Email societe configure: `chahbounni2009@gmail.com`

## Push notifications

- Generer une paire de cles VAPID
- Ajouter `NEXT_PUBLIC_VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY`
- Les abonnements sont stockes dans `push_subscriptions`
