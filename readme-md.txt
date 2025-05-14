# Bot de WhatsApp para Lovable

Este é um bot de WhatsApp que permite integrar o WhatsApp com o Lovable, enviando mensagens automáticas através de uma API REST.

## Funcionalidades

- Conexão com WhatsApp via QR code
- Envio de mensagens via API
- Interface web para visualizar o QR code
- Verificação de status da conexão
- Persistência de sessão entre reinicializações

## Requisitos

- Node.js 16 ou superior
- Conta no WhatsApp

## Instruções para Deploy no Render.com

O Render.com é uma plataforma de hospedagem que funciona bem com aplicações que usam Puppeteer (como este bot do WhatsApp).

### 1. Atualizar seu repositório no GitHub

1. Abra o GitHub Desktop
2. Você verá as alterações que fizemos nos arquivos
3. No canto inferior esquerdo, escreva "Migração para Render.com" no campo "Summary"
4. Clique em "Commit to main"
5. Clique em "Push origin" para enviar as mudanças para o GitHub

### 2. Criar conta no Render.com

1. Vá para [render.com](https://render.com)
2. Clique em "Sign Up" e crie uma conta (você pode usar sua conta do GitHub)

### 3. Criar um novo serviço Web

1. Faça login no Render.com
2. Clique em "New" e escolha "Web Service"
3. Conecte sua conta do GitHub (se ainda não estiver conectada)
4. Selecione o repositório "whatsapp-bot"
5. O Render vai detectar o arquivo render.yaml e usar as configurações dele
6. Dê um nome para seu serviço (por exemplo, "whatsapp-bot")
7. Escolha o plano gratuito
8. Clique em "Create Web Service"

### 4. Aguarde o deploy

1. O Render vai começar a construir e implantar seu app
2. Isso pode levar alguns minutos (5-10 minutos na primeira vez)
3. Você pode acompanhar o progresso na página do Render

### 5. Acesse o QR Code

1. Quando o deploy estiver pronto, clique no link gerado pelo Render (algo como https://whatsapp-bot.onrender.com)
2. Acesse /qrcode no final do link: https://whatsapp-bot.onrender.com/qrcode
3. Escaneie o QR code com seu WhatsApp

### 6. Integre com o Lovable

1. Depois que o WhatsApp estiver conectado (você pode verificar em /status)
2. Configure o Lovable para usar seu endpoint: https://whatsapp-bot.onrender.com/send-message

## API de Envio de Mensagens

Para enviar uma mensagem, faça uma requisição POST para o endpoint `/send-message`:

```http
POST /send-message
Content-Type: application/json

{
  "phone": "5511999999999",
  "message": "Olá, esta é uma mensagem de teste!"
}
```

## Por que o Render.com é melhor que o Railway neste caso?

1. **Suporte para Puppeteer**: O Render tem melhor suporte para aplicações que usam o Puppeteer (como a nossa)
2. **Permanência dos dados**: O Render mantém os arquivos entre reinicializações, o que ajuda a manter a sessão do WhatsApp
3. **Plano gratuito generoso**: Como você usa apenas 1x por mês, o plano gratuito do Render é perfeito
4. **Melhor visualização do QR code**: Adicionamos uma página específica para ver o QR code, tornando mais fácil de conectar

## Solucionando Problemas

Se você enfrentar problemas com o bot:

1. Verifique o status em `/status`
2. Reinicie o serviço no dashboard do Render
3. Verifique os logs no dashboard do Render para identificar erros específicos

## Considerações Finais

- O plano gratuito do Render tem um limite de horas por mês, mas como você usa apenas 1x por mês, isso não deve ser um problema
- O serviço pode ficar inativo após 15 minutos sem tráfego, mas será ativado automaticamente quando receber uma requisição
- A primeira requisição após inatividade pode levar alguns segundos para ser processada