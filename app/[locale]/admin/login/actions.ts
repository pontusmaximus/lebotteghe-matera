'use server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  if (!email || !password) return { ok: false as const };

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { ok: false as const };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false as const };

  await createSession({ sub: user.id, email: user.email, name: user.name ?? undefined });
  return { ok: true as const };
}
