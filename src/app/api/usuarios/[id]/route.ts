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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { username, password } = await request.json();
    const { id } = await params;

    const updateData: any = { username };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Check if new username is already taken by someone else
    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        createdAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { id } = await params;

    // Prevent deleting the main admin
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (userToDelete && userToDelete.username === 'admin') {
      return NextResponse.json({ error: 'No puedes eliminar al administrador principal' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
