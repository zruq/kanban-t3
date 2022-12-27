import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getLatestBoard: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findFirst({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        Column: {
          orderBy: { createdAt: "asc" },
          select: {
            name: true,
            id: true,
            Task: {
              orderBy: { createdAt: "asc" },
              select: {
                title: true,
                description: true,
                id: true,
                statusName: true,
                SubTask: {
                  select: { id: true, title: true, isCompleted: true },
                },
              },
            },
          },
        },
      },
    });
  }),
  getBoardsList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany({
      where: { userId: ctx.session.user.id },
      select: { id: true, name: true },
      orderBy: { updatedAt: "desc" },
    });
  }),
  getBoardById: protectedProcedure
    .input(z.object({ id: z.number().optional() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.board.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          Column: {
            orderBy: { createdAt: "asc" },
            select: {
              name: true,
              id: true,
              Task: {
                orderBy: { createdAt: "asc" },
                select: {
                  title: true,
                  description: true,
                  statusName: true,
                  id: true,
                  SubTask: {
                    select: { id: true, title: true, isCompleted: true },
                  },
                },
              },
            },
          },
        },
      });
    }),
  postNewTask: protectedProcedure
    .input(
      z.object({
        boardId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        subtasks: z.array(z.string()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.task.create({
        data: {
          title: input.title,
          statusName: input.status,
          boardId: input.boardId,
          description: input.description,
          SubTask: {
            createMany: {
              data: input.subtasks.map((subtask) => {
                return { title: subtask };
              }),
            },
          },
        },
        select: {
          id: true,
          statusName: true,
          description: true,
          SubTask: true,
          title: true,
        },
      });
    }),
});
