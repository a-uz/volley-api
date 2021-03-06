import Hapi from "@hapi/hapi";
import Joi from "joi";
import { Prisma } from "@prisma/client";

export const gamesPlugin = {
  name: "app/games",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "GET",
        path: "/games",
        handler: getGamesHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/games/{gameId}",
        options: {
          validate: {
            params: Joi.object({
              gameId: Joi.number().required(),
            }),
          },
        },
        handler: getGameHandler,
      },
    ]);

    server.route([
      {
        method: "POST",
        path: "/games",
        options: {
          validate: {
            payload: Joi.object({
              plannedAt: Joi.date().iso().required(),
              location: Joi.string().required(),
              categoryId: Joi.number().required(),
              statusId: Joi.number().required(),
              teamAId: Joi.number().required(),
              teamBId: Joi.number().required(),
            }),
          },
        },
        handler: postGameHandler,
      },
    ]);
  },
};

async function getGamesHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  try {
    const games = await prisma.game.findMany({
      include: {
        category: true,
        status: true,
        teamA: true,
        teamB: true,
      },
    });
    return h.response(games);
  } catch (err) {
    console.log(err);
  }
}

async function getGameHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const gameId = Number(request.params.gameId);

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        category: true,
        status: true,
        teamA: true,
        teamB: true,
        events: true,
      },
    });
    if (game) {
      return h.response(game);
    }

    return h
      .response({
        statusCode: 404,
        error: "Not Found",
        message: `Game with an id ${gameId} was not found`,
      })
      .code(404);
  } catch (err) {
    console.log(err);
  }
}

async function postGameHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const gameData = request.payload as Prisma.GameCreateInput;

  try {
    const game = await prisma.game.create({
      data: gameData,
      include: {
        category: true,
        status: true,
        teamA: true,
        teamB: true,
      },
    });
    return h.response(game);
  } catch (err) {
    console.log(err);
  }
}
