# Déploiement sans Git — Vercel CLI

## 1) Prérequis
- Node.js 20+
- Un compte Vercel

## 2) Installer la CLI
```bash
npm i -g vercel
vercel login
```

## 3) Préparer les variables
Créez une base **PostgreSQL** (Neon conseillé) et copiez `DATABASE_URL`.
Ensuite, au premier `vercel`, renseignez :
- `DATABASE_URL`
- `THRESHOLD_GREEN=0.75`
- `THRESHOLD_ORANGE=0.45`

## 4) Déployer
```bash
vercel        # choix: framework Next.js, root = ce dossier
vercel --prod # pour la prod
```
