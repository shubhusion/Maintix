import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_MANAGER_EMAIL || 'admin@Maintix.com';
  const password = process.env.SEED_MANAGER_PASSWORD || 'ChangeThisPassword123';
  const firstName = process.env.SEED_MANAGER_FIRST_NAME || 'Admin';
  const lastName = process.env.SEED_MANAGER_LAST_NAME || 'Manager';

  const passwordHash = await bcrypt.hash(password, 12);

  // --- Manager ---
  const manager = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: Role.MANAGER,
      isActive: true,
    },
  });
  console.log(`Manager ready: ${manager.email} (${manager.id})`);

  // --- Tenant ---
  const tenantEmail = 'tenant@Maintix.com';
  const tenantHash = await bcrypt.hash('TenantPass123', 12);
  const tenant = await prisma.user.upsert({
    where: { email: tenantEmail },
    update: {},
    create: {
      email: tenantEmail,
      passwordHash: tenantHash,
      firstName: 'Jane',
      lastName: 'Tenant',
      role: Role.TENANT,
      isActive: true,
    },
  });
  console.log(`Tenant ready: ${tenant.email} (${tenant.id})`);

  // --- Technician ---
  const techEmail = 'tech@Maintix.com';
  const techHash = await bcrypt.hash('TechPass123', 12);
  const technician = await prisma.user.upsert({
    where: { email: techEmail },
    update: {},
    create: {
      email: techEmail,
      passwordHash: techHash,
      firstName: 'Bob',
      lastName: 'Technician',
      role: Role.TECHNICIAN,
      isActive: true,
    },
  });
  console.log(`Technician ready: ${technician.email} (${technician.id})`);

  // --- Property ---
  // Use a deterministic lookup: find or create
  let property = await prisma.property.findFirst({
    where: { name: 'Sunrise Apartments', deletedAt: null },
  });

  if (!property) {
    property = await prisma.property.create({
      data: {
        name: 'Sunrise Apartments',
        address: '123 Main St, Springfield, IL 62701',
        description: 'A 24-unit residential complex used for demo purposes.',
      },
    });
    console.log(`Property created: ${property.name} (${property.id})`);
  } else {
    console.log(`Property already exists: ${property.name} (${property.id})`);
  }

  // --- Property Memberships (connect all three users) ---
  for (const user of [manager, tenant, technician]) {
    await prisma.propertyMember.upsert({
      where: {
        propertyId_userId: {
          propertyId: property.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        propertyId: property.id,
        userId: user.id,
      },
    });
  }
  console.log('All users linked to Sunrise Apartments');

  // --- Default Categories ---
  const categoryNames = ['Plumbing', 'Electrical', 'HVAC', 'General Maintenance'];
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: {
        propertyId_name: {
          propertyId: property.id,
          name,
        },
      },
      update: {},
      create: {
        name,
        propertyId: property.id,
      },
    });
  }
  console.log(`Default categories seeded for ${property.name}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
