import EnglishSidebar from '../../components/english/EnglishSidebar'

export default function EnglishLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <EnglishSidebar />
      <main className="flex-1 relative z-0">
        {children}
      </main>
    </div>
  )
}
