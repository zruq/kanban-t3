import { flatten } from "lodash";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getBoards: protectedProcedure.query(async ({ ctx }) => {
    const boards = await ctx.prisma.board.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        Column: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            name: true,
            Task: {
              orderBy: { order: "asc" },
              select: {
                updatedAt: true,
                id: true,
                order: true,
                title: true,
                status: { select: { id: true } },
                description: true,
                SubTask: {
                  orderBy: { createdAt: "asc" },
                  select: {
                    title: true,
                    isCompleted: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return boards
      .map((board) => {
        const tasks = flatten(board.Column.map((column) => column.Task));
        return {
          id: board.id,
          name: board.name,
          tasks,
          columnsList: board.Column.map((column) => {
            return { name: column.name, id: column.id };
          }),
        };
      })
      .sort((a, b) => {
        if (a.tasks[0] && b.tasks[0])
          return (
            b.tasks[0].updatedAt.getTime() - a.tasks[0].updatedAt.getTime()
          );
        return b.id - a.id;
      });
  }),

  postNewTask: protectedProcedure
    .input(
      z.object({
        boardID: z.number(),
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
          boardId: input.boardID,
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
          title: true,
          order: true,
          status: { select: { id: true } },
          description: true,
          SubTask: {
            orderBy: { createdAt: "asc" },
            select: {
              title: true,
              isCompleted: true,
              id: true,
            },
          },
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
  deleteTask: protectedProcedure
    .input(z.number())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.task.delete({
        where: { id: input },
      });
    }),
  editBoard: protectedProcedure
    .input(
      z.object({
        boardID: z.number(),
        name: z.string(),
        columns: z.array(
          z.object({ name: z.string(), id: z.number().optional() })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.boardID === -1) {
        const board = await ctx.prisma.board.create({
          data: {
            name: input.name,
            userId: ctx.session.user.id,
            Column: {
              createMany: {
                data: input.columns.map((col) => {
                  return { name: col.name };
                }),
              },
            },
          },
          select: {
            id: true,
            name: true,
            Column: {
              orderBy: { id: "asc" },
              select: {
                name: true,
                id: true,
              },
            },
          },
        });
        return {
          id: board.id,
          name: board.name,
          tasks: [],
          columnsList: board.Column.map((column) => {
            return { name: column.name, id: column.id };
          }),
        };
      }
      const columnsToUpdate = input.columns.filter((column) => column.id);
      const columnsToCreate = input.columns.filter((column) => !column.id);
      columnsToUpdate.forEach(async (column) => {
        await ctx.prisma.column.update({
          where: { id: column.id },
          data: { name: column.name },
        });
      });
      const colIDStoNotDelete = columnsToUpdate.map(
        (col) => col.id
      ) as number[];
      await ctx.prisma.column.deleteMany({
        where: { id: { notIn: colIDStoNotDelete }, boardId: input.boardID },
      });
      const board = await ctx.prisma.board.update({
        where: { id: input.boardID },
        data: {
          name: input.name,
          Column: { createMany: { data: columnsToCreate } },
        },
        select: {
          id: true,
          name: true,
          Column: {
            orderBy: { id: "asc" },
            select: {
              name: true,
              id: true,
              Task: {
                orderBy: { id: "asc" },
                select: {
                  title: true,
                  description: true,
                  order: true,
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
  createBoard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        columns: z.array(z.object({ name: z.string() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const board = await ctx.prisma.board.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          Column: { createMany: { data: input.columns } },
        },
        select: {
          id: true,
          name: true,
          Column: { select: { name: true, id: true } },
        },
      });
      return {
        id: board.id,
        name: board.name,
        tasks: [],
        columnsList: board.Column.map((column) => {
          return { name: column.name, id: column.id };
        }),
      };
    }),
  deleteBoard: protectedProcedure
    .input(z.object({ id: z.number(), createNewBoard: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (input.createNewBoard) {
        await ctx.prisma.board.create({
          data: { name: "Untitled Board", userId: ctx.session.user.id },
        });
      }
      return ctx.prisma.board.delete({ where: { id: input.id } });
    }),
  editTask: protectedProcedure
    .input(
      z.object({
        taskID: z.number(),
        boardID: z.number(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        subtasks: z.array(
          z.object({ title: z.string(), id: z.number().optional() })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const subtasksToUpdate = input.subtasks.filter((subtask) => subtask.id);
      subtasksToUpdate.forEach(async (subtask) => {
        await ctx.prisma.subTask.update({
          where: { id: subtask.id },
          data: { title: subtask.title },
        });
      });
      // deleting deleted subtasks
      const updatedIds = subtasksToUpdate.map(
        (subtask) => subtask.id
      ) as number[];
      await ctx.prisma.subTask.deleteMany({
        where: { id: { notIn: updatedIds }, taskId: input.taskID },
      });
      const subtasksToCreate = input.subtasks.filter((subtask) => !subtask.id);
      return ctx.prisma.task.update({
        where: { id: input.taskID },
        select: {
          id: true,
          title: true,
          status: { select: { id: true } },
          description: true,
          order: true,
          SubTask: {
            orderBy: { id: "asc" },
            select: {
              title: true,
              isCompleted: true,
              id: true,
            },
          },
        },
        data: {
          title: input.title,
          description: input.description,
          status: {
            connect: {
              name_boardId: { boardId: input.boardID, name: input.status },
            },
          },
          SubTask: { createMany: { data: subtasksToCreate } },
        },
      });
    }),
  updateOrders: protectedProcedure
    .input(
      z.array(
        z.object({ taskid: z.number(), colid: z.number(), order: z.number() })
      )
    )
    .mutation(({ input, ctx }) => {
      input.forEach(async (taskInput) => {
        await ctx.prisma.task.update({
          where: { id: taskInput.taskid },
          data: {
            order: taskInput.order,
            status: { connect: { id: taskInput.colid } },
          },
        });
      });
    }),
});
