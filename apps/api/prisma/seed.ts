import { PrismaClient, Role, TicketStatus, Priority, ActivityAction } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertUser(data: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {},
    create: { ...data, isActive: true },
  });
}

async function main() {
  const hash = (pw: string) => bcrypt.hash(pw, 12);

  // =====================
  // Users (7 total)
  // =====================
  const manager = await upsertUser({
    email: process.env.SEED_MANAGER_EMAIL || 'admin@Maintix.com',
    passwordHash: await hash(process.env.SEED_MANAGER_PASSWORD || 'ChangeThisPassword123'),
    firstName: process.env.SEED_MANAGER_FIRST_NAME || 'Admin',
    lastName: process.env.SEED_MANAGER_LAST_NAME || 'Manager',
    role: Role.MANAGER,
  });
  console.log(`Manager: ${manager.email}`);

  const tenant = await upsertUser({
    email: 'tenant@Maintix.com',
    passwordHash: await hash('TenantPass123'),
    firstName: 'Jane',
    lastName: 'Tenant',
    role: Role.TENANT,
  });

  const tech1 = await upsertUser({
    email: 'tech@Maintix.com',
    passwordHash: await hash('TechPass123'),
    firstName: 'Bob',
    lastName: 'Technician',
    role: Role.TECHNICIAN,
  });

  const tech2 = await upsertUser({
    email: 'mike.tech@Maintix.com',
    passwordHash: await hash('TechPass123'),
    firstName: 'Mike',
    lastName: 'Rivera',
    role: Role.TECHNICIAN,
  });

  const tenant2 = await upsertUser({
    email: 'sarah@Maintix.com',
    passwordHash: await hash('TenantPass123'),
    firstName: 'Sarah',
    lastName: 'Kim',
    role: Role.TENANT,
  });

  const tenant3 = await upsertUser({
    email: 'carlos@Maintix.com',
    passwordHash: await hash('TenantPass123'),
    firstName: 'Carlos',
    lastName: 'Mendez',
    role: Role.TENANT,
  });

  const manager2 = await upsertUser({
    email: 'lisa@Maintix.com',
    passwordHash: await hash('ManagerPass123'),
    firstName: 'Lisa',
    lastName: 'Chen',
    role: Role.MANAGER,
  });

  console.log('All 7 users seeded');

  // =====================
  // Properties (3 total)
  // =====================
  const findOrCreate = async (name: string, address: string, description: string) => {
    let prop = await prisma.property.findFirst({ where: { name, deletedAt: null } });
    if (!prop) {
      prop = await prisma.property.create({ data: { name, address, description } });
    }
    return prop;
  };

  const prop1 = await findOrCreate(
    'Sunrise Apartments',
    '123 Main St, Springfield, IL 62701',
    'A 24-unit residential complex used for demo purposes.',
  );
  const prop2 = await findOrCreate(
    'Oakwood Condos',
    '456 Oak Ave, Chicago, IL 60601',
    'Luxury condo building with 40 units and underground parking.',
  );
  const prop3 = await findOrCreate(
    'River View Townhomes',
    '789 River Rd, Naperville, IL 60540',
    'Modern townhome community with shared amenities.',
  );
  console.log('3 properties seeded');

  // =====================
  // Memberships
  // =====================
  const addMembers = async (propertyId: string, users: { id: string }[]) => {
    for (const u of users) {
      await prisma.propertyMember.upsert({
        where: { propertyId_userId: { propertyId, userId: u.id } },
        update: {},
        create: { propertyId, userId: u.id },
      });
    }
  };

  await addMembers(prop1.id, [manager, tenant, tech1, tech2, tenant2]);
  await addMembers(prop2.id, [manager, manager2, tech1, tenant3]);
  await addMembers(prop3.id, [manager2, tech2, tenant2, tenant3]);
  console.log('Memberships linked');

  // =====================
  // Categories
  // =====================
  const addCategories = async (propertyId: string, names: string[]) => {
    const cats: Record<string, string> = {};
    for (const name of names) {
      const cat = await prisma.category.upsert({
        where: { propertyId_name: { propertyId, name } },
        update: {},
        create: { name, propertyId },
      });
      cats[name] = cat.id;
    }
    return cats;
  };

  const cats1 = await addCategories(prop1.id, [
    'Plumbing',
    'Electrical',
    'HVAC',
    'General Maintenance',
  ]);
  const cats2 = await addCategories(prop2.id, ['Plumbing', 'Electrical', 'Elevator', 'Parking']);
  const cats3 = await addCategories(prop3.id, [
    'Plumbing',
    'Landscaping',
    'Roofing',
    'General Maintenance',
  ]);
  console.log('Categories seeded');

  // =====================
  // Tickets (20 total across all properties and statuses)
  // =====================
  const ticketData: {
    title: string;
    description: string;
    propertyId: string;
    categoryId: string;
    createdById: string;
    assignedToId?: string;
    status: TicketStatus;
    priority: Priority;
    cancellationReason?: string;
  }[] = [
    // Property 1 — Sunrise Apartments
    {
      title: 'Leaky kitchen faucet in Unit 4B',
      description:
        'The kitchen faucet has been dripping steadily for two days. Water pooling under the sink.',
      propertyId: prop1.id,
      categoryId: cats1['Plumbing'],
      createdById: tenant.id,
      status: TicketStatus.OPEN,
      priority: Priority.MEDIUM,
    },
    {
      title: 'No hot water in Unit 12A',
      description:
        'Water heater seems to be malfunctioning. Only cold water from all taps since this morning.',
      propertyId: prop1.id,
      categoryId: cats1['Plumbing'],
      createdById: tenant2.id,
      status: TicketStatus.ASSIGNED,
      priority: Priority.HIGH,
      assignedToId: tech1.id,
    },
    {
      title: 'Flickering lights in hallway 3rd floor',
      description:
        'The overhead LED panels on the 3rd floor hallway flicker intermittently. Possible ballast issue.',
      propertyId: prop1.id,
      categoryId: cats1['Electrical'],
      createdById: tenant.id,
      assignedToId: tech1.id,
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.LOW,
    },
    {
      title: 'AC unit not cooling in Unit 8C',
      description:
        'The central AC unit blows warm air. Filter was replaced last month. Might need refrigerant recharge.',
      propertyId: prop1.id,
      categoryId: cats1['HVAC'],
      createdById: tenant2.id,
      assignedToId: tech2.id,
      status: TicketStatus.AWAITING_APPROVAL,
      priority: Priority.URGENT,
    },
    {
      title: 'Broken window latch Unit 2A',
      description:
        'The window latch in the bedroom is broken and the window cannot be secured shut. Security concern.',
      propertyId: prop1.id,
      categoryId: cats1['General Maintenance'],
      createdById: tenant.id,
      assignedToId: tech1.id,
      status: TicketStatus.DONE,
      priority: Priority.HIGH,
    },
    {
      title: 'Garbage disposal jammed Unit 6B',
      description:
        "Garbage disposal makes grinding noises and won't turn. Tried the reset button with no success.",
      propertyId: prop1.id,
      categoryId: cats1['Plumbing'],
      createdById: tenant.id,
      status: TicketStatus.CANCELLED,
      priority: Priority.LOW,
      cancellationReason: 'Resolved by tenant — just needed a reset.',
    },
    {
      title: 'Thermostat display blank in Unit 10D',
      description:
        'Digital thermostat screen is completely blank. Batteries replaced but still not working.',
      propertyId: prop1.id,
      categoryId: cats1['HVAC'],
      createdById: tenant2.id,
      status: TicketStatus.OPEN,
      priority: Priority.MEDIUM,
    },
    {
      title: 'Ceiling fan wobble in Unit 5A',
      description:
        'Living room ceiling fan wobbles at medium and high speed. Concerned about safety.',
      propertyId: prop1.id,
      categoryId: cats1['Electrical'],
      createdById: tenant.id,
      assignedToId: tech2.id,
      status: TicketStatus.ASSIGNED,
      priority: Priority.LOW,
    },

    // Property 2 — Oakwood Condos
    {
      title: 'Elevator stuck on 5th floor',
      description:
        "Main elevator doors won't open on the 5th floor. Service elevator still working.",
      propertyId: prop2.id,
      categoryId: cats2['Elevator'],
      createdById: tenant3.id,
      assignedToId: tech1.id,
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.URGENT,
    },
    {
      title: 'Parking gate malfunction',
      description:
        'Underground parking entry gate does not respond to key fobs. Manual override needed each time.',
      propertyId: prop2.id,
      categoryId: cats2['Parking'],
      createdById: tenant3.id,
      status: TicketStatus.OPEN,
      priority: Priority.HIGH,
    },
    {
      title: 'Water leak in parking Level B2',
      description:
        'Water dripping from the ceiling near parking spot B2-15. Possible pipe above the concrete slab.',
      propertyId: prop2.id,
      categoryId: cats2['Plumbing'],
      createdById: manager.id,
      assignedToId: tech1.id,
      status: TicketStatus.AWAITING_APPROVAL,
      priority: Priority.HIGH,
    },
    {
      title: 'Lobby light fixture burnt out',
      description:
        'Two of the four recessed lights in the main lobby vestibule are out. Visible to all residents.',
      propertyId: prop2.id,
      categoryId: cats2['Electrical'],
      createdById: manager.id,
      assignedToId: tech1.id,
      status: TicketStatus.DONE,
      priority: Priority.LOW,
    },
    {
      title: 'Outlet sparking in Unit 305',
      description:
        'Wall outlet in living room sparks when plugging in devices. Potential fire hazard.',
      propertyId: prop2.id,
      categoryId: cats2['Electrical'],
      createdById: tenant3.id,
      status: TicketStatus.OPEN,
      priority: Priority.URGENT,
    },
    {
      title: 'Slow elevator response time',
      description:
        'Service elevator takes 3+ minutes to arrive. Multiple residents have complained.',
      propertyId: prop2.id,
      categoryId: cats2['Elevator'],
      createdById: tenant3.id,
      status: TicketStatus.CANCELLED,
      priority: Priority.MEDIUM,
      cancellationReason: 'Duplicate of elevator stuck ticket.',
    },

    // Property 3 — River View Townhomes
    {
      title: 'Sprinkler head broken on west lawn',
      description:
        'Sprinkler head #7 on the west lawn area is broken and spraying water continuously.',
      propertyId: prop3.id,
      categoryId: cats3['Landscaping'],
      createdById: tenant2.id,
      assignedToId: tech2.id,
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
    },
    {
      title: 'Roof shingle damage after storm',
      description:
        "Several shingles on Unit C roof are loose or missing after last week's wind storm.",
      propertyId: prop3.id,
      categoryId: cats3['Roofing'],
      createdById: tenant3.id,
      status: TicketStatus.OPEN,
      priority: Priority.HIGH,
    },
    {
      title: 'Toilet running in Unit A',
      description:
        'Toilet in the upstairs bathroom runs continuously. Flapper valve likely needs replacement.',
      propertyId: prop3.id,
      categoryId: cats3['Plumbing'],
      createdById: tenant2.id,
      assignedToId: tech2.id,
      status: TicketStatus.DONE,
      priority: Priority.MEDIUM,
    },
    {
      title: 'Overgrown hedges blocking walkway',
      description:
        'The hedges near the community mailbox area are overgrown and partially blocking the walking path.',
      propertyId: prop3.id,
      categoryId: cats3['Landscaping'],
      createdById: tenant3.id,
      status: TicketStatus.ASSIGNED,
      priority: Priority.LOW,
      assignedToId: tech2.id,
    },
    {
      title: 'Front door lock stiff in Unit B',
      description:
        'The deadbolt on the front door is extremely stiff and difficult to turn. Needs lubrication or replacement.',
      propertyId: prop3.id,
      categoryId: cats3['General Maintenance'],
      createdById: tenant2.id,
      status: TicketStatus.OPEN,
      priority: Priority.MEDIUM,
    },
    {
      title: 'Gutter overflow during rain',
      description:
        'Rain gutters on Unit D overflow during moderate rain. Likely clogged with debris.',
      propertyId: prop3.id,
      categoryId: cats3['Roofing'],
      createdById: tenant3.id,
      assignedToId: tech2.id,
      status: TicketStatus.AWAITING_APPROVAL,
      priority: Priority.LOW,
    },
  ];

  for (const t of ticketData) {
    const existing = await prisma.ticket.findFirst({
      where: { title: t.title, propertyId: t.propertyId, deletedAt: null },
    });
    if (existing) continue;

    const ticket = await prisma.ticket.create({
      data: {
        title: t.title,
        description: t.description,
        propertyId: t.propertyId,
        categoryId: t.categoryId,
        createdById: t.createdById,
        assignedToId: t.assignedToId,
        status: t.status,
        priority: t.priority,
        cancellationReason: t.cancellationReason,
        version: t.status === TicketStatus.OPEN ? 1 : t.status === TicketStatus.CANCELLED ? 2 : 2,
      },
    });

    // Create corresponding activity entries
    await prisma.ticketActivity.create({
      data: {
        ticketId: ticket.id,
        actorId: t.createdById,
        action: ActivityAction.TICKET_CREATED,
        newValue: { title: t.title, status: 'OPEN' },
      },
    });

    if (t.assignedToId) {
      await prisma.ticketActivity.create({
        data: {
          ticketId: ticket.id,
          actorId: manager.id,
          action: ActivityAction.TECHNICIAN_ASSIGNED,
          previousValue: { status: 'OPEN', assignedToId: null },
          newValue: { status: 'ASSIGNED', assignedToId: t.assignedToId },
        },
      });
    }

    if (t.status === TicketStatus.IN_PROGRESS && t.assignedToId) {
      await prisma.ticketActivity.create({
        data: {
          ticketId: ticket.id,
          actorId: t.assignedToId,
          action: ActivityAction.WORK_STARTED,
          previousValue: { status: 'ASSIGNED' },
          newValue: { status: 'IN_PROGRESS' },
        },
      });
    }

    if (t.status === TicketStatus.AWAITING_APPROVAL && t.assignedToId) {
      await prisma.ticketActivity.create({
        data: {
          ticketId: ticket.id,
          actorId: t.assignedToId,
          action: ActivityAction.COMPLETION_SUBMITTED,
          previousValue: { status: 'IN_PROGRESS' },
          newValue: { status: 'AWAITING_APPROVAL' },
        },
      });
    }

    if (t.status === TicketStatus.DONE) {
      await prisma.ticketActivity.create({
        data: {
          ticketId: ticket.id,
          actorId: manager.id,
          action: ActivityAction.TICKET_APPROVED,
          previousValue: { status: 'AWAITING_APPROVAL' },
          newValue: { status: 'DONE' },
        },
      });
    }

    if (t.status === TicketStatus.CANCELLED) {
      await prisma.ticketActivity.create({
        data: {
          ticketId: ticket.id,
          actorId: t.createdById,
          action: ActivityAction.TICKET_CANCELLED,
          previousValue: { status: 'OPEN' },
          newValue: { status: 'CANCELLED', reason: t.cancellationReason },
        },
      });
    }
  }
  console.log(`20 tickets with activity logs seeded across 3 properties`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
