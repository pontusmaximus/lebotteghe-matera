import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  {
    slug: 'antipasti',
    nameIt: 'Antipasti',
    nameEn: 'Appetizers',
    nameDe: 'Vorspeisen',
    order: 1,
    items: [
      { nameIt: 'Degustazione de "Le Botteghe"', nameEn: 'Mixed house appetizers "tasters"', nameDe: 'Hauseigene Vorspeisen-Probierplatte', priceCents: 1400, allergens: '1,3,7' },
      { nameIt: 'La Cialledda', nameEn: 'Traditional Materan soaked bread with tomatoes, cucumber, onion, basil & oregano', nameDe: 'Traditionelles Materaner Brot mit Tomaten, Gurke, Zwiebel, Basilikum & Oregano', priceCents: 900, allergens: '1' },
      { nameIt: 'Purea di Fave e Cicorie', nameEn: 'Broad bean purée with chicory', nameDe: 'Saubohnenpüree mit Chicorée', priceCents: 1200, allergens: '' },
      { nameIt: 'Fave e Cicorie 2.0 con Tentacolo di Polpo Arrosto', nameEn: 'Broad bean & chicory purée with roasted octopus tentacle', nameDe: 'Saubohnen-Chicorée-Püree mit gebratenem Oktopustentakel', priceCents: 1800, allergens: '14' },
      { nameIt: 'Peperone Crusco', nameEn: '"Crusco" pepper', nameDe: '"Crusco" Paprika (knusprig)', priceCents: 800, allergens: '' },
      { nameIt: 'Affumicati di Mare (Pesce Spada, Salmone, Tonno)', nameEn: 'Smoked swordfish, salmon and tuna', nameDe: 'Geräucherter Schwertfisch, Lachs und Thunfisch', priceCents: 1900, allergens: '4' },
      { nameIt: 'Salmone Affumicato su Fogli Croccanti di Pasta Fillo', nameEn: 'Smoked salmon on crispy phyllo pastry', nameDe: 'Räucherlachs auf knusprigen Filoteigblättern', priceCents: 1800, allergens: '1,4' },
      { nameIt: 'Tagliere di Salumi e Formaggi del Territorio (per 2)', nameEn: 'Typical cured meats and cheeses board (for 2)', nameDe: 'Brett mit typischem Aufschnitt und Käse (für 2)', priceCents: 2600, allergens: '7' },
      { nameIt: 'Carpaccio di Angus e Bufala Campana', nameEn: 'Angus carpaccio with Neapolitan buffalo mozzarella', nameDe: 'Angus-Carpaccio mit Büffelmozzarella', priceCents: 1800, allergens: '7,8' },
      { nameIt: 'Veli di Bresaola IGP, Rucola e Grana con Mozzarella', nameEn: 'Bresaola IGP, rocket and grana with mozzarella', nameDe: 'Bresaola IGP, Rucola und Grana mit Mozzarella', priceCents: 1600, allergens: '7' },
      { nameIt: 'Prosciutto e Melone', nameEn: 'Ham and melon', nameDe: 'Schinken und Melone', priceCents: 1000, allergens: '' },
      { nameIt: 'Caprese', nameEn: 'Tomato, mozzarella and basil', nameDe: 'Tomate, Mozzarella und Basilikum', priceCents: 1200, allergens: '7' },
      { nameIt: 'Bruschetta Classica (2 pezzi)', nameEn: '2 bruschettas with tomato, garlic and basil', nameDe: '2 Bruschette mit Tomate, Knoblauch und Basilikum', priceCents: 600, allergens: '1' },
      { nameIt: 'Tris di Bruschette delle Botteghe', nameEn: 'Three chef bruschettas', nameDe: 'Drei Chef-Bruschette', priceCents: 900, allergens: '1,7' },
    ],
  },
  {
    slug: 'primi',
    nameIt: 'Primi',
    nameEn: 'First Courses',
    nameDe: 'Erste Gänge',
    order: 2,
    items: [
      { nameIt: 'Capuntini allo Scoglio', nameEn: 'Seafood "capuntini" pasta', nameDe: '"Capuntini"-Nudeln mit Meeresfrüchten', priceCents: 1800, allergens: '1,2,4,9,14' },
      { nameIt: 'Raviolo di Cernia con Coulis di Datterino Rosso e Polvere di Oliva', nameEn: 'Grouper raviolo with red datterino coulis and olive powder', nameDe: 'Zackenbarsch-Raviolo mit Datterino-Coulis und Olivenpulver', priceCents: 1900, allergens: '1,4,7', isFrozen: true },
      { nameIt: 'Spaghetti al Pomodoro e Basilico', nameEn: 'Spaghetti with tomato sauce and basil', nameDe: 'Spaghetti mit Tomatensauce und Basilikum', priceCents: 1000, allergens: '1' },
      { nameIt: 'Parmigiana di Melanzane', nameEn: 'Traditional eggplant parmesan', nameDe: 'Traditionelle Auberginen-Parmigiana', priceCents: 1400, allergens: '1,3,7' },
      { nameIt: 'Cavatelli alla Lucana', nameEn: '"Cavatelli" pasta with sausage, mushrooms, crusco pepper and breadcrumbs', nameDe: '"Cavatelli"-Nudeln mit Salsiccia, Pilzen, Crusco-Paprika und Brösel', priceCents: 1400, allergens: '1' },
      { nameIt: 'Ferricelli con Crema di Crusco e Fave Fritte Croccanti', nameEn: '"Ferricelli" pasta with crusco pepper cream and crispy fried broad beans', nameDe: '"Ferricelli"-Nudeln mit Crusco-Creme und knusprigen Saubohnen', priceCents: 1200, allergens: '1' },
      { nameIt: 'Orecchiette con Cime di Rapa e Mollica Fritta', nameEn: '"Orecchiette" pasta with turnip tops and fried breadcrumbs', nameDe: '"Orecchiette" mit Stängelkohl und gerösteten Bröseln', priceCents: 1300, allergens: '1' },
      { nameIt: 'Mezzi Paccheri Rigati alla Carbonara Lucana', nameEn: '"Paccheri" pasta with eggs, sausage, crusco pepper and cheese', nameDe: '"Paccheri" mit Ei, Salsiccia, Crusco-Paprika und Käse', priceCents: 1600, allergens: '1,3,7' },
      { nameIt: 'Bucatini alla Carbonara', nameEn: '"Bucatini" pasta with eggs, pork cheek and cheese', nameDe: '"Bucatini" mit Ei, Guanciale und Käse', priceCents: 1400, allergens: '1,3,7' },
      { nameIt: "Tagliatelle all'Uovo alla Bolognese", nameEn: 'Egg "tagliatelle" with meat ragout', nameDe: 'Eier-Tagliatelle mit Fleisch-Ragout', priceCents: 1600, allergens: '1,3,9' },
    ],
  },
  {
    slug: 'secondi-terra',
    nameIt: 'Secondi di Terra',
    nameEn: 'Meat Mains',
    nameDe: 'Fleischgerichte',
    order: 3,
    items: [
      { nameIt: 'Tagliata di Vitello 300gr con Rucola, Pomodorini e Grana', nameEn: 'Sliced veal 300g with rocket, tomatoes and grana', nameDe: 'Kalbs-Tagliata 300g mit Rucola, Kirschtomaten und Grana', priceCents: 2200, allergens: '7' },
      { nameIt: 'Entrecote di Vitello 200gr', nameEn: 'Veal entrecôte 200g', nameDe: 'Kalbs-Entrecôte 200g', priceCents: 1800, allergens: '' },
      { nameIt: 'Salsiccia di Maiale di Grassano con Rucola e Pomodorini', nameEn: '"Grassano" pork sausage with rocket and tomatoes', nameDe: '"Grassano"-Schweinswurst mit Rucola und Tomaten', priceCents: 1500, allergens: '8' },
      { nameIt: "Zampina di Vitello con Misticanza dell'Orto", nameEn: 'Long veal sausage with mixed garden salad', nameDe: 'Lange Kalbswurst mit gemischtem Gartensalat', priceCents: 1500, allergens: '8' },
      { nameIt: 'Spezzatino', nameEn: 'Meat stew', nameDe: 'Fleischeintopf', priceCents: 1400, allergens: '9' },
    ],
  },
  {
    slug: 'secondi-mare',
    nameIt: 'Secondi di Mare',
    nameEn: 'Fish Mains',
    nameDe: 'Fischgerichte',
    order: 4,
    items: [
      { nameIt: 'Filetto di Branzino alle Mandorle con Insalata', nameEn: 'Sea bass fillet with almonds and salad', nameDe: 'Wolfsbarschfilet mit Mandeln und Salat', priceCents: 1800, allergens: '4,8', isFrozen: true },
      { nameIt: 'Gamberoni Argentini al Brandy e Datterino Giallo N.4', nameEn: 'Argentinian prawns with brandy and yellow datterino sauce', nameDe: 'Argentinische Garnelen mit Brandy und gelben Datterino', priceCents: 2000, allergens: '2', isFrozen: true },
      { nameIt: 'Frittura di Anelli di Calamari', nameEn: 'Fried calamari rings', nameDe: 'Frittierte Calamari-Ringe', priceCents: 1900, allergens: '1,4', isFrozen: true },
      { nameIt: 'Baccalà in Umido alla Lucana', nameEn: 'Stewed cod, Lucana style', nameDe: 'Geschmorter Stockfisch nach lukanischer Art', priceCents: 1600, allergens: '4' },
    ],
  },
  {
    slug: 'contorni',
    nameIt: 'Contorni',
    nameEn: 'Side Orders',
    nameDe: 'Beilagen',
    order: 5,
    items: [
      { nameIt: 'Patate al Forno', nameEn: 'Roasted potatoes', nameDe: 'Ofenkartoffeln', priceCents: 500 },
      { nameIt: 'Patatine Fritte', nameEn: 'French fries', nameDe: 'Pommes frites', priceCents: 500, isFrozen: true },
      { nameIt: 'Patate alla Cenere', nameEn: 'Ash potatoes', nameDe: 'Aschekartoffeln', priceCents: 400 },
      { nameIt: 'Cipolla Rossa di Tropea alla Griglia', nameEn: 'Grilled red onion', nameDe: 'Gegrillte rote Zwiebel', priceCents: 400, allergens: '12' },
      { nameIt: "Misticanza dell'Orto", nameEn: 'Mixed garden salad', nameDe: 'Gemischter Gartensalat', priceCents: 500 },
      { nameIt: 'Cicoria Saltata', nameEn: 'Sautéed chicory', nameDe: 'Sautierter Chicorée', priceCents: 500 },
      { nameIt: 'Insalatona Mista', nameEn: 'Large mixed salad (lettuce, tomato, corn, onion, olives, tuna, mozzarella)', nameDe: 'Großer gemischter Salat (Salat, Tomate, Mais, Zwiebel, Oliven, Thunfisch, Mozzarella)', priceCents: 1000, allergens: '12' },
    ],
  },
  {
    slug: 'dessert',
    nameIt: 'Dessert',
    nameEn: 'Dessert',
    nameDe: 'Dessert',
    order: 6,
    items: [
      { nameIt: 'Coppa Gelato "Le Botteghe"', nameEn: 'Ice cream cup with cream and chocolate', nameDe: 'Eisbecher mit Sahne und Schokolade', priceCents: 500, allergens: '7,8', isFrozen: true },
      { nameIt: 'Tiramisù', nameEn: 'Italian tiramisù', nameDe: 'Italienisches Tiramisù', priceCents: 500, allergens: '1,7' },
      { nameIt: 'Cheesecake ai Frutti di Bosco', nameEn: 'Cheesecake with berries', nameDe: 'Cheesecake mit Waldbeeren', priceCents: 500, allergens: '1,7', isFrozen: true },
      { nameIt: 'Croccantino al Pistacchio', nameEn: 'Pistachio crunch', nameDe: 'Pistazien-Croccantino', priceCents: 500, allergens: '1,7,8', isFrozen: true },
      { nameIt: 'Delicato al Limone', nameEn: 'Lemon dessert', nameDe: 'Zitronen-Dessert', priceCents: 500, allergens: '7', isFrozen: true },
      { nameIt: '3 Cioccolati (senza glutine e lattosio)', nameEn: 'Three-chocolate dessert (gluten- and lactose-free)', nameDe: 'Drei-Schokoladen-Dessert (gluten- und laktosefrei)', priceCents: 600, isFrozen: true },
      { nameIt: 'Sorbetto al Limone', nameEn: 'Lemon sorbet', nameDe: 'Zitronensorbet', priceCents: 400, isFrozen: true },
    ],
  },
  {
    slug: 'bevande',
    nameIt: 'Bevande',
    nameEn: 'Drinks',
    nameDe: 'Getränke',
    order: 7,
    items: [
      { nameIt: 'Acqua 1lt', nameEn: 'Water 1L', nameDe: 'Wasser 1L', priceCents: 300 },
      { nameIt: 'Soft Drink', nameEn: 'Soft drink', nameDe: 'Softdrink', priceCents: 400 },
      { nameIt: 'Birra Spina Pils "Troilo" 0,4L', nameEn: 'Draft Pils "Troilo" 0.4L', nameDe: 'Fass-Pils "Troilo" 0,4L', priceCents: 500 },
      { nameIt: 'Birra Spina Rossa "Troilo" 0,4L', nameEn: 'Draft red beer "Troilo" 0.4L', nameDe: 'Rotbier vom Fass "Troilo" 0,4L', priceCents: 600 },
      { nameIt: 'Peroni "Gran Riserva" 0,5lt', nameEn: 'Peroni "Gran Riserva" 0.5L', nameDe: 'Peroni "Gran Riserva" 0,5L', priceCents: 500 },
      { nameIt: 'Calice di Vino', nameEn: 'Glass of wine', nameDe: 'Glas Wein', priceCents: 500 },
    ],
  },
  {
    slug: 'bar',
    nameIt: 'Bar',
    nameEn: 'Bar',
    nameDe: 'Bar',
    order: 8,
    items: [
      { nameIt: 'Caffè', nameEn: 'Espresso', nameDe: 'Espresso', priceCents: 200 },
      { nameIt: 'Decaffeinato', nameEn: 'Decaf', nameDe: 'Entkoffeiniert', priceCents: 250 },
      { nameIt: 'Caffè Corretto', nameEn: 'Corrected coffee', nameDe: 'Caffè Corretto', priceCents: 300 },
      { nameIt: 'Cappuccino', nameEn: 'Cappuccino', nameDe: 'Cappuccino', priceCents: 300, allergens: '7' },
    ],
  },
  {
    slug: 'amari-distillati',
    nameIt: 'Amari e Distillati',
    nameEn: 'Amari & Spirits',
    nameDe: 'Amari & Spirituosen',
    order: 9,
    items: [
      { nameIt: 'Amaro del Capo', nameEn: 'Amaro del Capo', nameDe: 'Amaro del Capo', priceCents: 300 },
      { nameIt: 'Branca Menta', nameEn: 'Branca Menta', nameDe: 'Branca Menta', priceCents: 300 },
      { nameIt: 'Amaro Lucano', nameEn: 'Amaro Lucano', nameDe: 'Amaro Lucano', priceCents: 300 },
      { nameIt: 'Sambuca', nameEn: 'Sambuca', nameDe: 'Sambuca', priceCents: 300 },
      { nameIt: 'Limoncello', nameEn: 'Limoncello', nameDe: 'Limoncello', priceCents: 300 },
      { nameIt: 'Padre Peppe', nameEn: 'Padre Peppe', nameDe: 'Padre Peppe', priceCents: 300 },
      { nameIt: 'Borghetti', nameEn: 'Borghetti', nameDe: 'Borghetti', priceCents: 300 },
      { nameIt: 'Baileys Irish Cream', nameEn: 'Baileys Irish Cream', nameDe: 'Baileys Irish Cream', priceCents: 400, allergens: '7' },
      { nameIt: 'Grappa Barricata', nameEn: 'Barrel-aged Grappa', nameDe: 'Fassgereifter Grappa', priceCents: 400 },
      { nameIt: 'Grappa Bianca', nameEn: 'White Grappa', nameDe: 'Weißer Grappa', priceCents: 400 },
      { nameIt: 'Rum "Diplomatico"', nameEn: 'Rum "Diplomatico"', nameDe: 'Rum "Diplomatico"', priceCents: 700 },
      { nameIt: 'Whisky Glenfiddich', nameEn: 'Whisky Glenfiddich', nameDe: 'Whisky Glenfiddich', priceCents: 800 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@lebotteghematera.it';
  const password = process.env.ADMIN_PASSWORD || 'botteghe2026';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: 'Admin' },
  });
  console.log(`✓ Admin user: ${email}`);

  // Wipe existing menu and reseed deterministically
  // Skip menu seed if any category already exists — protects edits made via /admin.
  // Set FORCE_RESEED=1 to wipe and reseed the entire menu.
  const existing = await prisma.menuCategory.count();
  if (existing > 0 && process.env.FORCE_RESEED !== '1') {
    console.log(`↪ skipping menu seed (${existing} categories already exist). Set FORCE_RESEED=1 to overwrite.`);
    await prisma.siteSetting.upsert({
      where: { key: 'coperto_cents' },
      update: { value: '300' },
      create: { key: 'coperto_cents', value: '300' },
    });
    console.log('🎉 Seed complete (idempotent run)!');
    return;
  }

  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  for (const cat of categories) {
    const created = await prisma.menuCategory.create({
      data: {
        slug: cat.slug,
        nameIt: cat.nameIt,
        nameEn: cat.nameEn,
        nameDe: cat.nameDe,
        order: cat.order,
      },
    });
    for (let i = 0; i < cat.items.length; i++) {
      const it = cat.items[i];
      await prisma.menuItem.create({
        data: {
          categoryId: created.id,
          nameIt: it.nameIt,
          nameEn: it.nameEn,
          nameDe: it.nameDe,
          descIt: it.descIt ?? null,
          descEn: it.descEn ?? null,
          descDe: it.descDe ?? null,
          priceCents: it.priceCents,
          allergens: it.allergens ?? '',
          isFrozen: it.isFrozen ?? false,
          order: i,
        },
      });
    }
    console.log(`✓ ${cat.nameIt}: ${cat.items.length} items`);
  }

  // Site settings
  await prisma.siteSetting.upsert({
    where: { key: 'coperto_cents' },
    update: { value: '300' },
    create: { key: 'coperto_cents', value: '300' },
  });

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
