import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ArrowLeft, Calendar, Gauge, Palette, MapPin, Heart,
  Phone, MessageCircle, Send, Bot, User, Star, ChevronRight,
  TrendingDown, TrendingUp, Minus, Car, Truck, Battery, Share2,
  CheckCircle2, AlertTriangle, Clock, Fuel, Settings, Award, Zap, X, UserPlus, LogIn
} from 'lucide-react';
import StoreIdentifier from '../components/ui/StoreIdentifier';

// ─── DATA ────────────────────────────────────────────────────────────────────
const showcaseCars = [
  {
    id: 'sc-001', name: 'Honda Civic Touring', brand: 'Honda', model: 'Civic Touring',
    year: 2023, price: 165000, fipePrice: 172000, color: 'Azul Metálico',
    mileage: 18500, image: '/images/FotoHondaCivic.jpeg',
    bodyType: 'Sedã',
    icon: Car, featured: true, location: 'São Paulo, SP',
    description: 'Sedã premium com motor 1.5 turbo de 173cv, câmbio CVT, teto solar e central multimídia de 9".',
    fullDescription: 'O Honda Civic Touring é referência entre os sedãs médios. Equipado com motor 1.5 turbo de 173cv e 22,4 kgfm, câmbio CVT com simulação de 7 marchas e suspensão multilink traseira, entrega dirigibilidade excepcional. O interior conta com bancos em couro, teto solar elétrico, painel digital de 7", multimídia de 9" com wireless Apple CarPlay e Android Auto, além de carregador por indução e Honda Sensing completo (ACC, LKA, CMBS).',
    tags: ['1.5 Turbo 173cv', 'Teto Solar', 'Honda Sensing', 'CVT'],
    specs: { motor: '1.5 Turbo 173cv', cambio: 'CVT 7 marchas', combustivel: 'Gasolina', portas: '4 portas', direcao: 'Elétrica', freios: 'ABS com EBD', airbags: '6 airbags', tracao: 'Dianteira' },
    seller: { name: 'Carlos Mendes', avatar: '/cars/seller_avatar.png', rating: 4.8, ads: 23, since: '2021', bio: 'Especialista em sedãs premium. Mais de 150 veículos vendidos na plataforma.' },
  },
  {
    id: 'sc-002', name: 'Jeep Compass Limited', brand: 'Jeep', model: 'Compass Limited',
    year: 2023, price: 189900, fipePrice: 198000, color: 'Preto Fosco',
    mileage: 22000, image: 'data:image/jpeg;base64,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', bodyType: 'SUV',
    icon: Car, featured: false, location: 'Rio de Janeiro, RJ',
    description: 'SUV com motor 1.3 turbo flex de 185cv, tração 4x4 e teto panorâmico.',
    fullDescription: 'O Jeep Compass Limited combina capacidade off-road com refinamento urbano. Motor 1.3 T270 turbo flex de 185cv com câmbio automático de 6 marchas e tração 4x4 sob demanda. Interior em couro bege, teto panorâmico duplo, multimídia Uconnect de 10.1" com navegação, câmera 360° e pacote Tech com carregamento wireless e Jeep Highway Assist (Nível 2).',
    tags: ['1.3 T270 Turbo', 'Teto Panorâmico', 'Câmera 360°', 'Highway Assist'],
    specs: { motor: '1.3 T270 Turbo 185cv', cambio: 'Automático 6 marchas', combustivel: 'Flex', portas: '4 portas', direcao: 'Elétrica', freios: 'ABS disco ventilado', airbags: '6 airbags', tracao: '4x4 sob demanda' },
    seller: { name: 'Patrícia Lima', avatar: '/cars/seller_avatar.png', rating: 4.9, ads: 31, since: '2020', bio: 'Gerente de vendas premium com foco em SUVs e veículos de luxo.' },
  },
  {
    id: 'sc-003', name: 'Volkswagen Golf GTI', brand: 'Volkswagen', model: 'Golf GTI',
    year: 2022, price: 215000, fipePrice: 225000, color: 'Branco Perola',
    mileage: 12300, image: '/images/FotoGolfGTI.jpeg', bodyType: 'Hatch Esportivo',
    icon: Car, featured: true, location: 'Belo Horizonte, MG',
    description: 'Hatch esportivo com motor 2.0 TSI de 230cv, câmbio DSG e Cockpit Digital.',
    fullDescription: 'O Volkswagen Golf GTI é o hatch esportivo mais icônico do mundo. Motor 2.0 TSI de 230cv e 35,7 kgfm com câmbio DSG de dupla embreagem e 6 marchas, diferencial eletrônico XDS+ e suspensão esportiva com amortecedores adaptativos DCC. Interior com bancos Clark Tartan, Cockpit Digital de 10.25", multimídia Discover Pro de 10" com App-Connect, faróis full LED IQ.Light e assistente de estacionamento Park Assist.',
    tags: ['2.0 TSI 230cv', 'DSG 6M', 'DCC Adaptativo', 'IQ.Light'],
    specs: { motor: '2.0 TSI 230cv', cambio: 'DSG 6 marchas', combustivel: 'Gasolina', portas: '4 portas', direcao: 'Elétrica progressiva', freios: 'ABS disco ventilado', airbags: '6 airbags', tracao: 'Dianteira com XDS+' },
    seller: { name: 'Roberto Alves', avatar: '/cars/seller_avatar.png', rating: 4.7, ads: 15, since: '2022', bio: 'Entusiasta automotivo especializado em hatches esportivos e performance.' },
  },
  {
    id: 'sc-004', name: 'Toyota Hilux SRX', brand: 'Toyota', model: 'Hilux SRX',
    year: 2022, price: 285000, fipePrice: 295000, color: 'Branco Pérola',
    mileage: 38000, image: '/images/FotoNovaHilux.jpeg', bodyType: 'Picape',
    icon: Truck, featured: false, location: 'Curitiba, PR',
    description: 'Picape diesel 2.8 de 204cv e 500 Nm, tração 4x4 com reduzida e Toyota Safety Sense.',
    fullDescription: 'A Toyota Hilux SRX é sinônimo de robustez e durabilidade. Motor 2.8 diesel de 204cv e 500 Nm de torque, câmbio automático de 6 marchas e tração 4x4 com reduzida e bloqueio do diferencial traseiro. Cabine dupla com bancos em couro, multimídia de 8" com Apple CarPlay e Android Auto, sistema Toyota Safety Sense (pré-colisão, ACC, alerta de faixa) e capacidade de reboque de 3.500 kg.',
    tags: ['Diesel 2.8 204cv', '4x4 Reduzida', 'Safety Sense', 'Reboque 3.5t'],
    specs: { motor: '2.8 Diesel 204cv', cambio: 'Automático 6 marchas', combustivel: 'Diesel', portas: '4 portas', direcao: 'Hidráulica assistida', freios: 'ABS disco ventilado', airbags: '7 airbags', tracao: '4x4 com reduzida' },
    seller: { name: 'Fernando Costa', avatar: '/cars/seller_avatar.png', rating: 4.7, ads: 19, since: '2019', bio: 'Especialista em picapes e utilitários para uso comercial e rural.' },
  },
  {
    id: 'sc-005', name: 'Tesla Model 3', brand: 'Tesla', model: 'Model 3',
    year: 2024, price: 289000, fipePrice: 305000, color: 'Cinza Grafite',
    mileage: 5200, image: '/images/FotoTeslaModel3.jpeg', bodyType: '100% Elétrico',
    icon: Battery, featured: true, location: 'São Paulo, SP',
    description: 'Sedã elétrico com 283cv, autonomia de 510 km e Autopilot.',
    fullDescription: 'O Tesla Model 3 revolucionou o mercado de carros elétricos. Motor elétrico de 283cv com torque instantâneo de 420 Nm, autonomia de 510 km (WLTP) e carregamento rápido Supercharger de 15 a 80% em 25 minutos. Tela central de 15.4" com todas as funções do veículo, Autopilot de série com piloto automático de nível 2, atualizações OTA e teto de vidro panorâmico. Aceleração de 0 a 100 km/h em 6.1 segundos.',
    tags: ['Elétrico 283cv', '510 km WLTP', 'Autopilot', 'Supercharger'],
    specs: { motor: 'Elétrico 283cv', cambio: 'Redução fixa', combustivel: '100% Elétrico', portas: '4 portas', direcao: 'Elétrica', freios: 'Regenerativo + Disco', airbags: '8 airbags', tracao: 'Traseira' },
    seller: { name: 'Ana Beatriz', avatar: '/cars/seller_avatar.png', rating: 5.0, ads: 8, since: '2023', bio: 'Consultora de mobilidade elétrica e tecnologias sustentáveis.' },
  },
];

// ─── AI CHAT COMPONENT ───────────────────────────────────────────────────────
const AIChatBox = ({ car }) => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: `Olá! Sou a IA Automatch. Posso responder sobre o ${car.name}. Pergunte sobre motor, histórico, consumo ou faça uma comparação!` }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.toLowerCase();
    setMessages(m => [...m, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      let reply;
      if (q.includes('motor') || q.includes('potência') || q.includes('potencia'))
        reply = `O ${car.name} tem motor ${car.specs.motor}, câmbio ${car.specs.cambio} e tração ${car.specs.tracao}. Um conjunto mecânico excelente para a categoria.`;
      else if (q.includes('preço') || q.includes('preco') || q.includes('fipe') || q.includes('valor'))
        reply = `O anúncio está R$ ${(car.fipePrice - car.price).toLocaleString('pt-BR')} abaixo da FIPE (R$ ${car.fipePrice.toLocaleString('pt-BR')}). É uma boa oportunidade!`;
      else if (q.includes('consumo') || q.includes('econom'))
        reply = car.specs.combustivel === '100% Elétrico' ? `O ${car.name} é 100% elétrico com autonomia de 420 km. Sem gastos com combustível!` : `O ${car.name} usa ${car.specs.combustivel}. Para dados exatos de consumo, consulte o dossiê completo.`;
      else if (q.includes('segur') || q.includes('airbag'))
        reply = `O ${car.name} conta com ${car.specs.airbags}, freios ${car.specs.freios} e direção ${car.specs.direcao}. Segurança é prioridade!`;
      else if (q.includes('km') || q.includes('quilom'))
        reply = `O veículo tem ${car.mileage.toLocaleString('pt-BR')} km rodados, o que é ${car.mileage < 20000 ? 'bastante baixo' : car.mileage < 40000 ? 'dentro da média' : 'acima da média'} para um ${car.year}.`;
      else
        reply = `Sobre o ${car.name}: é um ${car.bodyType} ${car.year} com ${car.specs.motor}. Que aspecto específico gostaria de saber? Pergunte sobre motor, preço, segurança ou quilometragem!`;
      setMessages(m => [...m, { from: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ height: '380px' }}>
      <div className="px-4 py-3 bg-gradient-to-r from-brand-blue to-blue-700 text-white flex items-center gap-2">
        <Bot className="w-5 h-5" /> <span className="font-bold text-sm">IA Automatch</span>
        <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Online</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}>
            {m.from === 'ai' && <div className="w-7 h-7 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-0.5"><Bot className="w-4 h-4 text-brand-blue" /></div>}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.from === 'ai' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-brand-blue text-white'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte sobre o veículo..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:outline-none" />
        <button onClick={handleSend} className="bg-brand-blue text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const formatAnalysisResult = (text) => {
  const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const escaped = escapeHtml(text);
  const bolded = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const headings = bolded.replace(/^###\s*(.*)$/gm, '<p class="font-semibold text-sm mt-4 mb-2">$1</p>');
  const withLineBreaks = headings.replace(/\n/g, '<br/>');
  return withLineBreaks;
};

// ─── SELLER CHAT COMPONENT ───────────────────────────────────────────────────
const SellerChat = ({ seller }) => {
  const [messages, setMessages] = useState([
    { from: 'seller', text: `Olá! Sou ${seller.name}. Tem alguma dúvida sobre o veículo? Estou à disposição para negociar!` }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      const replies = [
        'Claro! Posso te dar mais detalhes. O carro está em excelente estado, sem nenhum arranhão.',
        'Aceito uma proposta! Podemos negociar condições de pagamento. Qual sua melhor oferta?',
        'O veículo passou por revisão completa na concessionária. Posso enviar o comprovante.',
        'Sim, está disponível para test-drive. Podemos agendar para esta semana!',
        'Aceito troca com avaliação. Traga seu carro para avaliarmos!',
      ];
      setMessages(m => [...m, { from: 'seller', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ height: '380px' }}>
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center gap-2">
        <img src={seller.avatar} alt={seller.name} className="w-6 h-6 rounded-full object-cover border border-white/30" />
        <span className="font-bold text-sm">{seller.name}</span>
        <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span> Online</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}>
            {m.from === 'seller' && <img src={seller.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200" />}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.from === 'seller' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-emerald-600 text-white'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Enviar mensagem ao vendedor..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none" />
        <button onClick={handleSend} className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// ─── PRICE COMPARISON ────────────────────────────────────────────────────────
const FipeComparison = ({ price, fipePrice }) => {
  const diff = fipePrice - price;
  const pct = ((diff / fipePrice) * 100).toFixed(1);
  const isBelow = diff > 0;
  const Icon = isBelow ? TrendingDown : diff === 0 ? Minus : TrendingUp;
  const colorClass = isBelow ? 'text-emerald-600' : diff === 0 ? 'text-slate-500' : 'text-red-500';
  const bgClass = isBelow ? 'bg-emerald-50 border-emerald-200' : diff === 0 ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200';

  return (
    <div className={`rounded-2xl p-5 border ${bgClass}`}>
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Award className="w-4 h-4" /> Referência FIPE
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Preço Anúncio</p>
          <p className="text-xl font-black text-slate-800">R$ {price.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Tabela FIPE</p>
          <p className="text-xl font-black text-slate-500">R$ {fipePrice.toLocaleString('pt-BR')}</p>
        </div>
      </div>
      <div className={`flex items-center gap-2 ${colorClass} font-bold text-sm`}>
        <Icon className="w-5 h-5" />
        <span>{isBelow ? `R$ ${diff.toLocaleString('pt-BR')} abaixo da FIPE (${pct}%)` : diff === 0 ? 'Na média da FIPE' : `R$ ${Math.abs(diff).toLocaleString('pt-BR')} acima da FIPE`}</span>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
const ShowcaseVehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeChat, setActiveChat] = useState('ai');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const analisarFotoDoCarro = async (urlDaFoto) => {
    setIsAnalyzing(true);
    setAnalysisResult('');
    const pergunta = "Por favor, atue como perito automotivo e analise a lataria/pintura visível nesta foto do carro. Liste os detalhes estéticos visíveis ou dê a aprovação.";
    
    try {
      const response = await fetch('/api/analise-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: pergunta, imageUrl: urlDaFoto }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar a imagem.');
      }
      setAnalysisResult(data.resposta || 'Erro ao processar imagem.');
    } catch (error) {
      console.error('Erro:', error);
      setAnalysisResult(error.message || 'Não foi possível conectar com a IA para analisar a foto.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const car = showcaseCars.find(c => c.id === id);
  if (!car) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-700 mb-2">Veículo não encontrado</p>
          <button onClick={() => navigate('/encontrar')} className="text-brand-blue font-semibold hover:underline">← Voltar ao catálogo</button>
        </div>
      </div>
    );
  }

  const specItems = [
    { icon: Settings, label: 'Motor', value: car.specs.motor },
    { icon: Settings, label: 'Câmbio', value: car.specs.cambio },
    { icon: Fuel, label: 'Combustível', value: car.specs.combustivel },
    { icon: Car, label: 'Portas', value: car.specs.portas },
    { icon: Settings, label: 'Direção', value: car.specs.direcao },
    { icon: ShieldCheck, label: 'Freios', value: car.specs.freios },
    { icon: ShieldCheck, label: 'Airbags', value: car.specs.airbags },
    { icon: Gauge, label: 'Tração', value: car.specs.tracao },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <nav className="w-full px-4 sm:px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/encontrar')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <ShieldCheck className="w-7 h-7 text-brand-blue" />
            <span className="text-lg font-black tracking-tight text-brand-navy hidden sm:block">AUTOMATCH</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-blue font-semibold text-xs transition-colors">
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-full font-bold text-xs transition-all shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
            <button onClick={() => setLiked(!liked)} className={`p-2 rounded-lg border transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
            </button>
            <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-brand-blue transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate('/encontrar')} className="hover:text-brand-blue transition-colors">Encontrar</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">{car.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Car image + full info ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden shadow-lg aspect-[16/9] bg-slate-200">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              
              {/* AI Analysis Overlay Button */}
              <div className="absolute top-4 right-4 z-10">
                 <button 
                   onClick={(e) => { e.preventDefault(); analisarFotoDoCarro(car.image); }}
                   disabled={isAnalyzing}
                   className="bg-brand-blue/90 hover:bg-brand-blue text-white backdrop-blur px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl transition-all"
                 >
                   <Bot className="w-4 h-4" /> 
                   {isAnalyzing ? "Analisando..." : "Analisar Foto com IA"}
                 </button>
              </div>
              {car.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-white" /> Destaque
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16">
                <p className="text-xs text-white/70 font-medium mb-1">{car.brand} · {car.bodyType}</p>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{car.name}</h1>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Vendido por</span>
                  <StoreIdentifier storeId={car.storeId} />
                </div>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {car.year}</span>
                  <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> {car.mileage.toLocaleString('pt-BR')} km</span>
                  <span className="flex items-center gap-1"><Palette className="w-4 h-4" /> {car.color}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {car.location}</span>
                </div>
                
                {/* AI Analysis Result Panel */}
                <AnimatePresence>
                  {analysisResult && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-xl max-h-96 overflow-y-auto">
                      <div className="flex items-start justify-between gap-3 mb-3 sticky top-0 bg-black/60">
                        <h4 className="text-white font-bold text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Relatório do Perito IA</h4>
                        <button onClick={() => setAnalysisResult('')} className="text-white/80 hover:text-white transition-colors rounded-full p-1 shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-white/90 text-sm leading-relaxed prose prose-invert prose-sm break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatAnalysisResult(analysisResult) }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Price + Quick Tags */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Preço do Anúncio</p>
                  <p className="text-4xl font-black text-brand-blue">R$ {car.price.toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {car.tags.map(t => (
                    <span key={t} className="text-[10px] font-bold text-brand-blue bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
              <FipeComparison price={car.price} fipePrice={car.fipePrice} />
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Descrição do Veículo</h2>
              <p className="text-slate-600 leading-relaxed">{car.fullDescription}</p>
            </motion.div>

            {/* Specs Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Ficha Técnica</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specItems.map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <s.icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">{s.label}</p>
                    <p className="text-xs font-bold text-slate-700">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Chat Section (Mobile: below content) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="lg:hidden space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setActiveChat('ai')}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${activeChat === 'ai' ? 'bg-brand-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  <Bot className="w-4 h-4" /> IA Automatch
                </button>
                <button onClick={() => setActiveChat('seller')}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${activeChat === 'seller' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  <MessageCircle className="w-4 h-4" /> Chat Vendedor
                </button>
              </div>
              {activeChat === 'ai' ? <AIChatBox car={car} /> : <SellerChat seller={car.seller} />}
            </motion.div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-6">
            {/* Seller Profile */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Perfil do Vendedor</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={car.seller.avatar} alt={car.seller.name} className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue/20" />
                <div>
                  <p className="font-bold text-slate-800">{car.seller.name}</p>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="font-bold">{car.seller.rating}</span>
                    <span className="text-slate-400">· {car.seller.ads} anúncios</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Na Automatch desde {car.seller.since}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{car.seller.bio}</p>

              {/* Contact Buttons */}
              <div className="space-y-2">
                <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                  <MessageCircle className="w-4 h-4" /> Enviar Mensagem
                </button>
              </div>
            </motion.div>

            {/* Desktop Chats */}
            <div className="hidden lg:block space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setActiveChat('ai')}
                  className={`flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${activeChat === 'ai' ? 'bg-brand-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  <Bot className="w-3.5 h-3.5" /> IA Automatch
                </button>
                <button onClick={() => setActiveChat('seller')}
                  className={`flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${activeChat === 'seller' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  <MessageCircle className="w-3.5 h-3.5" /> Vendedor
                </button>
              </div>
              <AnimatePresence mode="wait">
                {activeChat === 'ai' ? (
                  <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AIChatBox car={car} />
                  </motion.div>
                ) : (
                  <motion.div key="seller" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SellerChat seller={car.seller} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Safety Badge */}
            <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-brand-emerald" />
                <span className="font-bold text-sm">Verificado Automatch</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" /> Laudo Cautelar aprovado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" /> Documentação verificada</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" /> Sem restrições judiciais</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" /> Garantia Automatch 90 dias</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseVehicleDetails;
