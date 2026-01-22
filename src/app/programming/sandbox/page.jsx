'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Card from '../../../components/Card'
import Select from '../../../components/Select'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import Input from '../../../components/Input'
import {
  HiPlay,
  HiCode,
  HiTerminal,
  HiClipboardCopy,
  HiSave,
  HiCollection,
  HiTrash,
  HiViewGrid,
  HiX,
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi'

// Динамический импорт Monaco Editor для уменьшения размера бандла
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-green-400 font-mono">Загрузка редактора...</div>
    </div>
  ),
})

export default function SandboxPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(600)
  const [previewHeight, setPreviewHeight] = useState(400)
  const [isResizing, setIsResizing] = useState(false)

  const templates = useMemo(() => ([
    {
      id: 'landing',
      label: 'Landing (UI)',
      html: `<div class="wrap">
  <header class="top">
    <div class="logo">FrameSchool</div>
    <nav class="nav">
      <a href="#">Courses</a>
      <a href="#">Cyber</a>
      <a href="#">Pricing</a>
    </nav>
    <button class="btn">Get started</button>
  </header>

  <section class="hero">
    <h1>Build skills fast</h1>
    <p>Демо-шаблон для презентации: красиво, просто, понятно.</p>
    <div class="cta">
      <button class="btn primary" id="ctaBtn">Start demo</button>
      <button class="btn ghost">See docs</button>
    </div>
    <div class="grid">
      <div class="card"><div class="t">Courses</div><div class="d">50+ карточек</div></div>
      <div class="card"><div class="t">CTF</div><div class="d">Задачи и writeups</div></div>
      <div class="card"><div class="t">Analytics</div><div class="d">Метрики и графики</div></div>
    </div>
  </section>
</div>`,
      css: `*{box-sizing:border-box} body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(135deg,#f8fafc,#fff,#eef2ff);color:#0f172a}
.wrap{max-width:980px;margin:0 auto;padding:28px}
.top{display:flex;align-items:center;gap:16px;justify-content:space-between;background:rgba(255,255,255,.7);border:1px solid rgba(15,23,42,.08);border-radius:18px;padding:14px 16px;backdrop-filter: blur(10px)}
.logo{font-weight:800;letter-spacing:.2px}
.nav{display:flex;gap:12px}
.nav a{color:#334155;text-decoration:none;font-weight:600}
.btn{border-radius:999px;border:1px solid rgba(15,23,42,.12);background:#fff;padding:10px 14px;font-weight:700;cursor:pointer}
.btn.primary{background:linear-gradient(90deg,#4f46e5,#a855f7);color:#fff;border:none}
.btn.ghost{background:transparent}
.hero{padding:34px 6px}
.hero h1{font-size:54px;line-height:1.05;margin:0 0 10px}
.hero p{margin:0 0 18px;color:#475569;font-size:18px}
.cta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.card{background:rgba(255,255,255,.75);border:1px solid rgba(15,23,42,.08);border-radius:16px;padding:14px}
.t{font-weight:800}
.d{margin-top:6px;color:#475569}
@media (max-width:720px){.grid{grid-template-columns:1fr}.hero h1{font-size:40px}}`,
      js: `console.log("Landing template loaded");
const btn = document.getElementById("ctaBtn");
btn?.addEventListener("click", () => {
  console.log("CTA clicked");
  alert("Demo CTA clicked!");
});`,
    },
    {
      id: 'todo',
      label: 'Todo (mini app)',
      html: `<div class="wrap">
  <h1>Todo Demo</h1>
  <div class="row">
    <input id="txt" placeholder="Новая задача..." />
    <button id="add">Add</button>
  </div>
  <ul id="list"></ul>
</div>`,
      css: `body{margin:0;font-family:ui-sans-serif,system-ui;background:#0b1220;color:#e2e8f0}
.wrap{max-width:680px;margin:0 auto;padding:28px}
h1{margin:0 0 14px}
.row{display:flex;gap:10px}
input{flex:1;border-radius:12px;border:1px solid rgba(226,232,240,.18);background:rgba(2,6,23,.6);color:#e2e8f0;padding:12px 14px;outline:none}
button{border-radius:12px;border:none;background:linear-gradient(90deg,#22c55e,#14b8a6);color:#04120a;font-weight:800;padding:12px 14px;cursor:pointer}
li{list-style:none;margin:10px 0;padding:12px 14px;border:1px solid rgba(226,232,240,.14);border-radius:14px;background:rgba(2,6,23,.45);display:flex;justify-content:space-between;gap:10px}
.x{opacity:.8;cursor:pointer}`,
      js: `console.log("Todo demo ready");
const txt = document.getElementById("txt");
const list = document.getElementById("list");
document.getElementById("add")?.addEventListener("click", () => {
  const v = (txt?.value || "").trim();
  if (!v) return;
  const li = document.createElement("li");
  li.innerHTML = \`<span>\${v}</span><span class='x'>✕</span>\`;
  li.querySelector(".x")?.addEventListener("click", () => li.remove());
  list?.prepend(li);
  txt.value = "";
});`,
    },
    {
      id: 'form',
      label: 'Form (lead capture)',
      html: `<div class="wrap">
  <div class="card">
    <h1>Lead Form</h1>
    <p>Форма для сбора контактов.</p>
    <form id="f">
      <label>Имя</label>
      <input name="name" placeholder="Алиса" />
      <label>Email</label>
      <input name="email" placeholder="alice@example.com" />
      <label>Интерес</label>
      <select name="track">
        <option>Programming</option>
        <option>Cybersecurity</option>
        <option>English</option>
      </select>
      <button>Send</button>
    </form>
    <div id="msg" class="msg"></div>
  </div>
</div>`,
      css: `*{box-sizing:border-box} body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(135deg,#fdf2f8,#fff,#ecfeff);color:#0f172a}
.wrap{min-height:100vh;display:grid;place-items:center;padding:24px}
.card{width:min(520px,100%);background:rgba(255,255,255,.8);border:1px solid rgba(15,23,42,.08);border-radius:18px;padding:20px;backdrop-filter: blur(10px);box-shadow: 0 12px 30px rgba(2,6,23,.08)}
h1{margin:0 0 6px}
p{margin:0 0 16px;color:#475569}
label{display:block;font-size:12px;font-weight:800;margin:12px 0 6px;color:#334155}
input,select{width:100%;border-radius:12px;border:1px solid rgba(15,23,42,.14);padding:12px 12px;outline:none}
button{margin-top:14px;width:100%;border-radius:12px;border:none;padding:12px 14px;font-weight:900;color:#fff;background:linear-gradient(90deg,#ec4899,#a855f7);cursor:pointer}
.msg{margin-top:12px;font-size:14px;color:#0f766e;font-weight:700}`,
      js: `console.log("Form demo ready");
const f = document.getElementById("f");
const msg = document.getElementById("msg");
f?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(f).entries());
  console.log("submit", data);
  msg.textContent = "Saved: " + JSON.stringify(data);
});`,
    },
  ]), [])

  const [templateId, setTemplateId] = useState(templates[0]?.id || 'landing')
  const template = useMemo(() => templates.find((t) => t.id === templateId) || templates[0], [templates, templateId])

  const [activeTab, setActiveTab] = useState('html') // html | css | js
  const [snippetTitle, setSnippetTitle] = useState('My snippet')
  const [code, setCode] = useState({ html: '', css: '', js: '' })
  const [logs, setLogs] = useState([])
  const [previewKey, setPreviewKey] = useState(0)
  const [toast, setToast] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isConsoleVisible, setIsConsoleVisible] = useState(true)

  const srcDoc = useMemo(() => {
    const escapedScript = `
      (function(){
        function send(type, payload){
          try{ parent.postMessage({ __fsSandbox: true, type: type, payload: payload }, "*"); }catch(e){}
        }
        var oldLog = console.log;
        console.log = function(){
          try{
            var msg = Array.prototype.slice.call(arguments).map(function(a){
              try{ return typeof a === "string" ? a : JSON.stringify(a); }catch(e){ return String(a); }
            }).join(" ");
            send("log", msg);
          } catch(e){}
          return oldLog.apply(console, arguments);
        };
        window.addEventListener("error", function(e){
          send("error", String(e.message || e.error || e));
        });
      })();
    `

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${code.css || ''}</style>
  </head>
  <body>
    ${code.html || ''}
    <script>${escapedScript}<\/script>
    <script>${code.js || ''}<\/script>
  </body>
</html>`
  }, [code])

  const snippetStorageKey = 'demo_snippets'
  const readSnippets = () => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(snippetStorageKey)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  const writeSnippets = (next) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(snippetStorageKey, JSON.stringify(next))
  }
  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2000)
  }

  useEffect(() => {
    // применяем шаблон
    if (!template) return
    setCode({ html: template.html, css: template.css, js: template.js })
    setLogs([])
    setPreviewKey((k) => k + 1)
  }, [templateId])

  useEffect(() => {
    const handler = (e) => {
      const data = e?.data
      if (!data || data.__fsSandbox !== true) return
      if (data.type === 'log') setLogs((prev) => [...prev, { type: 'log', text: data.payload, ts: Date.now() }].slice(-200))
      if (data.type === 'error') setLogs((prev) => [...prev, { type: 'error', text: data.payload, ts: Date.now() }].slice(-200))
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    // загрузка сниппета по ?snippet=ID
    const snippetId = searchParams?.get('snippet')
    if (!snippetId) return
    const list = readSnippets()
    const found = list.find((s) => s.id === snippetId)
    if (!found) return
    setSnippetTitle(found.title || 'Demo snippet')
    setCode({ html: found.html || '', css: found.css || '', js: found.js || '' })
    setLogs([])
    setPreviewKey((k) => k + 1)
  }, [searchParams])

  useEffect(() => {
    // загрузка шаблона по ?template=ID (если не выбран snippet)
    const snippetId = searchParams?.get('snippet')
    if (snippetId) return
    const t = searchParams?.get('template')
    if (!t) return
    const exists = templates.some((x) => x.id === t)
    if (exists) setTemplateId(t)
  }, [searchParams, templates])

  // Автоматическое изменение размера редактора
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = window.innerHeight - 200 // Вычитаем высоту хедера и панели управления
        setEditorHeight(Math.max(400, containerHeight))
        setPreviewHeight(Math.max(300, containerHeight * 0.6))
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const run = () => {
    setLogs([])
    setPreviewKey((k) => k + 1)
  }

  const saveSnippet = () => {
    const id = `snip_${Date.now()}`
    const payload = {
      id,
      title: (snippetTitle || 'Demo snippet').trim(),
      html: code.html,
      css: code.css,
      js: code.js,
      updatedAt: new Date().toISOString(),
    }
    const next = [payload, ...readSnippets()].slice(0, 30)
    writeSnippets(next)
    showToast('Сниппет сохранён')
    router.replace(`/programming/sandbox?snippet=${id}`)
  }

  const shareSnippet = async () => {
    const json = JSON.stringify({ title: snippetTitle, ...code }, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      showToast('JSON скопирован')
    } catch {
      showToast('Не удалось скопировать')
    }
  }

  const clearConsole = () => setLogs([])

  const getLanguage = (tab) => {
    if (tab === 'html') return 'html'
    if (tab === 'css') return 'css'
    if (tab === 'js') return 'javascript'
    return 'plaintext'
  }

  const handleEditorChange = (value) => {
    setCode((prev) => ({ ...prev, [activeTab]: value || '' }))
  }

  return (
    <main className="w-full overflow-hidden min-h-screen bg-gray-50" ref={containerRef}>
      {!isFullscreen && (
        <div className="container-wrapper pt-24 sm:pt-28 pb-4">
          <ScrollAnimation>
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Code Sandbox</h1>
              <p className="text-base md:text-lg text-gray-600">
                Профессиональный онлайн-редактор кода с подсветкой синтаксиса и живым превью
              </p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-4 mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-3">
                  <Select
                    id="template"
                    label="Шаблон"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    options={templates.map((t) => ({ value: t.id, label: t.label }))}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Input
                    id="snippetTitle"
                    label="Название сниппета"
                    value={snippetTitle}
                    onChange={(e) => setSnippetTitle(e.target.value)}
                    placeholder="Например: Landing demo"
                  />
                </div>
                <div className="lg:col-span-6 flex flex-col sm:flex-row gap-2 sm:items-end justify-end">
                  <div className="flex gap-2">
                    <Button onClick={run} variant="primary" leftIcon={<HiPlay />} className="w-full sm:w-auto">
                      Run
                    </Button>
                    <Button onClick={saveSnippet} variant="outline" leftIcon={<HiSave />} className="w-full sm:w-auto">
                      Save
                    </Button>
                    <Button onClick={shareSnippet} variant="outline" leftIcon={<HiClipboardCopy />} className="w-full sm:w-auto">
                      Share
                    </Button>
                    <Button 
                      onClick={() => setIsFullscreen(!isFullscreen)} 
                      variant="outline" 
                      leftIcon={<HiViewGrid />} 
                      className="w-full sm:w-auto"
                    >
                      Fullscreen
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-600 inline-flex items-center gap-2">
                  <HiCollection className="w-5 h-5 text-primary-600" />
                  <Link className="font-semibold text-primary-700 underline underline-offset-4" href="/programming/snippets">
                    Открыть галерею сниппетов
                  </Link>
                </div>
                <Button variant="ghost" size="sm" onClick={clearConsole} className="text-slate-700">
                  <HiTrash className="w-4 h-4 mr-2" />
                  Очистить консоль
                </Button>
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      )}

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-gray-50 pt-16">
          <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Code Sandbox</h2>
              <div className="flex gap-2">
                <Button onClick={run} variant="primary" size="sm" leftIcon={<HiPlay />}>
                  Run
                </Button>
                <Button onClick={saveSnippet} variant="outline" size="sm" leftIcon={<HiSave />}>
                  Save
                </Button>
              </div>
            </div>
            <Button 
              onClick={() => setIsFullscreen(false)} 
              variant="ghost" 
              size="sm"
              leftIcon={<HiX />}
            >
              Exit Fullscreen
            </Button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-24 z-50">
          <div className="rounded-full bg-slate-900 text-white text-sm font-semibold px-4 py-2 shadow-lg inline-flex items-center gap-2">
            <HiCode className="w-5 h-5" />
            {toast}
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${isFullscreen ? 'h-[calc(100vh-64px)]' : 'container-wrapper pb-8'}`}>
        {/* Редактор кода */}
        <div className={`${isFullscreen ? 'h-full' : ''} flex flex-col`}>
          <Card variant="glass" className={`overflow-hidden flex flex-col ${isFullscreen ? 'h-full m-0 rounded-none' : 'mb-0'}`}>
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-2 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <HiCode className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Code Editor</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {['html', 'css', 'js'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
                        activeTab === tab
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={`flex-1 ${isFullscreen ? 'h-full' : ''}`} style={{ minHeight: isFullscreen ? '0' : `${editorHeight}px` }}>
              <Editor
                height={isFullscreen ? '100%' : `${editorHeight}px`}
                language={getLanguage(activeTab)}
                value={code[activeTab]}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  acceptSuggestionOnEnter: 'on',
                  tabCompletion: 'on',
                }}
              />
            </div>
          </Card>
        </div>
        
        {/* Превью и консоль */}
        <div className={`${isFullscreen ? 'h-full' : ''} flex flex-col`}>
          <Card variant="glass" className={`overflow-hidden flex flex-col ${isFullscreen ? 'h-full m-0 rounded-none' : 'mb-0'}`}>
            {/* Заголовок Preview */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
              <div className="font-semibold text-gray-900 inline-flex items-center gap-2">
                <HiTerminal className="w-5 h-5 text-primary-600" />
                Preview
              </div>
            </div>
            
            {/* Превью - занимает больше места */}
            <div 
              className={`flex-1 bg-white overflow-hidden ${isConsoleVisible ? 'border-b border-gray-200' : ''}`}
              style={{ 
                minHeight: isFullscreen 
                  ? (isConsoleVisible ? 'calc(100% - 200px)' : '100%') 
                  : (isConsoleVisible ? `${previewHeight * 0.75}px` : `${previewHeight}px`)
              }}
            >
              <iframe
                key={previewKey}
                title="preview"
                className="w-full h-full"
                sandbox="allow-scripts"
                srcDoc={srcDoc}
              />
            </div>

            {/* Консоль - сворачиваемая */}
            {isConsoleVisible && (
              <div className="flex flex-col border-t border-gray-200" style={{ height: isFullscreen ? '200px' : `${previewHeight * 0.25}px` }}>
                {/* Заголовок консоли */}
                <div className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <HiTerminal className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-gray-200">Console</span>
                    {logs.length > 0 && (
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-semibold rounded-full">
                        {logs.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearConsole}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                      title="Очистить консоль"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsConsoleVisible(false)}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                      title="Скрыть консоль"
                    >
                      <HiChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Содержимое консоли */}
                <div className="flex-1 p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-auto">
                  {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-500">Console output will appear here…</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {logs.map((l, idx) => (
                        <div 
                          key={`${l.ts}-${idx}`} 
                          className={`flex items-start gap-2 ${
                            l.type === 'error' 
                              ? 'text-red-400 bg-red-900/20 border-l-2 border-red-500 pl-2 py-1' 
                              : 'text-green-300 hover:bg-gray-800/50 px-2 py-0.5 rounded'
                          }`}
                        >
                          <span className="text-gray-500 text-[10px] font-semibold min-w-[40px]">
                            {new Date(l.ts).toLocaleTimeString()}
                          </span>
                          <span className="flex-1 break-words">
                            {l.type === 'error' && (
                              <span className="text-red-400 font-semibold mr-2">[ERROR]</span>
                            )}
                            {l.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Кнопка показать консоль, если она скрыта */}
            {!isConsoleVisible && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
                <button
                  onClick={() => setIsConsoleVisible(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiChevronUp className="w-4 h-4" />
                  <span>Показать консоль</span>
                  {logs.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                      {logs.length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
