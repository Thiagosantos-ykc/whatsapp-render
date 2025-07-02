const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
let qrCodeData = null;
let clientStatus = 'disconnected';

// Middleware para processar JSON
app.use(express.json());

// ADD CORS MIDDLEWARE HERE - BEFORE YOUR ROUTES
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    // ou específico: 'https://741827dc-87b5-46fb-84ed-4a8af386f821.lovableproject.com'
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Configuração do cliente WhatsApp com persistência de sessão
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth/'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Evento quando o QR code está pronto para ser escaneado
client.on('qr', (qr) => {
    console.log('QR Code gerado. Escaneie para conectar.');
    qrCodeData = qr;
    clientStatus = 'qr_ready';
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Cliente WhatsApp está pronto!');
    clientStatus = 'connected';
    qrCodeData = null;
});

// Evento quando o cliente é desconectado
client.on('disconnected', (reason) => {
    console.log('Cliente WhatsApp desconectado:', reason);
    clientStatus = 'disconnected';
    // Tenta reconectar após desconexão
    setTimeout(() => {
        client.initialize();
    }, 5000);
});

// Inicializa o cliente WhatsApp
client.initialize();

// Rota para verificar o status
app.get('/status', (req, res) => {
    res.json({
        status: clientStatus,
        timestamp: new Date().toISOString()
    });
});

// Rota específica para exibir o QR code
app.get('/qrcode', (req, res) => {
    if (qrCodeData) {
        // Convertendo o QR code para HTML com imagem
        qrcode.toDataURL(qrCodeData, (err, url) => {
            if (err) {
                res.status(500).send('Erro ao gerar QR code');
                return;
            }
            
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>WhatsApp Bot - QR Code</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        text-align: center;
                        background-color: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    img {
                        max-width: 300px;
                        margin: 20px 0;
                    }
                    h1 {
                        color: #128C7E;
                    }
                    p {
                        margin: 10px 0;
                        color: #666;
                    }
                    .refresh {
                        margin-top: 20px;
                        padding: 10px 15px;
                        background-color: #128C7E;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>WhatsApp Bot - QR Code</h1>
                    <p>Escaneie o QR code abaixo com seu WhatsApp para conectar o bot</p>
                    <img src="${url}" alt="WhatsApp QR Code">
                    <p>Status: ${clientStatus}</p>
                    <button class="refresh" onclick="window.location.reload()">Atualizar QR Code</button>
                </div>
            </body>
            </html>
            `;
            
            res.send(html);
        });
    } else if (clientStatus === 'connected') {
        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Bot - Conectado</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                }
                .container {
                    text-align: center;
                    background-color: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #128C7E;
                }
                p {
                    margin: 10px 0;
                    color: #666;
                }
                .success {
                    color: green;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>WhatsApp Bot</h1>
                <p class="success">✅ Bot está conectado ao WhatsApp!</p>
                <p>Agora você pode configurar o Lovable para enviar mensagens através do endpoint:</p>
                <p><strong>/send-message</strong></p>
            </div>
        </body>
        </html>
        `);
    } else {
        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Bot - Aguardando</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                }
                .container {
                    text-align: center;
                    background-color: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #128C7E;
                }
                p {
                    margin: 10px 0;
                    color: #666;
                }
                .refresh {
                    margin-top: 20px;
                    padding: 10px 15px;
                    background-color: #128C7E;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>WhatsApp Bot - Inicializando</h1>
                <p>O bot está inicializando. Por favor, aguarde o QR code ser gerado.</p>
                <p>Status atual: ${clientStatus}</p>
                <button class="refresh" onclick="window.location.reload()">Atualizar página</button>
            </div>
        </body>
        </html>
        `);
    }
});

// Rota para enviar mensagens
app.post('/send-message', async (req, res) => {
    // Verifica se o cliente está conectado
    if (clientStatus !== 'connected') {
        return res.status(503).json({ 
            success: false, 
            message: 'WhatsApp não está conectado. Verifique o status em /status ou escaneie o QR code em /qrcode' 
        });
    }

    try {
        const { phone, message } = req.body;
        
        // Valida os dados recebidos
        if (!phone || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados incompletos. Forneça "phone" e "message"' 
            });
        }

        // Formata o número de telefone
        let formattedPhone = phone.toString().replace(/\D/g, '');
        
        // Verifica se o número tem o formato correto
        if (!formattedPhone.endsWith('@c.us')) {
            formattedPhone = `${formattedPhone}@c.us`;
        }

        // Envia a mensagem
        const result = await client.sendMessage(formattedPhone, message);
        
        // Retorna sucesso
        return res.status(200).json({ 
            success: true, 
            message: 'Mensagem enviada com sucesso', 
            data: { 
                messageId: result.id.id 
            } 
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Erro ao enviar mensagem', 
            error: error.message 
        });
    }
});

// Rota raiz
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>WhatsApp Bot API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
            }
            h1, h2 {
                color: #128C7E;
            }
            code {
                background-color: #f5f5f5;
                padding: 2px 5px;
                border-radius: 3px;
            }
            pre {
                background-color: #f5f5f5;
                padding: 10px;
                border-radius: 5px;
                overflow-x: auto;
            }
            .endpoint {
                margin-bottom: 30px;
            }
            .status {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 3px;
                color: white;
                font-weight: bold;
            }
            .status.connected {
                background-color: green;
            }
            .status.disconnected {
                background-color: red;
            }
            .status.qr_ready {
                background-color: orange;
            }
        </style>
    </head>
    <body>
        <h1>WhatsApp Bot API</h1>
        <p>Status atual: <span class="status ${clientStatus === 'connected' ? 'connected' : clientStatus === 'qr_ready' ? 'qr_ready' : 'disconnected'}">${clientStatus}</span></p>
        
        <div class="endpoints">
            <div class="endpoint">
                <h2>Verificar QR Code</h2>
                <p>Para conectar o WhatsApp, acesse:</p>
                <pre>GET /qrcode</pre>
            </div>
            
            <div class="endpoint">
                <h2>Verificar Status</h2>
                <p>Para verificar o status da conexão:</p>
                <pre>GET /status</pre>
            </div>
            
            <div class="endpoint">
                <h2>Enviar Mensagem</h2>
                <p>Para enviar uma mensagem via API:</p>
                <pre>POST /send-message
Content-Type: application/json

{
  "phone": "5511999999999",
  "message": "Olá, esta é uma mensagem de teste!"
}</pre>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
