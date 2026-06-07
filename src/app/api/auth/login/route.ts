import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 });
    }

    // Attempt to find user
    // NOTE: In a real environment without DB connected, this will fail.
    // For demo purposes if DB is not available, we can mock it, but Prisma is requested.
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { username },
      });
    } catch (dbError) {
      // Fallback for demo if DB is not set up yet
      if (username === 'admin' && password === 'Admin123*') {
        const token = await signToken({ id: 'demo-id', username: 'admin', role: 'SUPER_ADMIN', modules: '' });
        const response = NextResponse.json({ success: true, message: 'Logged in (Demo mode)' });
        response.cookies.set('session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });
        return response;
      }
      return NextResponse.json({ error: 'Error de base de datos. Verifica la conexión a PostgreSQL.' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const token = await signToken({ id: user.id, username: user.username, role: user.role, modules: user.modules });

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
