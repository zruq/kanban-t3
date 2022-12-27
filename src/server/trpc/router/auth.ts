import { flatten } from "lodash";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
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
  getNewBoardById: protectedProcedure
    .input(z.object({ id: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const board = await ctx.prisma.board.findFirst({
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
                  status: { select: { id: true } },
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
      if (board) {
        const tasks = flatten(board.Column.map((column) => column.Task));
        return {
          id: board.id,
          name: board.name,
          tasks,
          columnsList: board.Column.map((column) => {
            return { name: column.name, id: column.id };
          }),
        };
      }

      return board;
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
          status: { select: { id: true } },
          description: true,
          SubTask: true,
          title: true,
        },
      });
    }),
  toggleSubtask: protectedProcedure
    .input(z.object({ id: z.number(), value: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.subTask.update({
        where: { id: input.id },
        data: { isCompleted: input.value },
      });
    }),
  moveTask: protectedProcedure
    .input(z.object({ taskID: z.number(), newColumnID: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.task.update({
        where: { id: input.taskID },
        data: { status: { connect: { id: input.newColumnID } } },
      });
    }),
});
