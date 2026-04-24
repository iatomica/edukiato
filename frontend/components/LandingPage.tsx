import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Calendar, Command, MessageCircle, PiggyBank, ShieldCheck, Star, Users, Heart, Shapes } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .font-editorial {
            font-family: 'Inter', sans-serif;
          }
          .landing-base {
            background-color: #F7F7F5;
            color: #050505;
          }
          .landing-bg-orange { background-color: #E94F32; }
          .landing-bg-orange-hover:hover { background-color: #F26A4B; }
          .landing-bg-blue { background-color: #4338CA; }
          .landing-bg-blue-hover:hover { background-color: #4F46E5; }
          .landing-bg-black { background-color: #050505; }
          .landing-text-orange { color: #E94F32; }
          .landing-text-blue { color: #4338CA; }
        `}
      </style>
      
      <div className="min-h-screen landing-base font-editorial selection:bg-[#E94F32] selection:text-white">
        
        {/* Navigation */}
        <nav className="fixed top-0 inset-x-0 bg-[#F7F7F5]/90 backdrop-blur-md z-50 border-b border-[#050505]/10">
          <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#050505] flex items-center justify-center">
                <Command className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-[#050505]">Edukiato</span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold text-[#050505] uppercase tracking-wide hover:landing-text-orange transition-colors hidden sm:block"
              >
                Ingresar
              </button>
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold landing-bg-orange text-white px-6 py-3 rounded-full uppercase tracking-wider landing-bg-orange-hover transition-colors flex items-center gap-2 group"
              >
                Demo Gratis <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 max-w-[1400px] mx-auto border-b border-[#050505]/10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left Output */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#050505] rounded-full text-[#050505] font-bold text-xs uppercase tracking-widest mb-8 w-max">
                <span className="w-2 h-2 rounded-full landing-bg-orange animate-pulse"></span>
                Especial para Jardines e Infantes
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black uppercase text-[#050505] leading-[0.9] tracking-tighter mb-8">
                Gestión <br />
                <span className="landing-text-blue">Didáctica</span> <br />
                Para Aulas.
              </h1>
              
              <p className="text-lg sm:text-xl text-[#050505]/70 font-medium max-w-lg mb-10 leading-relaxed">
                Asistencia, pagos, agendas y comunicaciones con las familias. Un entorno operativo y amigable diseñado para que directivos y docentes ganen tiempo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onLoginClick}
                  className="px-8 py-4 landing-bg-orange text-white rounded-full font-bold text-lg hover:bg-[#F26A4B] transition-all flex items-center justify-center gap-3 group uppercase tracking-wide shadow-lg shadow-[#E94F32]/20"
                >
                  Iniciar Prueba <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-[#050505]/60 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2"><Heart className="text-[#E94F32] w-5 h-5" /> Vínculo Familiar</div>
                <div className="flex items-center gap-2"><ShieldCheck className="landing-text-blue w-5 h-5" /> Seguridad</div>
              </div>
            </div>

            {/* Right Visual block - Now Colorful */}
            <div className="w-full lg:w-[45%] relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 text-[#E94F32] pointer-events-none opacity-40 animate-spin-slow">
                <Shapes className="w-full h-full" />
              </div>

              <div className="relative group">
                <div className="absolute top-4 left-4 w-full h-full landing-bg-blue rounded-2xl transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#050505] bg-[#050505] h-[450px] lg:h-[550px] flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop" 
                    alt="Niños en el jardín" 
                    className="object-cover w-full h-full opacity-95 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Floating Tag */}
                  <div className="absolute bottom-6 left-6 landing-bg-orange text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    Entorno Feliz
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Statistics Bar */}
        <section className="py-16 bg-white border-b border-[#050505]/10">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-black landing-text-orange">+40%</span>
                <span className="text-[#050505]/70 font-bold uppercase tracking-wider text-sm">Ahorro de Tiempo</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-black text-[#050505]">100%</span>
                <span className="text-[#050505]/70 font-bold uppercase tracking-wider text-sm">Comunicación Segura</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-black landing-text-blue">0</span>
                <span className="text-[#050505]/70 font-bold uppercase tracking-wider text-sm">Mensajes Perdidos</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-black text-[#050505]">24/7</span>
                <span className="text-[#050505]/70 font-bold uppercase tracking-wider text-sm">Acceso a Padres</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Focus Section - Large Images */}
        <section className="py-32 px-6">
          <div className="max-w-[1400px] mx-auto space-y-32">
            
            {/* Focus 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-[#E94F32] rounded-[2rem] rotate-3 transition-transform duration-500 group-hover:rotate-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" 
                  alt="Niños aprendiendo" 
                  className="relative w-full h-[500px] object-cover rounded-[2rem] border-4 border-[#050505] shadow-2xl z-10" 
                />
              </div>
              <div className="w-full lg:w-1/2 lg:pl-10">
                <div className="w-16 h-16 rounded-full landing-bg-black text-white flex items-center justify-center mb-8">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-black text-[#050505] uppercase tracking-tighter mb-6 leading-none">Seguimiento<br/>Personalizado</h3>
                <p className="text-lg text-[#050505]/70 font-medium mb-8 leading-relaxed max-w-lg">
                  Los primeros años son fundamentales. Edukiato permite a las maestras registrar el humor, las actividades diarias, la asistencia y las notas de evolución de cada infante con un solo toque desde su celular o tablet en el aula.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 font-bold uppercase text-sm border-b border-[#050505]/10 pb-4">
                     <ArrowRight className="landing-text-orange w-5 h-5" /> Diarios de actividad
                  </li>
                  <li className="flex items-center gap-3 font-bold uppercase text-sm border-b border-[#050505]/10 pb-4">
                     <ArrowRight className="landing-text-orange w-5 h-5" /> Control de asistencia rápido
                  </li>
                </ul>
              </div>
            </div>

            {/* Focus 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-[#4338CA] rounded-[2rem] -rotate-3 transition-transform duration-500 group-hover:rotate-0"></div>
                <img 
                  src="/students_tech.png" 
                  alt="Padres y Docentes" 
                  className="relative w-full h-[500px] object-cover rounded-[2rem] border-4 border-[#050505] shadow-2xl z-10" 
                />
              </div>
              <div className="w-full lg:w-1/2 lg:pr-10">
                <div className="w-16 h-16 rounded-full bg-[#E94F32] flex items-center justify-center mb-8 text-white">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-black text-[#050505] uppercase tracking-tighter mb-6 leading-none">Familias Siempre<br/>Conectadas</h3>
                <p className="text-lg text-[#050505]/70 font-medium mb-8 leading-relaxed max-w-lg">
                  Reemplazamos el cuaderno de comunicaciones para siempre. Envía circulares, autorizaciones, recordatorios y fotos del día al panel exclusivo de los tutores de manera segura, formal y sin invadir los WhatsApp personales.
                </p>
                <button onClick={onLoginClick} className="font-bold uppercase tracking-widest text-[#4338CA] flex items-center gap-2 hover:gap-4 transition-all">
                  Ver cómo funciona el cuaderno <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Modular Bento Grid Section */}
        <section className="py-24 px-6 bg-[#050505] text-[#F7F7F5]">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-16 md:mb-24 flex flex-col md:flex-row gap-8 justify-between items-end">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none max-w-2xl">
                Un Ecosistema <br/> <span className="landing-text-orange">Modular Completo</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1: Dark Block */}
              <div className="bg-[#111111] rounded-3xl border border-white/10 p-10 flex flex-col justify-between h-[420px] lg:col-span-2 group overflow-hidden relative">
                <div className="absolute -right-20 -top-20 opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-700">
                   <Command className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full landing-bg-orange flex items-center justify-center mb-8">
                  <Shapes className="text-white w-8 h-8" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4">Múltiples Niveles y Aulas</h3>
                  <p className="text-white/70 font-medium text-lg leading-relaxed max-w-md">
                    Diseñado para soportar desde nivel sala cuna hasta preescolar, con divisiones de salas, turnos y personal asignado de manera jerárquica.
                  </p>
                </div>
              </div>

              {/* Feature 2: Blue Block */}
              <div className="landing-bg-blue rounded-3xl p-10 flex flex-col justify-between h-[420px] group relative overflow-hidden">
                <div className="absolute right-[-10%] bottom-[-10%] opacity-20 transition-transform group-hover:scale-110 duration-700">
                  <svg width="200" height="200" viewBox="0 0 100 100" fill="white">
                    <circle cx="50" cy="50" r="40" />
                  </svg>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-white flex items-center justify-center mb-8 text-[#4338CA]">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Calendario Inteligente</h3>
                  <p className="text-white/80 font-medium text-lg leading-relaxed">
                    Eventos, cumpleaños y actos divididos por curso. Visual súper fácil.
                  </p>
                </div>
              </div>

              {/* Feature 3: Light Box */}
              <div className="bg-white text-[#050505] rounded-3xl p-10 flex flex-col justify-between h-[380px] lg:col-span-1">
                <div className="w-16 h-16 rounded-full bg-[#F7F7F5] flex items-center justify-center mb-8 text-[#050505]">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#050505] uppercase tracking-tight mb-4">Legajos Centralizados</h3>
                  <p className="text-[#050505]/70 font-medium text-base">
                    Salud, autorizados de retiro y datos clínicos siempre a mano para directivos.
                  </p>
                </div>
              </div>

              {/* Feature 4: Outline Box */}
              <div className="bg-transparent border border-white/20 rounded-3xl p-10 flex flex-col justify-between h-[380px] lg:col-span-2 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end justify-between h-full">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-[#E94F32] flex items-center justify-center mb-8 text-white">
                      <PiggyBank className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4 max-w-sm">
                      Módulo de Finanzas
                    </h3>
                    <p className="text-white/70 font-medium text-lg max-w-md">
                      Seguimiento de cuotas, ingresos periódicos, recordatorios amigables de pago para las familias y control de mora institucional.
                    </p>
                  </div>
                  <button onClick={onLoginClick} className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-6 h-6 text-[#050505]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Collage Banner */}
        <section className="py-12 border-b border-[#050505]/10 overflow-hidden">
           <div className="flex flex-nowrap items-center gap-4 w-max animate-marquee">
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop" className="h-64 rounded-2xl object-cover" />
              <div className="h-64 aspect-square landing-bg-orange rounded-2xl flex items-center justify-center text-center p-6"><h2 className="text-4xl font-black uppercase text-white">Sonrisas<br/>Tranquilidad</h2></div>
              <img src="/students_hero.png" className="h-64 rounded-2xl object-cover" />
              <img src="/students_class.png" className="h-64 rounded-2xl object-cover" />
              <div className="h-64 aspect-square landing-bg-blue rounded-2xl flex items-center justify-center text-center p-6"><h2 className="text-4xl font-black uppercase text-white">Educación<br/>Conectada</h2></div>
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop" className="h-64 rounded-2xl object-cover" />
           </div>
           <style>{`
             @keyframes marquee {
               0% { transform: translateX(0); }
               100% { transform: translateX(-50%); }
             }
             .animate-marquee {
               animation: marquee 30s linear infinite;
               padding-left: 2rem;
             }
           `}</style>
        </section>

        {/* Final CTA Strip */}
        <section className="py-32 px-6 bg-white relative overflow-hidden">
          {/* Edge graphical strip */}
          <div className="absolute top-0 left-0 w-full h-2 landing-bg-orange"></div>
          
          <div className="max-w-[1000px] mx-auto text-center relative z-10 border-4 border-[#050505] rounded-[3rem] p-16 lg:p-24 shadow-[12px_12px_0px_#E94F32]">
            <h2 className="text-5xl md:text-7xl font-black uppercase text-[#050505] tracking-tighter leading-none mb-10">
              Eleva tu Jardín <br/> <span className="landing-text-blue">Hoy Mismo.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <button 
                onClick={onLoginClick}
                className="w-full sm:w-auto px-10 py-5 landing-bg-orange text-white rounded-full font-black text-xl uppercase tracking-widest hover:bg-[#F26A4B] transition-all flex items-center justify-center gap-3 group border-2 border-[#050505]"
              >
                Comenzar Demo <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-[#050505]/50 text-sm font-bold uppercase tracking-widest flex-wrap">
               <span>No requiere tarjeta</span>
               <span className="w-1 h-1 rounded-full bg-[#050505]/50"></span>
               <span>Acceso Inmediato</span>
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="landing-bg-black text-white/40 py-12 px-6 border-t border-white/10 font-medium text-sm">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="uppercase tracking-widest">
              &copy; {new Date().getFullYear()} EDUKIATO. SAAS DEMO.
            </p>
            <p className="flex items-center gap-2 uppercase tracking-widest">
              Software para <span className="text-white">Jardines e Instituciones Educativas</span>
            </p>
            <p className="flex items-center gap-2 uppercase tracking-widest">
              Powered by <a href="https://www.iatomica.com" target="_blank" rel="noopener noreferrer" className="text-white hover:landing-text-orange transition-colors font-bold">IATOMICA</a>
            </p>
          </div>
        </footer>

      </div>
    </>
  );
};

