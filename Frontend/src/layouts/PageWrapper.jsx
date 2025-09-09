// src/layouts/PageWrapper.jsx

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Light blur animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-2xl opacity-20 pointer-events-none" />

      {/* Glass card */}
      <div className="max-w-2xl w-full text-center z-10 bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-white/20 shadow-lg">
        {children}
      </div>
    </div>
  );
}
