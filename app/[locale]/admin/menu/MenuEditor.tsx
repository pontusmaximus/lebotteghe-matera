'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale, t, formatPrice } from '@/lib/i18n';
import {
  saveMenuItem, deleteMenuItem, toggleMenuItemAvailability,
  saveCategory, deleteCategory,
} from '../actions';

type Item = {
  id: string;
  nameIt: string; nameEn: string; nameDe: string;
  descIt: string | null; descEn: string | null; descDe: string | null;
  priceCents: number; allergens: string; isFrozen: boolean; available: boolean; order: number;
  categoryId: string;
};

type Category = {
  id: string; slug: string; nameIt: string; nameEn: string; nameDe: string; order: number;
  items: Item[];
};

export function MenuEditor({ locale, categories }: { locale: Locale; categories: Category[] }) {
  const dict = t(locale);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editingItem, setEditingItem] = useState<{ item: Partial<Item>; categoryId: string } | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);

  function refresh() { startTransition(() => router.refresh()); }

  return (
    <div className="space-y-8">
      <div className="flex gap-3">
        <button
          onClick={() => setEditingCat({ slug: '', nameIt: '', nameEn: '', nameDe: '', order: categories.length + 1 })}
          className="btn-primary"
        >+ {dict.admin.newCategory}</button>
      </div>

      {categories.map((cat) => (
        <section key={cat.id} className="bg-white border border-bottega-100">
          <header className="flex items-center justify-between p-4 bg-bottega-50 border-b border-bottega-100">
            <div>
              <h2 className="display text-xl text-bottega-800">{cat.nameIt}</h2>
              <p className="text-xs text-bottega-700/60">/{cat.slug} · {cat.items.length} items</p>
            </div>
            <div className="flex gap-2 text-xs uppercase tracking-widest">
              <button onClick={() => setEditingItem({ item: { categoryId: cat.id, order: cat.items.length + 1, available: true, isFrozen: false }, categoryId: cat.id })} className="text-bottega-700 hover:text-gold-600">+ {dict.admin.newItem}</button>
              <button onClick={() => setEditingCat(cat)} className="text-bottega-700 hover:text-gold-600">{dict.admin.edit}</button>
              <button
                onClick={async () => {
                  if (!confirm(`${dict.admin.delete}: ${cat.nameIt}?`)) return;
                  await deleteCategory(cat.id); refresh();
                }}
                className="text-red-700 hover:text-red-900"
              >{dict.admin.delete}</button>
            </div>
          </header>

          <ul>
            {cat.items.length === 0 && (
              <li className="px-4 py-6 text-sm text-bottega-700/60 text-center">No items</li>
            )}
            {cat.items.map((it) => (
              <li key={it.id} className="border-t border-bottega-100 px-4 py-3 flex items-start gap-4 hover:bg-bottega-50/40">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-bottega-800">{it.nameIt}</span>
                    {it.isFrozen && <span className="text-[10px] uppercase tracking-widest text-gold-600 border border-gold-500/40 px-1.5 py-0.5">surg.</span>}
                    {!it.available && <span className="text-[10px] uppercase tracking-widest text-red-700 border border-red-300 px-1.5 py-0.5">off</span>}
                    {it.allergens && <span className="text-[10px] text-bottega-700/60">all: {it.allergens}</span>}
                  </div>
                  <div className="text-xs text-bottega-700/70 truncate">
                    <span className="mr-3">EN: {it.nameEn}</span>
                    <span>DE: {it.nameDe}</span>
                  </div>
                </div>
                <div className="display text-bottega-800 whitespace-nowrap">{formatPrice(it.priceCents, locale)}</div>
                <div className="flex gap-2 text-xs uppercase tracking-widest whitespace-nowrap">
                  <button
                    onClick={async () => { await toggleMenuItemAvailability(it.id, !it.available); refresh(); }}
                    className="text-bottega-700 hover:text-gold-600"
                  >{it.available ? '⊘' : '✓'}</button>
                  <button onClick={() => setEditingItem({ item: it, categoryId: cat.id })} className="text-bottega-700 hover:text-gold-600">{dict.admin.edit}</button>
                  <button
                    onClick={async () => {
                      if (!confirm(`${dict.admin.delete}: ${it.nameIt}?`)) return;
                      await deleteMenuItem(it.id); refresh();
                    }}
                    className="text-red-700 hover:text-red-900"
                  >{dict.admin.delete}</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {editingItem && (
        <ItemModal
          dict={dict.admin}
          categories={categories}
          initial={editingItem.item}
          onClose={() => setEditingItem(null)}
          onSaved={() => { setEditingItem(null); refresh(); }}
        />
      )}
      {editingCat && (
        <CategoryModal
          dict={dict.admin}
          initial={editingCat}
          onClose={() => setEditingCat(null)}
          onSaved={() => { setEditingCat(null); refresh(); }}
        />
      )}
    </div>
  );
}

function ItemModal({
  dict, categories, initial, onClose, onSaved,
}: {
  dict: ReturnType<typeof t>['admin'];
  categories: Category[];
  initial: Partial<Item>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    if (initial.id) fd.set('id', initial.id);
    try {
      await saveMenuItem(fd);
      onSaved();
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal onClose={onClose} title={initial.id ? dict.edit : dict.newItem}>
      <form onSubmit={onSubmit} className="grid gap-3">
        <div>
          <label className="label">Categoria</label>
          <select name="categoryId" defaultValue={initial.categoryId} required className="field">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nameIt}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Field name="nameIt" label="Nome (IT)" defaultValue={initial.nameIt} required />
          <Field name="nameEn" label="Name (EN)" defaultValue={initial.nameEn} required />
          <Field name="nameDe" label="Name (DE)" defaultValue={initial.nameDe} required />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Field name="descIt" label="Descrizione (IT)" defaultValue={initial.descIt ?? ''} textarea />
          <Field name="descEn" label="Description (EN)" defaultValue={initial.descEn ?? ''} textarea />
          <Field name="descDe" label="Beschreibung (DE)" defaultValue={initial.descDe ?? ''} textarea />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="label">Prezzo (€)</label>
            <input name="price" type="number" step="0.01" min="0" defaultValue={((initial.priceCents ?? 0) / 100).toFixed(2)} required className="field" />
          </div>
          <div>
            <label className="label">Allergeni (1,3,7)</label>
            <input name="allergens" defaultValue={initial.allergens ?? ''} className="field" />
          </div>
          <div>
            <label className="label">Ordine</label>
            <input name="order" type="number" defaultValue={initial.order ?? 0} className="field" />
          </div>
          <div className="flex items-end gap-3 pb-2">
            <label className="flex items-center gap-2 text-sm">
              <input name="isFrozen" type="checkbox" defaultChecked={initial.isFrozen ?? false} /> surgelato
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="available" type="checkbox" defaultChecked={initial.available ?? true} /> disponibile
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline-dark">{dict.cancel}</button>
          <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? '...' : dict.save}</button>
        </div>
      </form>
    </Modal>
  );
}

function CategoryModal({
  dict, initial, onClose, onSaved,
}: {
  dict: ReturnType<typeof t>['admin'];
  initial: Partial<Category>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    if (initial.id) fd.set('id', initial.id);
    try {
      await saveCategory(fd);
      onSaved();
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal onClose={onClose} title={initial.id ? dict.edit : dict.newCategory}>
      <form onSubmit={onSubmit} className="grid gap-3">
        <Field name="slug" label="Slug (url)" defaultValue={initial.slug} required />
        <div className="grid grid-cols-3 gap-2">
          <Field name="nameIt" label="Nome (IT)" defaultValue={initial.nameIt} required />
          <Field name="nameEn" label="Name (EN)" defaultValue={initial.nameEn} required />
          <Field name="nameDe" label="Name (DE)" defaultValue={initial.nameDe} required />
        </div>
        <Field name="order" label="Ordine" type="number" defaultValue={initial.order ?? 0} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline-dark">{dict.cancel}</button>
          <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? '...' : dict.save}</button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  name, label, defaultValue, required, type = 'text', textarea,
}: {
  name: string; label: string; defaultValue?: any; required?: boolean; type?: string; textarea?: boolean;
}) {
  return (
    <div>
      <label className="label block mb-1">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue || ''} rows={2} className="field resize-none" />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue || ''} required={required} className="field" />
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-bottega-900/70 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-cream-50 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="display text-2xl text-bottega-800">{title}</h3>
          <button onClick={onClose} className="text-bottega-700 hover:text-gold-600 text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
