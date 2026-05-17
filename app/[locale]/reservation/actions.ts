'use server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(5).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1).max(20),
  notes: z.string().max(500).optional().nullable(),
  language: z.enum(['it', 'de', 'en']).default('it'),
});

export async function submitReservation(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || 'Invalid input' };
  }
  const data = parsed.data;
  const dt = new Date(`${data.date}T${data.time}:00`);
  if (Number.isNaN(dt.getTime())) {
    return { ok: false as const, error: 'Invalid date/time' };
  }
  if (dt.getTime() < Date.now() - 60_000) {
    return { ok: false as const, error: 'Cannot reserve in the past' };
  }

  await prisma.reservation.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      date: dt,
      guests: data.guests,
      notes: data.notes?.trim() || null,
      language: data.language,
      status: 'pending',
    },
  });

  return { ok: true as const };
}
