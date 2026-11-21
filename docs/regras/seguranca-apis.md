# 🛡️ Diretrizes de Segurança das APIs & Criptografia — YGEÍA

A arquitetura do backend e das APIs do YGEÍA adota segurança em profundidade (**Defense in Depth**) e conformidade com o **OWASP API Security Top 10**.

---

## 1. Banco de Dados: Row-Level Security (RLS) no PostgreSQL

1. **Isolamento a Nível de Kernel do SGBD**:
   - Toda tabela com dados de clientes (`users`, `patients`, `anamnesis`, `recall_24h`, `patient_files`, `meal_plans`, `audit_logs`) deve possuir a coluna `tenant_id UUID NOT NULL REFERENCES tenants(id)`.
   - RLS deve ser explicitamente ativado e forçado:
     ```sql
     ALTER TABLE tabela_exemplo ENABLE ROW LEVEL SECURITY;
     ALTER TABLE tabela_exemplo FORCE ROW LEVEL SECURITY;
     ```
   - Política padrão obrigatória:
     ```sql
     CREATE POLICY tenant_isolation_policy ON tabela_exemplo
       AS PERMISSIVE FOR ALL
       TO ygeia_app
       USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
       WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
     ```
2. **Segregação de Credenciais**:
   - **Migrações / DDL**: Executadas pelo usuário administrativo `ygeia_user` (possui `BYPASSRLS`).
   - **Aplicação Runtime**: Conexões da API NestJS executadas estritamente pelo usuário não-superuser `ygeia_app`. O `ygeia_app` **não tem permissão** de bypass de RLS sob nenhuma circunstância.
3. **Injeção de Sessão**:
   - Antes de qualquer query de negócio, a transação/conexão injeta o tenant atual via `SET LOCAL app.current_tenant_id = '...'`.

---

## 2. Autenticação & Hashing de Senhas

1. **Argon2id (OWASP & IETF RFC 9106)**:
   - Senhas de usuários e profissionais são criptografadas com `Argon2id` usando os parâmetros recomendados para produção:
     - Memória: 64 MB (65536 KB)
     - Iterações de tempo: 3
     - Paralelismo: 1 thread
2. **Par de Tokens JWT & Refresh Token**:
   - **Access Token (JWT)**:
     - Assinado com algoritmo HMAC-SHA256 (`HS256`) com segredo criptográfico de alta entropia.
     - Validade curta: **15 minutos**.
     - Contém apenas claims essenciais (`sub`, `tenantId`, `role`, `email`).
   - **Refresh Token (Opaque Token)**:
     - Gerado como string criptográfica de 64 bytes hexadecimais (128 caracteres) gerada por `crypto.randomBytes(64)`.
     - No banco de dados, armazena-se apenas o hash SHA-256 do token (para impedir vazamento mesmo com dump do banco).
     - Validade máxima: **7 dias**.
3. **Rotação Obrigatória & Detecção de Reuso**:
   - Cada chamada a `/api/v1/auth/refresh` consome o refresh token atual e emite um par inteiramente novo.
   - **Se um refresh token já consumido ou revogado for apresentado novamente**, o sistema detecta a violação de segurança e **revoga imediatamente toda a família de sessões do usuário** (`compromised_at = NOW()`), forçando deslogamento em todos os dispositivos.

---

## 3. Armazenamento Seguro de Credenciais nos Clientes

1. **Frontend Web (React)**:
   - O Refresh Token **nunca** é salvo em `localStorage` ou `sessionStorage` (vulneráveis a ataques XSS).
   - O Refresh Token é transportado exclusivamente através de **HttpOnly Cookie**:
     - `httpOnly: true` (inacessível para JavaScript no navegador).
     - `secure: true` (apenas tráfego HTTPS em produção).
     - `sameSite: 'strict'` (proteção contra CSRF).
     - `path: '/api/v1/auth'` (escopo restrito às rotas de autenticação).
2. **App Mobile (React Native)**:
   - Tokens no dispositivo móvel são mantidos em hardware-backed secure storage:
     - iOS: Keychain via `expo-secure-store` com `keychainAccessible: AFTER_FIRST_UNLOCK`.
     - Android: Android Keystore com criptografia AES-256 em SharedPreferences seguras.

---

## 4. Proteções Complementares de Rede e API

1. **Cabeçalhos de Segurança HTTP (Helmet)**:
   - Configuração de `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`.
2. **CORS Dinâmico para White Label**:
   - Apenas origens registradas na tabela `tenant_domains` ou domínios oficiais da plataforma recebem cabeçalhos CORS favoráveis. Requisições de origens não autorizadas são bloqueadas.
3. **Validação de Entrada com Esquemas Zod**:
   - Todos os payloads HTTP de entrada passam por validação estrita (strip de campos não declarados, impedindo *mass assignment*).
