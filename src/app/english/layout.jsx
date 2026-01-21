import EnglishSidebar from '../../components/english/EnglishSidebar'

export default function EnglishLayout({ children }) {
  return (
    <div className="flex bg-gray-50 relative">
      <EnglishSidebar />
      <main className="flex-1 relative z-0">
        {children}
      </main>
    </div>
  )
}
