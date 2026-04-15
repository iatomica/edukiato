import React from 'react';
import { ArrowRight, BookOpen, Calendar, CircleUser, LayoutDashboard, MessageCircle, PiggyBank, ShieldCheck, Star } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans overflow-x-hidden selection:bg-rose-300 selection:text-slate-900">
      {/* Playful Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-xl border-b-2 border-rose-100/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[1.5rem] bg-gradient-to-br from-rose-400 to-amber-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-rose-400/30 -rotate-3">
              E
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">Edukiato</span>
          </div>
          <div className="flex items-center gap-5">
            <button 
              onClick={onLoginClick}
              className="text-base font-bold text-slate-500 hover:text-rose-500 transition-colors hidden sm:block"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={onLoginClick}
              className="text-base font-bold bg-sky-400 text-white px-7 py-3 rounded-full hover:bg-sky-500 hover:scale-105 hover:-rotate-1 transition-all shadow-xl shadow-sky-400/20 active:scale-95"
            >
              Demo Interactiva ✨
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 px-4">
        {/* Background Blobs */}
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-200/40 rounded-full blur-3xl opacity-60 translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl opacity-60 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-rose-200/40 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Column (Text) */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-bold text-sm mb-6 shadow-sm">
                <Star size={16} fill="currentColor" /> Diseñado para Instituciones Educativas
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-slate-800 tracking-tight leading-[1.1] mb-8">
                El entorno ideal para <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">tu Institución</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Asistencia, pagos, agendas y comunicaciones centralizadas en una sola app, súper fácil, limpia y amigable para docentes, directivos y familias.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-9 py-5 bg-rose-400 text-white rounded-full font-bold text-xl hover:bg-rose-500 hover:scale-105 transition-all shadow-xl shadow-rose-400/30 active:scale-95 flex items-center justify-center gap-3 group"
                >
                  Probar Demo Gratis <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-400 font-bold text-sm flex-wrap">
                <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-sky-400" /> Seguro</div>
                <div className="flex items-center gap-2"><CircleUser size={20} className="text-amber-400" /> Padres felices</div>
              </div>
            </div>

            {/* Right Column (Image) */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-300 to-sky-300 rounded-[3rem] rotate-3 opacity-70 group-hover:rotate-6 transition-transform duration-500 blur-sm"></div>
              <img 
                src="/kinder_playing.png" 
                alt="Alumnos en clase" 
                className="relative w-full object-cover h-[450px] lg:h-[550px] rounded-[3rem] shadow-2xl z-10 border-8 border-white"
              />
              
              {/* Floating cute badge */}
              <div className="absolute -left-8 top-12 bg-white p-4 rounded-[2rem] shadow-xl z-20 hidden md:flex items-center gap-4 animate-bounce hover:animate-none">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400">Seguridad Total</p>
                  <p className="text-lg font-black text-slate-700">100% Protegidos</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Section with Alternating Layouts */}
      <section className="py-24 bg-white/50 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6">Un espacio creado a su medida</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Reemplazamos los medios de comunicación tradicionales por una experiencia que enlaza la institución con las familias.</p>
          </div>

          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-emerald-200 rounded-[3rem] -rotate-3 opacity-60 transition-transform duration-500 group-hover:rotate-0 blur-sm"></div>
                <img src="/kinder_story.png" alt="Docente enseñando" className="relative w-full h-[400px] object-cover rounded-[3rem] border-8 border-white shadow-xl z-10" />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="w-16 h-16 rounded-[2rem] bg-emerald-100 text-emerald-500 flex items-center justify-center mb-6">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Gestión de Aulas e Historias</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">Lleva el registro de asistencia en un clic, gestiona al personal a cargo y mantén un registro de las actividades diarias para que las familias estén siempre al tanto del desarrollo académico y personal de los alumnos.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-sky-200 rounded-[3rem] rotate-3 opacity-60 transition-transform duration-500 group-hover:-rotate-2 blur-sm"></div>
                <img src="/kinder_painting.png" alt="Actividad escolar" className="relative w-full h-[400px] object-cover rounded-[3rem] border-8 border-white shadow-xl z-10" />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col lg:items-end lg:text-right">
                  <div className="w-16 h-16 rounded-[2rem] bg-sky-100 text-sky-500 flex items-center justify-center mb-6">
                    <MessageCircle size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-4">Comunicación Instantánea</h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium lg:text-right">Mensajería segura y directa. Mantén a los tutores informados sin depender de WhatsApp. Se envía directo al panel familiar asegurando una comunicación formal pero cercana.</p>
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-32">
            <div className="p-10 rounded-[3rem] bg-amber-50 border-4 border-white shadow-xl hover:shadow-amber-100/50 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-amber-200/50 text-amber-600 flex items-center justify-center mb-6">
                <Calendar size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">Calendario Interactivo</h3>
              <p className="text-lg text-slate-600 font-medium">Eventos, cumpleaños y actos divididos por curso o nivel. Organización visual súper fácil.</p>
            </div>
            <div className="p-10 rounded-[3rem] bg-rose-50 border-4 border-white shadow-xl hover:shadow-rose-100/50 transition-all flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-rose-200/50 text-rose-600 flex items-center justify-center mb-6">
                <PiggyBank size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">Finanzas Transparentes</h3>
              <p className="text-lg text-slate-600 font-medium">Módulo simple para ver ingresos, enviar recordatorios de cuotas y gestionar pagos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 px-4 bg-sky-400 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-300 opacity-20 rounded-[4rem] rotate-12 blur-2xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">Es hora de gestionar<br/> a otro nivel.</h2>
          <p className="text-sky-100 mb-12 text-xl sm:text-2xl font-medium">Invita a directivos, docentes y padres a disfrutar de una herramienta que simplifica todo.</p>
          <button 
            onClick={onLoginClick}
            className="px-12 py-6 bg-white text-sky-500 rounded-full font-black text-2xl hover:bg-slate-50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
          >
            Vamos a Explorar 🪁
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FDFBF7] text-slate-400 py-12 text-center text-base font-bold border-t-2 border-slate-100">
        <p>&copy; {new Date().getFullYear()} Edukiato Demo. Creado con ❤️ por <a href="https://www.iatomica.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">IATOMICA</a>.</p>
      </footer>
    </div>
  );
};

