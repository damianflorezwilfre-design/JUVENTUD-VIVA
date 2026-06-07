export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return false;
  return await verifyToken(session) !== null;
}

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        modules: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { username, password, role, modules } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || 'EDITOR',
        modules: modules || '',
      },
      select: {
        id: true,
        username: true,
        role: true,
        modules: true,
        createdAt: true,
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
