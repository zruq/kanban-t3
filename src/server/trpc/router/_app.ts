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
  id: number;
  name: string;
  tasks: {
    SubTask: {
      id: number;
      title: string;
      isCompleted: boolean;
    }[];
    id: number;
    status: {
      id: number;
    };
    title: string;
    description?: string;
  }[];
  columnsList: {
    name: string;
    id: number;
  }[];
};
