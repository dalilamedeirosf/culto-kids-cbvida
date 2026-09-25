# Culto Kids | CBVIDA RIO — Lista virtual de doações

Página pública: **`/`** · Painel administrativo: **`/admin`**

## O que o sistema faz

- Lista de itens por categoria, com cotas, valor estimado, progresso e "faltam X cotas".
- Duas formas de contribuir: **doar o produto** (reserva de cotas) ou **PIX** (valor da cota).
- PIX com chave, botão de copiar, **PIX copia e cola com o valor já preenchido** e **QR Code**.
- Upload opcional de comprovante (visível só no painel).
- PIX entra como **⏳ aguardando confirmação** — só o admin muda para **💠 PIX confirmado**.
- Reserva ≠ entrega: o admin confirma **📦 produto recebido**.
- **Nunca reserva mais cotas do que o necessário**: a checagem acontece no banco,
  com trava na linha do produto (`SELECT … FOR UPDATE`). Duas pessoas tentando a
  última cota ao mesmo tempo: a primeira reserva, a segunda vê
  "Essa cota acabou de ser preenchida ❤️".
- Contador regressivo; depois do prazo (ou se o admin encerrar), novas doações são
  bloqueadas **também no servidor**. O admin pode reabrir.
- Painel: resumo, gráficos, "🚨 itens que mais precisamos", gestão de doações e PIX
  (confirmar, recusar, editar, cancelar, reativar, contato por WhatsApp),
  edição/criação de itens e configurações da campanha.
- Mudança de preço vale só para novas contribuições; as antigas mantêm o valor registrado.
- Página pública nunca recebe telefone, comprovante ou dados administrativos.
  Apoiadores aparecem só pelo primeiro nome (pode ser desligado no painel).

## Colocar no ar (grátis: Supabase + Vercel)

### 1. Banco de dados — Supabase

1. Crie uma conta em https://supabase.com e um projeto novo (plano Free). Região sugerida: São Paulo.
2. No projeto, abra **SQL Editor → New query**, cole todo o conteúdo de
   `supabase/migrations/20260925120000_culto_kids.sql` e clique em **Run**.
   Isso cria as tabelas, as funções de reserva, a lista de itens, a data final
   (15/12/2026 às 23:59, horário de Brasília) e a chave PIX `+5521986422434`.
   Pode rodar de novo sem duplicar nada.
3. Em **Project Settings → API**, copie:
   - **Project URL** → vai em `SUPABASE_URL`
   - **service_role** (secret) → vai em `SUPABASE_SERVICE_ROLE_KEY`

As tabelas ficam com RLS ativado e sem políticas: só o servidor (service role)
acessa. A chave pública do Supabase não consegue ler telefones nem comprovantes.

### 2. Site — Vercel

1. Crie uma conta em https://vercel.com com o seu GitHub.
2. **Add New → Project**, escolha este repositório e clique em **Import**.
   A Vercel detecta tudo sozinha — não precisa mudar nenhuma configuração de build.
3. Antes de clicar em **Deploy**, abra **Environment Variables** e cadastre:

| Variável | Valor |
| --- | --- |
| `SUPABASE_URL` | Project URL do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key do Supabase (**segredo**) |
| `ADMIN_PASSWORD` | a senha que a equipe vai usar no `/admin` |
| `VITE_SITE_URL` | opcional: o endereço final do site (ex.: `https://culto-kids-cbvida.vercel.app`), para a imagem aparecer no preview do WhatsApp |

4. Clique em **Deploy**. Em ~1 minuto o link público aparece
   (algo como `https://culto-kids-cbvida.vercel.app`).

Se mudar alguma variável depois, faça **Redeploy** na Vercel.

### 3. Antes de divulgar

1. Entre em `/admin` → **Configurações** e preencha o **nome do favorecido** do PIX
   e o **endereço de entrega**.
2. Faça um PIX de teste pelo QR Code / copia e cola e confira se cai na conta certa.
3. Confira preços e quantidades em **Produtos**.
4. Compartilhe o link.

## Desenvolvimento

```bash
bun install
ADMIN_PASSWORD=teste bun run dev
# http://localhost:8080  e  http://localhost:8080/admin
```

Sem `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` o sistema grava em
`.data/culto-kids.json` — **somente para desenvolvimento** (na Vercel não há disco
persistente, então em produção o Supabase é obrigatório).

## Onde está o código

| Caminho | Conteúdo |
| --- | --- |
| `src/routes/index.tsx` | Página pública |
| `src/routes/admin.tsx` | Login e painel |
| `src/components/kids/` | Cards, modal de contribuição, contador, decoração |
| `src/components/admin/` | Resumo/gráficos, doações/PIX, produtos, configurações |
| `src/lib/campaign/types.ts` | Regras de negócio (progresso, status, formatação) |
| `src/lib/campaign/pix.ts` | Geração do PIX copia e cola (BR Code) |
| `src/lib/campaign/*.functions.ts` | Funções de servidor (públicas e admin) |
| `src/lib/campaign/store-*.server.ts` | Acesso ao banco (Supabase ou arquivo local) |
| `supabase/migrations/` | Esquema do banco e dados iniciais |
