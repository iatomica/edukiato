import React from 'react';
import { ArrowRight, BookOpen, Calendar, CircleUser, LayoutDashboard, MessageCircle, PiggyBank, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-slate-900/20">
              E
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Edukatio</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={onLoginClick}
              className="text-sm font-semibold bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95"
            >
              Demo interactiva
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-300/30 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-3xl opacity-60 -translate-x-1/3 translate-y-1/4"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            El ecosistema perfecto para <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">tu Jardín Infantil</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Centraliza asistencia, pagos, comunicación y reportes en una sola plataforma. Diseño extremadamente limpio y moderno pensado especialmente para la educación inicial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              Comenzar Demo Gratis <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex items-center justify-center gap-6 text-slate-500 font-medium text-sm flex-wrap">
            <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Datos Seguros y Privados</div>
            <div className="flex items-center gap-2"><CircleUser size={20} className="text-blue-500" /> Acceso Real de Padres</div>
            <div className="flex items-center gap-2"><LayoutDashboard size={20} className="text-purple-500" /> Paneles por Rol Integrados</div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-6">Todo lo que necesitas para tu día a día</h2>
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium">Simplificamos las tareas administrativas engorrosas para que el equipo de educadores pueda enfocarse en lo que importa: acompañar el desarrollo infantil.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feat 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Comunicación Directa</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Mensajería instantánea y segura entre directivos, docentes y padres. Olvídate definitivamente de los cuadernos en papel.</p>
            </div>

            {/* Feat 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gestión de Aulas</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Conoce exactamente qué niños asisten, mantén el registro actualizado de docentes y centraliza todas las actividades aúlicas en segundos.</p>
            </div>

            {/* Feat 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Calendario Interactivo</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Filtra eventos, cumpleaños institucionales, talleres con padres o actos cívicos en un solo lugar. Transparencia total inter-áreas.</p>
            </div>
            
            {/* Feat 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group lg:col-start-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PiggyBank size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Control de Finanzas</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Panel de recaudación con el estado en tiempo real de aportes, cuotas y deudas. Seguimiento estricto y transparente para el área contable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 px-4 bg-slate-900 text-center text-white">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">¿Listo para transformar tu institución?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg sm:text-xl font-medium">Accede a una experiencia completamente interactiva y siente cómo Edukatio eleva los estándares operativos para Directivos, Docentes y Padres por igual.</p>
        <button 
          onClick={onLoginClick}
          className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg sm:text-xl hover:bg-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 active:translate-y-0"
        >
          Explorar Entorno de Prueba
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-10 text-center text-sm font-medium border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Edukatio Development Preview — IAtomica Labs</p>
      </footer>
    </div>
  );
};
