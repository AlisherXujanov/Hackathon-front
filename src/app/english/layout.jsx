import EnglishSidebar from '../../components/english/EnglishSidebar'

export default function EnglishLayout({ children }) {
  return (
    <div className="flex relative min-h-screen">
      {/* Красивый градиентный background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 -z-10" />
      
      {/* Декоративные градиентные круги */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>
      
      {/* Тонкий паттерн */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none -z-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <EnglishSidebar />
      <main className="flex-1 relative z-0">
        {children}
      </main>
    </div>
  )
}
