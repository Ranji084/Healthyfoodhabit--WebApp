import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, BarChart2, Heart, Settings, PlusCircle } from 'lucide-react';

const Layout: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/wellness', icon: Heart, label: 'Wellness' },
    { to: '/add-meal', icon: PlusCircle, label: 'Add', isAction: true },
    { to: '/progress', icon: BarChart2, label: 'Insights' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 lg:pl-20">
      {/* Header (Desktop Only Branding) */}
      <header className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-slate-100 flex-col items-center py-8 gap-8 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              if (item.isAction) {
                return "p-3 rounded-full bg-dark-green text-white shadow-lg shadow-green-200/50 hover:bg-green-800 transition transform hover:scale-105";
              }
              return `p-3 rounded-2xl transition ${
                isActive ? 'bg-green-50 text-dark-green shadow-inner' : 'text-slate-300 hover:bg-slate-50 hover:text-dark-green'
              }`;
            }}
          >
            <item.icon className="w-6 h-6" />
          </NavLink>
        ))}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-screen lg:max-w-4xl lg:ml-20">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-6 left-6 right-6 z-40 bg-dark-green h-16 rounded-[32px] px-2 flex justify-around items-center lg:hidden shadow-[0_8px_32px_rgba(1,77,51,0.3)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              if (item.isAction) {
                return "relative -top-6 w-14 h-14 bg-white rounded-full flex items-center justify-center text-dark-green shadow-xl border-4 border-dark-green active:scale-90 transition";
              }
              return `flex flex-col items-center gap-0.5 transition ${
                isActive ? 'text-white' : 'text-white/40'
              }`;
            }}
          >
            <item.icon className={item.isAction ? "w-8 h-8" : "w-5 h-5"} />
            {!item.isAction && <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
