import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Simple in-memory cache for processed image payloads (url -> { data, mimeType })
const imageCache = new Map();
const IMAGE_CACHE_MAX = 50;
import crypto from 'crypto';

// Cache for AI analysis results: key -> { text, ts }
const aiResponseCache = new Map();
const AI_CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.send('AutoMatch backend is running. Use /api/chat or /api/analise-visual.');
});

const genAI = new GoogleGenerativeAI("AIzaSyDV8f0SyYh_9m83KpWYFmk1kMHCfRc9FwE");

const veiculos = [
    {
        id: 1, modelo: 'Civic G10', marca: 'Honda', preco: '120.000', cor: 'Prata',
        estilo: 'Sedã Esportivo',
        opniaoDoDono: 'Carro extremamente confiável, nunca dá oficina. Excelente revenda e motor surpreendentemente econômico. A suspensão é um pouco rígida, puxada pro esportivo.'
    },
    {
        id: 2, modelo: 'Corolla XEi', marca: 'Toyota', preco: '135.000', cor: 'Branco',
        estilo: 'Sedã Conforto',
        opniaoDoDono: 'O famoso tanque de guerra. Super confortável para longas viagens, suspensão extremamente macia que não sente o buraco. O design é um pouco conservador.'
    },
    {
        id: 3, modelo: 'Compass Longitude', marca: 'Jeep', preco: '150.000', cor: 'Preto',
        estilo: 'SUV Familiar',
        opniaoDoDono: 'Ótimo SUV para a família. Passa muita segurança na rodovia e tem um visual imponente que todo mundo gosta. O consumo na cidade poderia ser um pouco melhor.'
    }
];

function getFallbackChatResponse(mensagem) {
    const texto = (mensagem || '').toLowerCase();
    const availableModels = veiculos.map(v => `${v.marca} ${v.modelo}`);

    if (texto.includes('ferrari')) {
        return 'No momento não temos Ferrari no estoque da AutoMatch. Posso sugerir outros esportivos de alto desempenho ou encontrar um modelo premium semelhante?';
    }

    if (texto.includes('familia') || texto.includes('família') || texto.includes('conforto') || texto.includes('durabilidade')) {
        const suggest = veiculos.find(v => v.estilo.toLowerCase().includes('familiar') || v.estilo.toLowerCase().includes('conforto'));
        return suggest ? `Para perfil familiar ou conforto, recomendo o ${suggest.marca} ${suggest.modelo}. ${suggest.opniaoDoDono}` : 'No momento, posso indicar veículos que entregam conforto e praticidade para a família.';
    }

    if (texto.includes('esportivo')) {
        const suggest = veiculos.find(v => v.estilo.toLowerCase().includes('esportivo'));
        return suggest ? `Para perfil esportivo, o ${suggest.marca} ${suggest.modelo} é uma ótima escolha. ${suggest.opniaoDoDono}` : 'Não temos um esportivo exato no estoque agora, mas posso ajudar com opções parecidas.';
    }

    if (texto.includes('preço') || texto.includes('quanto') || texto.includes('valor')) {
        return `Atualmente temos os seguintes carros em estoque: ${availableModels.join(', ')}. Se quiser, posso detalhar preços e características de cada um.`;
    }

    return 'Desculpe, estamos com dificuldade de conectar ao assistente IA agora. Pergunte sobre o estoque atual ou me diga que tipo de carro você procura e eu te ajudo.';
}

app.post('/api/chat', async (req, res) => {
    const { mensagem } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const instrucaoPrioritaria = `
            Você é o consultor automotivo especialista da loja AutoMatch.
            REGRAS IMPORTANTES:
            1. Use APENAS as informações deste estoque e recomende com base na intenção do usuário: ${JSON.stringify(veiculos)}.
            2. Se o cliente perguntar por perfil ("carro para família", "conforto", "durabilidade", "esportivo"), atue como um Filtro da IA, varrendo o estoque e indicando a melhor opção!
            3. SEMPRE que falar de um carro, resuma sutilmente a "opniaoDoDono" como se fosse a sua experiência de mecânico/especialista da concessionária.
            4. Se o cliente perguntar o preço de um modelo, use os valores atualizados da lista.
            5. Seja muito carismático, demonstre confiança nas dicas e use emojis automotivos.
            
            Pergunta/Perfil buscando pelo cliente: ${mensagem}
        `;
        const result = await model.generateContent(instrucaoPrioritaria);
        const response = await result.response;
        res.json({ resposta: await response.text() });
    } catch (error) {
        console.error('Erro no /api/chat:', error);
        const fallback = getFallbackChatResponse(mensagem);
        res.status(500).json({ error: 'Erro na IA', fallback });
    }
});

app.get('/api/veiculos', (req, res) => {
    res.json(veiculos);
});

async function urlToGenerativePart(url, origin = 'http://localhost:5173') {
    try {
        if (!url) {
            throw new Error('URL de imagem não fornecida.');
        }

        if (url.startsWith('data:')) {
            const match = url.match(/^data:(.+);base64,(.+)$/);
            if (!match) {
                throw new Error('Formato de imagem em data URI inválido.');
            }
            const mimeType = match[1];
            const base64Data = match[2];
            return {
                inlineData: {
                    data: base64Data,
                    mimeType,
                },
            };
        }

        const targetUrl = url.startsWith('/') ? `${origin}${url}` : url;

        // Return cached payload when available
        if (imageCache.has(targetUrl)) {
            return { inlineData: imageCache.get(targetUrl) };
        }

        try {
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer', timeout: 10000 });
            let buffer = Buffer.from(response.data);

            // Resize/compress to reduce payload and processing time
            try {
                const optimized = await sharp(buffer)
                    .rotate()
                    .resize({ width: 768, height: 768, fit: 'inside' })
                    .jpeg({ quality: 70 })
                    .toBuffer();
                buffer = optimized;
            } catch (sharpErr) {
                console.error('Sharp processing failed, using original buffer:', sharpErr.message);
            }

            const payload = {
                data: buffer.toString('base64'),
                mimeType: response.headers['content-type'] || 'image/jpeg',
            };

            imageCache.set(targetUrl, payload);
            if (imageCache.size > IMAGE_CACHE_MAX) {
                const firstKey = imageCache.keys().next().value;
                imageCache.delete(firstKey);
            }

            return { inlineData: payload };
        } catch (axiosError) {
            console.error('Erro ao obter imagem:', axiosError.message);
            // Se for um caminho relativo local (começa com '/'), tentar ler do disco como fallback
            if (url.startsWith('/')) {
                try {
                    const __dirname = path.dirname(fileURLToPath(import.meta.url));
                    const localPath = path.join(__dirname, 'public', url.replace(/^\//, ''));
                    const fileData = await fs.promises.readFile(localPath);
                    let buffer = Buffer.from(fileData);
                    try {
                        const optimized = await sharp(buffer)
                            .rotate()
                            .resize({ width: 768, height: 768, fit: 'inside' })
                            .jpeg({ quality: 70 })
                            .toBuffer();
                        buffer = optimized;
                    } catch (sharpErr) {
                        console.error('Sharp processing failed for local file, using original buffer:', sharpErr.message);
                    }

                    const payload = { data: buffer.toString('base64'), mimeType: 'image/jpeg' };
                    imageCache.set(targetUrl, payload);
                    if (imageCache.size > IMAGE_CACHE_MAX) {
                        const firstKey = imageCache.keys().next().value;
                        imageCache.delete(firstKey);
                    }
                    return { inlineData: payload };
                } catch (fsErr) {
                    console.error('Erro ao ler arquivo local:', fsErr.message);
                    throw new Error('Não foi possível baixar ou converter a imagem local/remota.');
                }
            }
            throw new Error('Não foi possível baixar ou converter a imagem local/remota.');
        }
    } catch (error) {
        console.error('Erro ao obter imagem:', error.message);
        throw new Error('Não foi possível baixar ou converter a imagem local/remota.');
    }
}

app.post('/api/analise-visual', async (req, res) => {
    const { mensagem, imageUrl } = req.body;
    try {
        // Shorter, more direct prompt for faster processing
        const promptSystem = `Analise a lataria/pintura. Liste riscos, amassados, bolhas, variações de cor ou sinais de batida. Se perfeita, elogie o estado. Responda de forma concisa.\nPergunta: ${mensagem}`;
        const origin = req.get('origin') || 'http://localhost:5173';
        const imagePart = await urlToGenerativePart(imageUrl, origin);

        // Cache key based on image data + prompt
        const imageData = imagePart.inlineData && imagePart.inlineData.data ? imagePart.inlineData.data : '';
        const imageHash = crypto.createHash('sha256').update(imageData).digest('hex');
        const promptHash = crypto.createHash('sha256').update(promptSystem).digest('hex');
        const cacheKey = `${imageHash}:${promptHash}`;

        // Return cached AI analysis if available and fresh
        if (aiResponseCache.has(cacheKey)) {
            const entry = aiResponseCache.get(cacheKey);
            if (Date.now() - entry.ts < AI_CACHE_TTL_MS) {
                return res.json({ resposta: entry.text });
            }
            aiResponseCache.delete(cacheKey);
        }

        let result, response, text;
        
        try {
            // Try faster model first
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            result = await model.generateContent([promptSystem, imagePart]);
            response = await result.response;
            text = await response.text();
        } catch (fastErr) {
            console.warn('Fast model failed, retrying with fallback:', fastErr.message);
            // Fallback to standard model
            const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
            result = await model.generateContent([promptSystem, imagePart]);
            response = await result.response;
            text = await response.text();
        }

        // Store in cache
        aiResponseCache.set(cacheKey, { text, ts: Date.now() });
        if (aiResponseCache.size > 200) {
            const firstKey = aiResponseCache.keys().next().value;
            aiResponseCache.delete(firstKey);
        }

        res.json({ resposta: text });
    } catch (error) {
        console.error('Erro na análise visual:', error);
        const message = error && error.message ? error.message : String(error);
        res.status(500).json({ error: 'Erro ao analisar a imagem.', details: message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});