import type { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { router } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;

export type QBoard = {
  Column: {
    Task: {
      SubTask: {
        id: number;
        title: string;
        isCompleted: boolean;
      }[];
      id: number;
      title: string;
      description: string | null;
    }[];
    id: number;
    name: string;
  }[];
  id: number;
  name: string;
};
