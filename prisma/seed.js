const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createGenders() {
  const genders = ["Vīrietis", "Sieviete"];

  for await (const gender of genders) {
    const result = await prisma.gender.create({
      data: {
        name: gender,
      },
    });
    console.log(result);
  }
}

async function createGameCategories() {
  const categories = ["Vīriešiem", "Sievietēm"];

  for await (const category of categories) {
    const result = await prisma.gameCategory.create({
      data: {
        name: category,
      },
    });
    console.log(result);
  }
}

async function createGameStatuses() {
  const statuses = ["Plānota", "Aktīva", "Pabeigta"];

  for await (const status of statuses) {
    const result = await prisma.gameStatus.create({
      data: {
        name: status,
      },
    });
    console.log(result);
  }
}

async function createGameEventTypes() {
  const types = ["Punkts"];

  for await (const type of types) {
    const result = await prisma.gameEventType.create({
      data: {
        name: type,
      },
    });
    console.log(result);
  }
}

async function createTeams() {
  const teams = ["VK Liepāja"];

  for await (const team of teams) {
    const result = await prisma.team.create({
      data: {
        name: team,
      },
    });
    console.log(result);
  }
}

async function createPlayers() {
  const players = [
    {
      firstName: "Jānis",
      lastName: "Bērziņš",
      age: 18,
      number: 1,
      genderId: 1,
      teamId: 1,
    },
  ];

  for await (const player of players) {
    const result = await prisma.player.create({
      data: player,
    });
    console.log(result);
  }
}

async function main() {
  await createGenders();
  await createGameCategories();
  await createGameStatuses();
  await createGameEventTypes();
  await createTeams();
  await createPlayers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
