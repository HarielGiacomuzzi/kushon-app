import { PrismaClient, Role, TitleStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  console.log('Creating Publisher...');
  const publisher = await prisma.publisher.create({
    data: {
      name: 'Shogakukan',
      country: 'Japan',
    },
  });

  console.log('Creating Title...');
  const title = await prisma.title.create({
    data: {
      name: 'One Piece',
      synopsis: 'Monkey D. Luffy sonha em se tornar o Rei dos Piratas. Junto com sua tripulação diversificada, ele navega pela Grand Line em busca do tesouro lendário conhecido como One Piece.',
      author: 'Eiichiro Oda',
      genre: 'Aventura, Shonen',
      slug: 'one-piece',
      status: TitleStatus.ONGOING,
      publisherId: publisher.id,
    },
  });

  console.log('Creating Volumes...');
  const volume1 = await prisma.volume.create({
    data: {
      number: 1,
      title: 'One Piece Vol. 1',
      titleId: title.id,
      releaseAt: new Date('2023-01-15'),
    },
  });

  const volume2 = await prisma.volume.create({
    data: {
      number: 2,
      title: 'One Piece Vol. 2',
      titleId: title.id,
      releaseAt: new Date('2023-02-15'),
    },
  });

  console.log('Creating Admin User...');
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@kushon.com',
      password: hashedPassword,
    },
  });

  console.log('Creating Admin Role...');
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      role: Role.ADMIN,
    },
  });

  console.log('Creating Regular User...');
  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@kushon.com',
      password: hashedUserPassword,
    },
  });

  console.log('Creating User Role...');
  await prisma.userRole.create({
    data: {
      userId: regularUser.id,
      role: Role.USER,
    },
  });

  console.log('Creating UserVolume relationships...');
  await prisma.userVolume.create({
    data: {
      userId: regularUser.id,
      volumeId: volume1.id,
      owned: true,
      notified: false,
    },
  });

  await prisma.userVolume.create({
    data: {
      userId: regularUser.id,
      volumeId: volume2.id,
      owned: false,
      notified: true,
    },
  });

  console.log('✅ Seeding completed!');
  console.log('📚 Created:');
  console.log(`  - 1 Publisher: ${publisher.name}`);
  console.log(`  - 1 Title: ${title.name}`);
  console.log(`  - 2 Volumes`);
  console.log(`  - 1 Admin User: ${adminUser.email}`);
  console.log(`  - 1 Regular User: ${regularUser.email}`);
  console.log(`  - 2 UserVolume relationships`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });