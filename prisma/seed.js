const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {
    },
    create: {
      first_name: "Alice",
      last_name: "Apple",
      email: "alice@example.com"
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {
    },
    create: {
      first_name: "Bob",
      last_name: "Bailey",
      email: "bob@example.com"
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      first_name: "Charlie",
      last_name: "Chapman",
      email: "charlie@example.com"
    },
  });
  
  const edgar = await prisma.user.upsert({
    where: { email: "edgar@example.com" },
    update: {},
    create: {
      first_name: "Edgar",
      last_name: "Ebert",
      email: "edgar@example.com"
    },
  });
  
  const frank = await prisma.user.upsert({
    where: { email: "frank@example.com" },
    update: {},
    create: {
      first_name: "Frank",
      last_name: "Fulton",
      email: "frank@example.com"
    },
  });
  
  const harry = await prisma.user.upsert({
    where: { email: "harry@example.com" },
    update: {},
    create: {
      first_name: "Harry",
      last_name: "Hughes",
      email: "harry@example.com"
    },
  });

  const justin = await prisma.user.upsert({
    where: { email: "justin@example.com" },
    update: {},
    create: {
      first_name: "Justin",
      last_name: "Jones",
      email: "justin@example.com"
    },
  });

  const susan = await prisma.user.upsert({
    where: { email: "susan@example.com" },
    update: {},
    create: {
      first_name: "Susan",
      last_name: "Severino",
      email: "susan@example.com"
    },
  });

  const tom = await prisma.user.upsert({
    where: { email: "tom@example.com" },
    update: {},
    create: {
      first_name: "Tom",
      last_name: "Tsao",
      email: "tom@example.com"
    },
  });

  const william = await prisma.user.upsert({
    where: { email: "william@example.com" },
    update: {},
    create: {
      first_name: "William",
      last_name: "Warner",
      email: "william@example.com"
    },
  });

  console.log({ alice, bob, charlie, edgar, frank, harry, justin, susan, tom, william });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
