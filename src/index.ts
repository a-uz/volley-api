import Hapi from "@hapi/hapi";
import { prismaPlugin } from "./plugins/prisma";
import { teamsPlugin } from "./plugins/teams";
import { playersPlugin } from "./plugins/players";
import { gamesPlugin } from "./plugins/games";
import { gameEventsPlugin } from "./plugins/gameEvents";

const server: Hapi.Server = Hapi.server({
  port: 3000,
  routes: { cors: { origin: ["*"] } },
});

async function init() {
  await server.register([
    prismaPlugin,
    teamsPlugin,
    playersPlugin,
    gamesPlugin,
    gameEventsPlugin,
  ]);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", async (err) => {
  await server.app.prisma.$disconnect();
  console.log(err);
  process.exit(1);
});

init();
