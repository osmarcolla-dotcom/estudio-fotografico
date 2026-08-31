# Estúdio Fotográfico Digital 📸

Aplicação web completa para estúdio de ensaios fotográficos personalizados em alta resolução, com foco em experiência comercial elegante, fluxo simplificado para o cliente (mobile-first), preservação facial e arquitetura desacoplada de provedores externos.

---

## 🌟 Conceito do Produto

A interface pública e a comunicação com o cliente são 100% voltadas à experiência de um **estúdio fotográfico profissional e exclusivo**:
- **Vocabulário utilizado:** *Ensaio Fotográfico Digital*, *Produção Fotográfica*, *Fotos em Alta Resolução*, *Prévia do Ensaio*, *Aprovação de Fotos*.
- **Arquitetura desacoplada:** A geração e tratamento de imagens operam internamente através de adapters padronizados (`ImageGenerationProvider`), sem expor termos ou detalhes técnicos ao público.

---

## 🧭 Fluxo Completo da Aplicação

```
WhatsApp / Tráfego
       ↓
Landing Page Editorial (/)
       ↓
Formulário em 6 Etapas (/criar-ensaio)
  1. Dados do Cliente (Nome, WhatsApp, E-mail)
  2. Upload da Foto de Referência (com validação de formato e resolução)
  3. Tipo de Ensaio (Gravidez, Casamento, Aniversário, Debutante, Recém-nascido, Mêsversário, Sensual)
  4. Estilo Visual (Carregado dinamicamente por categoria)
  5. Pacote de Fotos (Básico 6 fotos, Profissional 12 fotos, Premium 30 fotos)
  6. Resumo e Confirmação
       ↓
Registro do Pedido (/pedido/[id]) com Status PENDING_PAYMENT
       ↓
Gateway de Pagamento (PIX / Cartão)
       ↓
Webhook de Pagamento Confirmado → Status PAID / PRODUCTION_QUEUED
       ↓
Motor de Produção Fotográfica com Preservação de Identidade
       ↓
Envio do Link Exclusivo de Prévia (/ensaio/[token]) via WhatsApp
       ↓
Cliente Visualiza as Fotos e Aprova ou Solicita Ajustes Pontuais
       ↓
Download Liberado das Fotos em Alta Resolução (/api/download/[token])
```

---

## 🛠️ Stack Tecnológica

- **Frontend & Backend:** Next.js (App Router), React, TypeScript.
- **Estilização & Design System:** Tailwind CSS v4, Lucide Icons, Tipografia Editorial (*Cormorant Garamond* e *DM Sans*).
- **Validação de Dados:** Zod.
- **Banco de Dados & Storage:** Supabase (PostgreSQL, Row Level Security, Storage Buckets).
- **Arquitetura de Domínio:** Adapters para Pagamentos (`PaymentGateway`), Produção (`ImageGenerationProvider`) e Notificações (`WhatsAppNotifier`).

---

## 📁 Estrutura de Diretórios

```
├── app/
│   ├── page.tsx                           # Landing page comercial
│   ├── layout.tsx                         # Layout global com fontes e metadados
│   ├── globals.css                        # Estilos globais e tokens de cores
│   ├── criar-ensaio/                      # Wizard de 6 etapas para clientes
│   ├── pedido/[id]/                       # Status do pedido e checkout
│   ├── ensaio/[token]/                    # Área exclusiva de aprovação do cliente
│   ├── admin/                             # Painel administrativo
│   │   ├── page.tsx                       # Dashboard com KPIs e tabela de pedidos
│   │   ├── login/page.tsx                 # Autenticação administrativa
│   │   ├── pedidos/[id]/page.tsx          # Detalhe do pedido, fotos e controle
│   │   └── catalogo/page.tsx              # Gestão de pacotes, categorias e estilos
│   └── api/                               # Route Handlers
│       ├── orders/                        # Criação de pedidos
│       ├── payments/webhook/[provider]/   # Webhooks de pagamento
│       ├── approval/[token]/approve/      # Aprovação pelo cliente
│       ├── approval/[token]/revision/     # Solicitação de ajustes
│       ├── download/[token]/              # URLs assinadas em alta resolução
│       └── admin/                         # Ações administrativas
├── components/
│   ├── marketing/                         # Componentes da Landing Page
│   ├── order/                             # Componentes do Wizard e Aprovação
│   └── admin/                             # Componentes do Painel Administrativo
├── lib/
│   ├── domain/                            # Camada de Domínio e Adapters
│   │   ├── payments/                      # Gateway de pagamento (Unconfigured, MercadoPago)
│   │   ├── production/                    # Motor de produção (Unconfigured, Replicate)
│   │   ├── notifications/                 # WhatsApp Notifier (Unconfigured, Evolution API)
│   │   ├── orders/                        # Serviço de criação e ciclo de pedidos
│   │   └── storage/                       # Serviço de Storage e URLs assinadas
│   ├── supabase/                          # Clientes Supabase (Server, Browser, Admin)
│   ├── validation/                        # Schemas Zod de validação
│   ├── data/                              # Catálogo padrão e consultas
│   ├── types/                             # Interfaces TypeScript
│   └── utils.ts                           # Utilitários de formatação (BRL, WhatsApp, IDs)
├── supabase/
│   ├── migrations/001_initial_schema.sql  # Schema SQL completo e RLS
│   └── seed.sql                           # Seed com categorias, estilos e pacotes
└── middleware.ts                          # Proteção das rotas /admin
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js 18+ instalado.
- Conta no [Supabase](https://supabase.com) (opcional para desenvolvimento inicial, pois a aplicação possui fallbacks elegantes para testes sem credenciais).

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Configuração de Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Preencha as variáveis conforme necessário:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gateways e Provedores (Preencha para habilitar integrações ativas)
PAYMENT_PROVIDER=unconfigured # ou 'mercadopago'
MERCADOPAGO_ACCESS_TOKEN=

PRODUCTION_PROVIDER=unconfigured # ou 'replicate'
REPLICATE_API_TOKEN=

WHATSAPP_PROVIDER=unconfigured # ou 'evolution'
WHATSAPP_API_URL=
WHATSAPP_API_KEY=

# Senha de acesso demo ao painel administrativo
ADMIN_DEMO_PASSWORD=estudio2026admin
```

### 4. Configurar Banco de Dados no Supabase
1. No painel do seu projeto Supabase, acesse **SQL Editor**.
2. Execute o conteúdo de `supabase/migrations/001_initial_schema.sql`.
3. Em seguida, execute o conteúdo de `supabase/seed.sql`.
4. No menu **Storage**, crie três buckets privados:
   - `customer-uploads` (Privado)
   - `previews` (Privado)
   - `final-images` (Privado)

### 5. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse:
- **Loja / Landing:** `http://localhost:3000`
- **Criar Ensaio:** `http://localhost:3000/criar-ensaio`
- **Painel Administrativo:** `http://localhost:3000/admin` (Login: `admin@estudio.com` / Senha: `estudio2026admin`)

---

## 🔒 Segurança e Privacidade

- **Proteção dos Arquivos Finais:** As imagens em alta resolução ficam isoladas em bucket protegido. O cliente só recebe acesso para download após a confirmação do pagamento e a aprovação formal do ensaio.
- **Links com Tokens Únicos:** A visualização de cada ensaio é protegida por tokens criptográficos aleatórios de alta entropia.
- **Painel Administrativo:** Rota `/admin` protegida por middleware com verificação de cookies de sessão e autenticação de staff/administrador.

---

## 📄 Licença
Propriedade privada do Estúdio Fotográfico Digital. Todos os direitos reservados.
