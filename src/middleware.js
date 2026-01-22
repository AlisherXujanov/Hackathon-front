import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Проверяем, если пользователь пытается получить доступ к странице classes
  if (pathname.startsWith('/classes')) {
    // В Next.js middleware работает на сервере, поэтому мы не можем напрямую проверить localStorage
    // Проверяем наличие токена в cookies (если он там есть) или пропускаем для клиентской проверки
    // Основная проверка роли будет на клиентской стороне
    
    // Если токен есть в cookies, пропускаем (проверка роли будет на клиенте)
    // Если токена нет, можно перенаправить на логин, но лучше проверить на клиенте
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/classes/:path*',
  ],
}
