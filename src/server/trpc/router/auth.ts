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
  getData: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        name: true,
        id: true,
        Column: {
          select: {
            name: true,
            id: true,
            Task: {
              select: {
                title: true,
                description: true,
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
});
