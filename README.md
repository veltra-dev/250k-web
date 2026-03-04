# 250k — Site institucional

Site da **250k**, consultoria agrícola. Site em **português (pt-BR)** com páginas institucionais, formulário de contato e widgets de clima e commodities na home.

## Escopo (Phase 1)

- **Páginas:** Home, Sobre (`/sobre`), Serviços (`/servicos`), Contato (`/contato`)
- **Home:** Hero, proposta de valor, resumo de serviços e widgets de **clima** (Open-Meteo) e **commodities** (Banco Central: dólar, soja, milho)
- **Contato:** Formulário com server action; leads salvos na tabela `leads` do Supabase; opcional envio de e-mail via Resend
- **Analytics/SEO:** Google Tag Manager (GTM), meta tags, Open Graph, sitemap estático

Fases futuras: Builder de landing pages, LMS e pagamentos (Stripe).

## Blog (Phase 2)

- **Páginas:** listagem em `/blog` e post em `/blog/[slug]`. Conteúdo em **pt-BR** vindo do **Sanity.io**.
- **Studio (CMS):** Para editar autores, categorias e posts, acesse **[/studio](http://localhost:3000/studio)** (requer login no Sanity).
- **Variáveis de ambiente:** Em `.env` (ou `.env.local`) defina:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`: ID do projeto em [sanity.io/manage](https://sanity.io/manage)
  - `NEXT_PUBLIC_SANITY_DATASET`: dataset (padrão `production`)
- **Primeira vez:** Crie um projeto no Sanity, informe o `projectId` no `.env`, rode `npm run dev`, acesse `/studio` e crie ao menos um **Autor**, uma **Categoria** e um **Post** (com slug e data de publicação). O sitemap e as páginas do blog passam a incluir os posts automaticamente.

## Como rodar

1. **Dependências**
   ```bash
   npm install
   ```

2. **Variáveis de ambiente**  
   Copie `.env.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`: em [Supabase](https://supabase.com) → Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY`: mesma tela (Service role, secret)
   - `NEXT_PUBLIC_GTM_ID`: ID do container do [Google Tag Manager](https://tagmanager.google.com) (ex.: `GTM-XXXXXXX`)
   - Opcional: `RESEND_API_KEY` para enviar e-mail ao receber um lead  
   - Phase 2 (Blog): `NEXT_PUBLIC_SANITY_PROJECT_ID` e, se quiser, `NEXT_PUBLIC_SANITY_DATASET`

3. **Banco (Supabase)**  
   Crie a tabela `leads` no seu projeto. Use o SQL em:
   ```text
   supabase/migrations/00001_create_leads.sql
   ```
   (No Supabase Dashboard: SQL Editor → colar e executar.)

4. **Desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

5. **Build**
   ```bash
   npm run build
   npm start
   ```

## Imagens

- **Hero (Home):** Por padrão o hero usa uma imagem de exemplo (Unsplash). Para usar sua própria imagem, coloque em `public/images/hero.jpg` (recomendado 1920×1080) e altere o componente `Hero` para usar `imageSrc="/images/hero.jpg"`.
- **Sobre:** As imagens da página Sobre usam URLs do Unsplash. Para trocar por fotos locais, coloque em `public/images/sobre/` (ex.: `sobre-1.jpg`, `sobre-2.jpg`) e atualize as constantes em `app/sobre/page.tsx`.
- **Clientes:** Logos de empresas podem ser adicionados em `public/images/clients/` e referenciados em `lib/clients.ts` (campo `logoUrl`).

## Stack

- **Next.js** 16+ (App Router, TypeScript)
- **Tailwind CSS** 4 + **Shadcn/UI**
- **Supabase** (PostgreSQL, server client para leads)
- **Sanity.io** (Phase 2: blog — schemas autor, categoria, post; Studio em `/studio`)
- Cores da marca: verde `#22352D`, laranja `#B14F32`
