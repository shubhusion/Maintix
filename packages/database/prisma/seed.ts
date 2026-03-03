import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_MANAGER_EMAIL || 'admin@Maintix.com';
  const password = process.env.SEED_MANAGER_PASSWORD || 'ChangeThisPassword123';
  const firstName = process.env.SEED_MANAGER_FIRST_NAME || 'Admin';
  const lastName = process.env.SEED_MANAGER_LAST_NAME || 'Manager';

  const existingManager = await prisma.user.findUnique({
    where: { email },
  });

  if (existingManager) {
    console.log(`Manager already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const manager = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: Role.MANAGER,
      isActive: true,
    },
  });

  console.log(`Seed manager created: ${manager.email} (${manager.id})`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
