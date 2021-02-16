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
              teamIds: Joi.array().items(Joi.number()).required(),
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
        teams: true,
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
        teams: true,
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

interface PostGameInput {
  plannedAt: string;
  location: string;
  categoryId: number;
  statusId: number;
  teamIds: number[];
}

async function postGameHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const {
    plannedAt,
    location,
    categoryId,
    statusId,
    teamIds,
  } = request.payload as PostGameInput;

  try {
    const game = await prisma.game.create({
      data: {
        plannedAt: plannedAt,
        location: location,
        gameCategoryId: categoryId,
        statusId: statusId,
        // teams: {
        //   connect: teamIds.map((teamId) => ({ id: teamId })),
        // },
      },
      include: {
        category: true,
        status: true,
        teams: true,
      },
    });
    return h.response(game);
  } catch (err) {
    console.log(err);
  }
}
