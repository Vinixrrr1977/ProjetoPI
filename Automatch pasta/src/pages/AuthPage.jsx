import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Eye, EyeOff, XCircle, CheckCircle2, Loader2, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess('Login realizado com sucesso! Redirecionando...');
      } else {
        await register(formData.name, formData.email, formData.password);
        setSuccess('Conta criada com sucesso! Bem-vindo(a).');
      }

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100"
      >
        <div className="p-8 md:p-12">
          {/* Logo/Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-6 group transition-transform hover:scale-110 cursor-pointer"
                 onClick={() => navigate('/')}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Automatch</h1>
            <p className="text-slate-500 font-medium">{isLogin ? 'Bem-vindo de volta' : 'Comece sua jornada hoje'}</p>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-semibold"
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 text-sm font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Felipe Amorim"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 transition-all focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-white outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="exemplo@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 transition-all focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Senha</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-brand-blue uppercase hover:underline">Esqueceu a senha?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-sm font-medium text-slate-700 transition-all focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-white outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.15em] shadow-xl transition-all disabled:bg-slate-300 transform active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Acessar Plataforma' : 'Criar Conta Agora'}
                  {!isLogin && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              {isLogin ? 'Ainda não tem conta?' : 'Já possui uma conta?'}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                className="ml-2 text-brand-blue font-black tracking-tight uppercase hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Fazer Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer link to home */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-10 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-all text-sm group"
      >
        <Home className="w-4 h-4" />
        Voltar para o Início
      </button>
    </div>
  );
};

export default AuthPage;
