import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/classes')) {
    // В Next.js proxy работает на сервере, поэтому мы не можем напрямую проверить localStorage
    // Проверяем наличие токена в cookies (если он там есть) или пропускаем для клиентской проверки
    // Основная проверка роли будет на клиентской стороне
    
    // Если токен есть в cookies, пропускаем (проверка роли будет на клиенте)
    // Если токена нет, можно перенаправить на логин, но лучше проверить на клиенте
    return NextResponse.next()
  }

  if (pathname.startsWith('/invitations')) {
    const role = request.cookies.get('user_role')?.value
    if (role === 'teacher') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/classes/:path*', '/invitations/:path*'],
}
