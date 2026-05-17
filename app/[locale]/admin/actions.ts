'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error('Unauthorized');
}

export async function updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  await requireAuth();
  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath('/[locale]/admin', 'page');
  return { ok: true as const };
}

export async function deleteReservation(id: string) {
  await requireAuth();
  await prisma.reservation.delete({ where: { id } });
  revalidatePath('/[locale]/admin', 'page');
  return { ok: true as const };
}

// ── Menu management ──────────────────────────────────────────────────────────

const ItemSchema = z.object({
  id: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  nameIt: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  nameDe: z.string().min(1).max(200),
  descIt: z.string().max(500).optional().nullable(),
  descEn: z.string().max(500).optional().nullable(),
  descDe: z.string().max(500).optional().nullable(),
  priceCents: z.coerce.number().int().min(0).max(100000),
  allergens: z.string().max(80).optional().default(''),
  isFrozen: z.coerce.boolean().optional().default(false),
  available: z.coerce.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),
});

export async function saveMenuItem(formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  // checkboxes appear only when checked
  const data = ItemSchema.parse({
    ...raw,
    isFrozen: !!raw.isFrozen,
    available: raw.available !== 'false',
    priceCents: Math.round(Number(raw.price ?? raw.priceCents ?? 0) * 100),
    allergens: String(raw.allergens || '').replace(/\s+/g, ''),
  });

  if (data.id) {
    await prisma.menuItem.update({ where: { id: data.id }, data: {
      categoryId: data.categoryId,
      nameIt: data.nameIt, nameEn: data.nameEn, nameDe: data.nameDe,
      descIt: data.descIt || null, descEn: data.descEn || null, descDe: data.descDe || null,
      priceCents: data.priceCents,
      allergens: data.allergens || '',
      isFrozen: !!data.isFrozen,
      available: !!data.available,
      order: data.order ?? 0,
    } });
  } else {
    await prisma.menuItem.create({ data: {
      categoryId: data.categoryId,
      nameIt: data.nameIt, nameEn: data.nameEn, nameDe: data.nameDe,
      descIt: data.descIt || null, descEn: data.descEn || null, descDe: data.descDe || null,
      priceCents: data.priceCents,
      allergens: data.allergens || '',
      isFrozen: !!data.isFrozen,
      available: !!data.available,
      order: data.order ?? 0,
    } });
  }
  revalidatePath('/[locale]/admin/menu', 'page');
  revalidatePath('/[locale]/menu', 'page');
  return { ok: true as const };
}

export async function deleteMenuItem(id: string) {
  await requireAuth();
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath('/[locale]/admin/menu', 'page');
  revalidatePath('/[locale]/menu', 'page');
  return { ok: true as const };
}

export async function toggleMenuItemAvailability(id: string, available: boolean) {
  await requireAuth();
  await prisma.menuItem.update({ where: { id }, data: { available } });
  revalidatePath('/[locale]/admin/menu', 'page');
  revalidatePath('/[locale]/menu', 'page');
  return { ok: true as const };
}

const CategorySchema = z.object({
  id: z.string().optional().nullable(),
  slug: z.string().min(1).max(80),
  nameIt: z.string().min(1).max(120),
  nameEn: z.string().min(1).max(120),
  nameDe: z.string().min(1).max(120),
  order: z.coerce.number().int().optional().default(0),
});

export async function saveCategory(formData: FormData) {
  await requireAuth();
  const data = CategorySchema.parse(Object.fromEntries(formData.entries()));
  if (data.id) {
    await prisma.menuCategory.update({ where: { id: data.id }, data: {
      slug: data.slug, nameIt: data.nameIt, nameEn: data.nameEn, nameDe: data.nameDe,
      order: data.order ?? 0,
    } });
  } else {
    await prisma.menuCategory.create({ data: {
      slug: data.slug, nameIt: data.nameIt, nameEn: data.nameEn, nameDe: data.nameDe,
      order: data.order ?? 0,
    } });
  }
  revalidatePath('/[locale]/admin/menu', 'page');
  revalidatePath('/[locale]/menu', 'page');
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  await requireAuth();
  await prisma.menuCategory.delete({ where: { id } });
  revalidatePath('/[locale]/admin/menu', 'page');
  revalidatePath('/[locale]/menu', 'page');
  return { ok: true as const };
}
