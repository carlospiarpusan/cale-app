
'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { User } from '@/lib/data';
import { Modal } from '@/components/Modal';
import { LogIn, UserPlus, Shield, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const current = storage.getCurrentUser();
    if (current) {
      if (current.role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = await storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (isAdminMode && user.role !== 'admin') {
        setError('No tienes permisos de administrador');
        return;
      }
      storage.setCurrentUser(user);
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = await storage.getUsers();
    if (users.find(u => u.email === email)) {
      setError('El correo ya está registrado');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'user',
      password: registerPassword
    };

    await storage.saveUser(newUser);
    storage.setCurrentUser(newUser);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col items-center">
      {/* Navigation (Apple Style) */}
      <nav className="w-full h-12 glass fixed top-0 z-[100] flex items-center justify-center border-b border-[#d2d2d7]/30">
        <div className="max-w-[1024px] w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-1 font-semibold text-sm opacity-90">
            <Shield size={16} className="text-[#0071e3]" />
            <span>Sin Fronteras</span>
          </div>
          <button
            onClick={() => { setIsLoginOpen(true); setIsAdminMode(false); setError(''); }}
            className="text-xs font-medium text-[#0071e3] hover:underline"
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>

      <main className="w-full max-w-[1024px] px-6 pt-32 pb-20 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center flex flex-col items-center"
        >
          <div className="mb-12 relative w-48 h-20 md:w-64 md:h-28">
            <Image src="/logo.jpg" alt="Logo Sin Fronteras" fill className="object-contain" priority />
          </div>

          <h1 className="text-apple-hero mb-6 tracking-tight">
            Conduce tu <span className="text-[#0071e3]">futuro</span>.
          </h1>

          <p className="text-[21px] md:text-[24px] text-[#86868b] leading-tight mb-10 max-w-2xl font-normal">
            La plataforma líder de evaluación para conductores.<br className="hidden md:block" />
            Certificaciones A2, B1 y C1 con tecnología de vanguardia.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setIsRegisterOpen(true); setError(''); }}
              className="apple-button-primary text-[17px] px-8 py-3"
            >
              Comenzar ahora
            </motion.button>
            <button
              onClick={() => { setIsLoginOpen(true); setIsAdminMode(false); setError(''); }}
              className="apple-button-secondary"
            >
              Ya tengo una cuenta <ChevronRight size={18} className="chevron-icon" />
            </button>
          </div>
        </motion.div>

        {/* Categories / Features (Minimalist Grid) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10"
        >
          {[
            { tag: 'Motos', cat: 'A2', desc: 'Evaluación técnica para cilindrada superior a 125cc.' },
            { tag: 'Autos', cat: 'B1', desc: 'Examen teórico-práctico para vehículos particulares.' },
            { tag: 'Servicio', cat: 'C1', desc: 'Certificación profesional para transporte público.' }
          ].map((item, i) => (
            <div key={i} className="bg-[#f5f5f7] p-8 rounded-[24px] border border-[#d2d2d7]/50 flex flex-col gap-4">
              <span className="text-[12px] font-bold text-[#86868b] uppercase tracking-wider">{item.tag}</span>
              <h3 className="text-[28px] font-semibold">{item.cat}</h3>
              <p className="text-[#86868b] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="w-full bg-[#f5f5f7] border-t border-[#d2d2d7] py-16 flex flex-col items-center">
        <div className="max-w-[1024px] w-full px-6 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <p className="text-[12px]">Copyright © 2024 Escuela Sin Fronteras. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-[12px]">
            <button onClick={() => { setIsLoginOpen(true); setIsAdminMode(true); setError(''); }}>Admin Console</button>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* Modals with Clean Style */}
      <AnimatePresence>
        {(isLoginOpen || isRegisterOpen) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(false); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[28px] p-10 shadow-2xl"
            >
              <h2 className="text-[32px] font-semibold mb-8 text-center tracking-tight">
                {isLoginOpen ? (isAdminMode ? 'Admin Portal' : 'Bienvenido') : 'Nueva Cuenta'}
              </h2>

              <form onSubmit={isLoginOpen ? handleLogin : handleRegister} className="space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-600 text-[14px] rounded-xl border border-red-100 mb-6">{error}</div>}

                {!isLoginOpen && (
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-[#86868b] ml-1">Nombre Completo</label>
                    <input
                      type="text" required
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                      placeholder="Juan Perez"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-[#86868b] ml-1">Correo Electrónico</label>
                  <input
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-[#86868b] ml-1">Contraseña</label>
                  <input
                    type="password" required
                    value={isLoginOpen ? password : registerPassword}
                    onChange={(e) => isLoginOpen ? setPassword(e.target.value) : setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button className="apple-button-primary w-full py-4 mt-4 text-[17px]">
                  {isLoginOpen ? 'Continuar' : 'Crear cuenta'}
                </button>

                <p
                  className="text-center text-[14px] text-[#0071e3] cursor-pointer hover:underline"
                  onClick={() => {
                    setIsLoginOpen(!isLoginOpen);
                    setIsRegisterOpen(!isRegisterOpen);
                    setError('');
                  }}
                >
                  {isLoginOpen ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Ingresa'}
                </p>
              </form>

              <button
                onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(false); }}
                className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f]"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
