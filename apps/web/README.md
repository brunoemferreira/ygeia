# @ygeia/web — Frontend Web React (Mobile-First)

Aplicação Web responsiva da plataforma Ygeía (Υγεία), concebida para nutricionistas, secretárias e pacientes que utilizam navegadores em smartphones, tablets ou desktops.

---

## 📱 Filosofia Mobile-First
1. **Regras de Visualização**: Todo o design parte do smartphone (`<640px`) e expande-se progressivamente com breakpoints (`sm:`, `md:`, `lg:`).
2. **Touch Targets**: Botões e inputs possuem área tátil mínima de **48x48px**.
3. **Navegação Adaptativa**: No celular, utiliza Bottom Navigation Bar e Bottom Sheets; no desktop, expande-se para Sidebar fixa e visão dividida (*Split-View* de anamnese e dieta).

---

## 🛠️ Instalação e Execução

```bash
# Na raiz do monorepo:
pnpm install

# Iniciar o servidor de desenvolvimento Vite:
pnpm --filter @ygeia/web dev
```

Acesse em [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Variáveis de Ambiente (`.env`)

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL da API NestJS | `http://localhost:3333` |
| `VITE_APP_DOMAIN` | Domínio base da plataforma | `ygeia.app` |

---

## 📜 Changelog da Aplicação

Consulte o histórico detalhado em [CHANGELOG.md](./CHANGELOG.md).

### Versão Atual: `v0.1.0` (2026-11-21)
- Setup inicial da aplicação em **React 19** com **Vite** e TypeScript estrito.
- Diretrizes de interface **Mobile-First Responsive Design** (touch targets 48px, thumb zone).
- Injeção dinâmica de CSS variables no `:root` via endpoint de branding do tenant.
- Configuração de ambiente (`.env.example`), `index.html` e `src/main.tsx`.
