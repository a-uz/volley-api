import Hapi from "@hapi/hapi";
import Joi from "joi";
import { Prisma } from "@prisma/client";

export const playersPlugin = {
  name: "app/players",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "GET",
        path: "/players",
        handler: getPlayersHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/players/{playerId}",
        options: {
          validate: {
            params: Joi.object({
              playerId: Joi.number().required(),
            }),
          },
        },
        handler: getPlayerHandler,
      },
    ]);

    server.route([
      {
        method: "POST",
        path: "/players",
        options: {
          validate: {
            payload: Joi.object({
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              age: Joi.number().required(),
              number: Joi.number().required(),
              genderId: Joi.number().required(),
              teamId: Joi.number().required(),
            }),
          },
        },
        handler: postPlayerHandler,
      },
    ]);

    server.route([
      {
        method: "PUT",
        path: "/players/{playerId}",
        options: {
          validate: {
            params: Joi.object({
              playerId: Joi.number().required(),
            }),
            payload: Joi.object({
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              age: Joi.number().required(),
              number: Joi.number().required(),
              genderId: Joi.number().required(),
              teamId: Joi.number().required(),
            }),
          },
        },
        handler: putPlayerHandler,
      },
    ]);

    server.route([
      {
        method: "DELETE",
        path: "/players/{playerId}",
        options: {
          validate: {
            params: Joi.object({
              playerId: Joi.number().required(),
            }),
          },
        },
        handler: deletePlayerHandler,
      },
    ]);
  },
};

async function getPlayersHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;

  try {
    const players = await prisma.player.findMany();
    return h.response(players);
  } catch (err) {
    console.log(err);
  }
}

async function getPlayerHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const playerId = Number(request.params.playerId);

  try {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (player) {
      return h.response(player);
    }

    return h
      .response({
        statusCode: 404,
        error: "Not Found",
        message: `Player with an id ${playerId} was not found`,
      })
      .code(404);
  } catch (err) {
    console.log(err);
  }
}

async function postPlayerHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const playerData = request.payload as Prisma.PlayerCreateInput;

  try {
    const player = await prisma.player.create({
      data: playerData,
    });
    return h.response(player);
  } catch (err) {
    console.log(err);
  }
}

async function putPlayerHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const playerId = Number(request.params.playerId);
  const playerData = request.payload as Prisma.PlayerCreateInput;

  try {
    // TODO: handle player not found
    const player = await prisma.player.update({
      where: {
        id: playerId,
      },
      data: playerData,
    });
    return h.response(player);
  } catch (err) {
    console.log(err);
  }
}

async function deletePlayerHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const playerId = Number(request.params.playerId);

  try {
    // TODO: handle player not found
    const player = await prisma.player.delete({
      where: {
        id: playerId,
      },
    });
    return h.response(player);
  } catch (err) {
    console.log(err);
  }
}
