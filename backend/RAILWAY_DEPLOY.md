# Railway Deployment Guide

## Passos para Deploy no Railway

### 1. Criar conta no Railway
- Acesse: https://railway.app
- Faça login com GitHub

### 2. Criar novo projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Conecte seu repositório
- Selecione a pasta `backend/`

### 3. Adicionar PostgreSQL
- No dashboard do projeto, clique em "+ New"
- Selecione "Database" > "Add PostgreSQL"
- Aguarde a criação do banco

### 4. Configurar Variáveis de Ambiente
No painel do serviço backend, adicione estas variáveis:

```
DATABASE_URL=<URL_gerada_pelo_PostgreSQL_do_Railway>
PORT=3000
NODE_ENV=production
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=noreply@kushon.app
FRONTEND_URL=https://seu-frontend.vercel.app
```

### 5. Configurar Build
- O Railway detectará automaticamente que é um projeto Node.js
- Command de build: `npm run build`
- Command de start: `npm run start:prod`

### 6. Deploy
- O deploy acontece automaticamente após commit
- URL será gerada automaticamente (formato: *.railway.app)

## Observações
- O banco PostgreSQL será criado automaticamente
- Não esqueça de executar as migrations após o deploy
- Monitore os logs no dashboard do Railway