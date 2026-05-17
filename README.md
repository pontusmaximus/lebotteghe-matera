# Le Botteghe — Matera

Sito ufficiale del ristorante **Le Botteghe — Arrosto, Vino e Cucina**, Via delle Beccherie 22, Matera.

Dominio di produzione: **lebotteghematera.it**

## Funzionalità

- **Trilingue** IT · DE · EN con selettore in alto a destra.
- **Pubblico**: Home (hero a tutto schermo), Menù (con allergeni), Prenotazione online, Contatti con mappa.
- **Pannello admin** (`/it/admin/login`): gestione menù (categorie, piatti, prezzi, allergeni, traduzioni, on/off) e prenotazioni (conferma / rifiuta / elimina).
- **Database** Postgres via Prisma.
- **SEO** multilingua: sitemap, robots, Open Graph.

## Stack
Next.js 14 · TypeScript · Tailwind · Prisma · Postgres · jose (JWT cookies) · bcrypt

---

## Sviluppo locale

Serve un Postgres raggiungibile. Le opzioni più rapide:
- **Neon** (https://neon.tech) — crea un branch "development" gratis.
- **Docker**: `docker run -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres`
- **Postgres.app** su macOS.

```bash
cp .env.example .env        # incolla la connection string in DATABASE_URL
npm install                 # esegue anche prisma generate
npx prisma db push          # crea le tabelle
npm run db:seed             # menù completo + admin user
npm run dev                 # http://localhost:3000
```

**Credenziali admin di default** (cambiale in `.env` prima del seed!):
- email: `admin@lebotteghematera.it`
- password: `botteghe2026`

---

## Deploy su Vercel

Il repo è già linkato/deployato. Per il **primo setup del database**:

1. **Vercel Dashboard → Project → Storage → Create Database → Neon** (consigliato, free tier generoso). Vercel collega automaticamente `DATABASE_URL` e le varianti `POSTGRES_*` come env vars.
2. **Settings → Environment Variables**, aggiungi:
   - `AUTH_SECRET` — stringa casuale ≥ 32 caratteri (`openssl rand -hex 32`)
   - `ADMIN_EMAIL` — email del proprietario
   - `ADMIN_PASSWORD` — password forte
   - `SITE_URL` — `https://lebotteghematera.it`
3. **Redeploy** dal dashboard, poi inizializza il DB:
   ```bash
   # in locale, con DATABASE_URL puntato al Postgres di produzione:
   vercel env pull .env.production
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2- | tr -d \"\') \
     npx prisma db push && \
     node prisma/seed.mjs
   ```

### Collegare il dominio `lebotteghematera.it`

1. **Vercel → Project → Settings → Domains → Add `lebotteghematera.it`** (anche `www.`).
2. Dal pannello del registrar (es. Aruba/Register.it) imposta:
   - Tipo `A` su `@` → `76.76.21.21`
   - Tipo `CNAME` su `www` → `cname.vercel-dns.com`
3. Vercel emette automaticamente il certificato HTTPS.

---

## Comandi utili

```bash
npm run dev          # sviluppo
npm run build        # build di produzione
npm start            # serve la build
npm run db:push      # sincronizza schema con DB (no-migration mode)
npm run db:migrate   # applica migrations versionate (prisma migrate deploy)
npm run db:seed      # ricrea il menù completo + admin
npm run db:studio    # GUI del database
```

---

## Personalizzazione

| Cosa cambiare | Dove |
|---|---|
| Foto hero (desktop + mobile) | `public/images/hero-desktop.jpg`, `public/images/hero-mobile.jpg` |
| Colori (verde porte, oro, crema) | `tailwind.config.ts` → `theme.extend.colors` |
| Logo a testo | `components/Logo.tsx` |
| Telefono / indirizzo / orari | `lib/i18n.ts` (chiave `contact`), `components/Footer.tsx` |
| Traduzioni | `lib/i18n.ts` — tutto in un file |
| Menù via admin | `/it/admin/menu` (login richiesto) |
