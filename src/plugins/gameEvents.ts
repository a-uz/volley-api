import Hapi from "@hapi/hapi";
import Joi from "joi";

export const gameEventsPlugin = {
  name: "app/gameEvents",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "GET",
        path: "/games/{gameId}/events",
        options: {
          validate: {
            params: Joi.object({
              gameId: Joi.number().required(),
            }),
          },
        },
        handler: getGameEventsHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/games/{gameId}/events/{eventId}",
        options: {
          validate: {
            params: Joi.object({
              gameId: Joi.number().required(),
              eventId: Joi.number().required(),
            }),
          },
        },
        handler: getGameEventHandler,
      },
    ]);

    server.route([
      {
        method: "POST",
        path: "/games/{gameId}/events",
        options: {
          validate: {
            params: Joi.object({
              gameId: Joi.number().required(),
            }),
            payload: Joi.object({
              typeId: Joi.number().required(),
              teamId: Joi.number(),
              playerId: Joi.number(),
            }),
          },
        },
        handler: postGameEventHandler,
      },
    ]);

    server.route([
      {
        method: "DELETE",
        path: "/games/{gameId}/events/{eventId}",
        options: {
          validate: {
            params: Joi.object({
              gameId: Joi.number().required(),
              eventId: Joi.number().required(),
            }),
          },
        },
        handler: deleteGameEventHandler,
      },
    ]);
  },
};

async function getGameEventsHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;

  try {
    const gameEvents = await prisma.gameEvent.findMany({
      include: {
        type: true,
        team: true,
        player: true,
      },
    });
    return h.response(gameEvents);
  } catch (err) {
    console.log(err);
  }
}

async function getGameEventHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const gameId = Number(request.params.gameId);
  const eventId = Number(request.params.eventId);

  try {
    const gameEvent = await prisma.gameEvent.findUnique({
      where: { id: gameId },
      include: {
        type: true,
        team: true,
        player: true,
      },
    });
    if (gameEvent) {
      return h.response(gameEvent);
    }

    return h
      .response({
        statusCode: 404,
        error: "Not Found",
        message: `Game event with an id ${eventId} for game with and id ${gameId} was not found`,
      })
      .code(404);
  } catch (err) {
    console.log(err);
  }
}

interface PostGameEventData {
  typeId: number;
  teamId?: number;
  playerId?: number;
}

async function postGameEventHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const gameId = Number(request.params.gameId);
  const gameData = request.payload as PostGameEventData;

  try {
    const game = await prisma.gameEvent.create({
      data: {
        gameId: gameId,
        ...gameData,
      },
      include: {
        type: true,
        team: true,
        player: true,
      },
    });
    return h.response(game);
  } catch (err) {
    console.log(err);
  }
}

async function deleteGameEventHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const eventId = Number(request.params.eventId);

  try {
    // TODO: handle game event not found
    const gameEvent = await prisma.gameEvent.delete({
      where: {
        id: eventId,
      },
      include: {
        type: true,
        team: true,
        player: true,
      },
    });
    return h.response(gameEvent);
  } catch (err) {
    console.log(err);
  }
}
