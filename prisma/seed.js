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

  console.log({ alice, bob, susan, tom, william });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
