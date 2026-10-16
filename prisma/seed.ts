import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'editor', input: false },
    },
  },
});

async function main() {
  console.log('🌱 Seeding database...');

  // ── Create super admin via better-auth ──
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@fabricantsdejoie.org' },
  });

  let adminId: string;

  if (!existingAdmin) {
    // Use better-auth's internal API to create user with hashed password
    const ctx = await auth.api.signUpEmail({
      body: {
        name: 'Super Administrateur',
        email: 'admin@fabricantsdejoie.org',
        password: 'FJ_SuperAdmin_2024!',
      },
    });
    adminId = ctx.user.id;

    // Upgrade to superadmin role
    await prisma.user.update({
      where: { id: adminId },
      data: { role: 'superadmin' },
    });

    console.log('✅ Super admin created: admin@fabricantsdejoie.org / FJ_SuperAdmin_2024!');
  } else {
    adminId = existingAdmin.id;
    console.log('ℹ️  Super admin already exists');
  }

  // ── Categories ──
  const categories = [
    { name: 'Témoignages', slug: 'temoignages', description: 'Histoires de vies transformées', color: '#FF7F3F' },
    { name: 'Formations', slug: 'formations', description: 'Enseignements et équipement', color: '#38B29B' },
    { name: 'Événements', slug: 'evenements', description: 'Camps, concerts et rencontres', color: '#1C3B5E' },
    { name: 'Actualités', slug: 'actualites', description: 'Nouvelles du mouvement', color: '#FFC82C' },
    { name: 'Méditations', slug: 'meditations', description: 'Réflexions et foi vivante', color: '#A23F00' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // ── Tags ──
  const tags = [
    { name: 'Foi', slug: 'foi' },
    { name: 'Jeunesse', slug: 'jeunesse' },
    { name: 'Musique', slug: 'musique' },
    { name: 'Formation', slug: 'formation' },
    { name: 'Camp', slug: 'camp' },
    { name: 'Niger', slug: 'niger' },
    { name: 'Témoignage', slug: 'temoignage' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log('✅ Tags seeded');

  // ── Posts ──
  const existingPosts = await prisma.post.count();
  if (existingPosts === 0) {
    const samplePosts = [
      {
        title: "Le fil de la grâce : Comment la foi d'Amina a transformé son quartier",
        slug: 'le-fil-de-la-grace',
        excerpt: 'Dans les ruelles poussiéreuses de Niamey, une jeune femme a décidé que la joie serait son arme. Voici son histoire.',
        content: `# Le fil de la grâce\n\nDans les ruelles poussiéreuses de Niamey, une jeune femme a décidé que la joie serait son arme.\n\n## La rencontre\n\nAmina avait 19 ans quand elle a participé à son premier camp des Fabricants de Joie. "Je ne savais pas ce qui m'attendait", raconte-t-elle avec un sourire lumineux. "Mais quelque chose en moi savait que ma vie allait changer."\n\n## La transformation\n\nAujourd'hui, Amina dirige un groupe de jeunes dans son quartier. Chaque semaine, ils se réunissent pour partager, créer et grandir ensemble dans la foi.\n\n> "La joie n'est pas l'absence de difficulté. C'est la certitude que Dieu est au milieu de tout." — Amina\n\n## L'impact\n\nSon quartier a été transformé. Les jeunes qui erraient sans but ont trouvé une communauté. Les familles divisées ont retrouvé l'unité. La foi est devenue vivante et contagieuse.`,
        coverImage: '/images/story-unsplash-1.webp',
        categoryId: 1,
        authorId: adminId,
        status: 'published',
        featured: true,
        readTime: 7,
        publishedAt: new Date('2026-03-15T10:00:00'),
        tagSlugs: ['foi', 'temoignage', 'niger'],
      },
      {
        title: "L'écho de la louange : Quand la musique traverse les générations",
        slug: 'lecho-de-la-louange',
        excerpt: "À travers la musique et la louange, trois générations du Niger découvrent qu'elles parlent le même langage.",
        content: `# L'écho de la louange\n\nLa musique a toujours été au cœur de la culture nigérienne. Mais quand elle devient un pont entre les générations, elle prend une dimension sacrée.\n\n## Un concert pas comme les autres\n\nCe soir-là, à Niamey, quelque chose de spécial se préparait. Grand-mère Hadiza, 72 ans, allait chanter sur la même scène que son petit-fils Ibrahim, 16 ans.\n\n## Unité dans la diversité\n\nLes styles sont différents — le djembé ancestral et la guitare électrique — mais le message est le même : la joie de connaître Dieu.\n\n> "Quand je chante avec mon petit-fils, je vois l'avenir du Niger et mon cœur déborde de joie." — Hadiza`,
        coverImage: '/images/enfant.webp',
        categoryId: 1,
        authorId: adminId,
        status: 'published',
        featured: true,
        readTime: 5,
        publishedAt: new Date('2026-03-20T10:00:00'),
        tagSlugs: ['musique', 'foi'],
      },
      {
        title: 'Formation FTJ 2026 : Inscrire les leaders de demain',
        slug: 'formation-ftj-2026',
        excerpt: 'La nouvelle session de Formation pour les Travailleurs de Jeunesse ouvre ses portes.',
        content: `# Formation FTJ 2026\n\nChaque année, la Formation pour les Travailleurs de Jeunesse (FTJ) équipe une nouvelle génération de leaders.\n\n## Le programme\n\nSur 6 mois intensifs, les participants sont formés en :\n- **Leadership** — Développer une vision claire\n- **Pédagogie** — Enseigner avec créativité\n- **Accompagnement** — Marcher aux côtés des jeunes\n- **Spiritualité** — Approfondir sa relation avec Dieu\n\n> "La FTJ m'a donné les outils pour transformer des vies." — Moussa, promotion 2024`,
        coverImage: '/images/cours.webp',
        categoryId: 2,
        authorId: adminId,
        status: 'published',
        featured: false,
        readTime: 4,
        publishedAt: new Date('2026-04-01T10:00:00'),
        tagSlugs: ['formation', 'jeunesse'],
      },
      {
        title: "Camp d'été 2026 : La joie en mouvement",
        slug: 'camp-dete-2026',
        excerpt: "Le camp d'été annuel revient en juillet. Sports, ateliers créatifs et moments de partage au programme.",
        content: `# Camp d'été 2026\n\nCet été, les Fabricants de Joie préparent leur plus grand camp jamais organisé.\n\n## Au programme\n\n- **Sports et jeux** — Football, athlétisme, jeux traditionnels\n- **Ateliers créatifs** — Peinture, musique, théâtre\n- **Veillées** — Moments de partage et de louange\n- **Excursions** — Découverte du patrimoine nigérien\n\n## Infos pratiques\n\n- **Dates** : 15 - 25 juillet 2026\n- **Lieu** : Centre FJ, Niamey\n- **Âge** : 8 à 18 ans`,
        coverImage: '/images/maradi.webp',
        categoryId: 3,
        authorId: adminId,
        status: 'published',
        featured: false,
        readTime: 3,
        publishedAt: new Date('2026-04-05T10:00:00'),
        tagSlugs: ['camp', 'jeunesse'],
      },
    ];

    for (const { tagSlugs, ...postData } of samplePosts) {
      const tagRecords = await prisma.tag.findMany({
        where: { slug: { in: tagSlugs } },
      });

      await prisma.post.create({
        data: {
          ...postData,
          tags: {
            create: tagRecords.map((t) => ({ tagId: t.id })),
          },
        },
      });
    }
    console.log('✅ Sample posts seeded');
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@fabricantsdejoie.org');
  console.log('🔑 Admin password: FJ_SuperAdmin_2024!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
