import Hapi from "@hapi/hapi";
import Joi from "joi";
import { Prisma } from "@prisma/client";

export const teamsPlugin = {
  name: "app/teams",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "GET",
        path: "/teams",
        handler: getTeamsHandler,
      },
    ]);

    server.route([
      {
        method: "GET",
        path: "/teams/{teamId}",
        options: {
          validate: {
            params: Joi.object({
              teamId: Joi.number().required(),
            }),
          },
        },
        handler: getTeamHandler,
      },
    ]);

    server.route([
      {
        method: "POST",
        path: "/teams",
        options: {
          validate: {
            payload: Joi.object({
              name: Joi.string().required(),
            }),
          },
        },
        handler: postTeamHandler,
      },
    ]);

    server.route([
      {
        method: "PUT",
        path: "/teams/{teamId}",
        options: {
          validate: {
            params: Joi.object({
              teamId: Joi.number().required(),
            }),
            payload: Joi.object({
              name: Joi.string().required(),
            }),
          },
        },
        handler: putTeamHandler,
      },
    ]);

    server.route([
      {
        method: "DELETE",
        path: "/teams/{teamId}",
        options: {
          validate: {
            params: Joi.object({
              teamId: Joi.number().required(),
            }),
          },
        },
        handler: deleteTeamHandler,
      },
    ]);
  },
};

async function getTeamsHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  try {
    const teams = await prisma.team.findMany();
    return h.response(teams);
  } catch (err) {
    console.log(err);
  }
}

async function getTeamHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const teamId = Number(request.params.teamId);

  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (team) {
      return h.response(team);
    }

    return h
      .response({
        statusCode: 404,
        error: "Not Found",
        message: `Team with an id ${teamId} was not found`,
      })
      .code(404);
  } catch (err) {
    console.log(err);
  }
}

async function postTeamHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const teamData = request.payload as Prisma.TeamCreateInput;

  try {
    const team = await prisma.team.create({
      data: teamData,
    });
    return h.response(team);
  } catch (err) {
    console.log(err);
  }
}

async function putTeamHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const teamId = Number(request.params.teamId);
  const teamData = request.payload as Prisma.TeamCreateInput;

  try {
    // TODO: handle team not found
    const team = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: teamData,
    });
    return h.response(team);
  } catch (err) {
    console.log(err);
  }
}

async function deleteTeamHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const teamId = Number(request.params.teamId);

  try {
    // TODO: handle team not found
    const team = await prisma.team.delete({
      where: {
        id: teamId,
      },
    });
    return h.response(team);
  } catch (err) {
    console.log(err);
  }
}
