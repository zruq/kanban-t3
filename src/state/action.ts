import type { SubTask, Task } from "@prisma/client";
import type { QBoard } from "../server/trpc/router/_app";

export type Action =
  | AddTask
  | EditTask
  | DeleteTask
  | ToggleSubTask
  | DeleteBoard
  | EditBoard
  | AddBoard
  | ChangeBoard
  | MoveTask;

type AddTask = {
  type: "ADD_TASK";
  payload:
    | Omit<Task, "createdAt" | "updatedAt" | "id"> & {
        subtasks: Omit<SubTask, "createdAt" | "updatedAt" | "id" | "taskId">[];
      };
};

type EditTask = {
  type: "EDIT_TASK";
  payload:
    | Omit<Task, "createdAt" | "updatedAt"> & {
        subtasks: Omit<SubTask, "createdAt" | "updatedAt" | "id" | "taskId">[];
      };
};

type ToggleSubTask = {
  type: "TOGGLE_SUBTASK";
  payload: {
    taskindex: number;
    columnindex: number;
    index: number;
  };
};

type DeleteTask = {
  type: "DELETE_TASK";
  payload: {
    columnindex: number;
    id: number;
  };
};

type MoveTask = {
  type: "MOVE_TASK";
  payload: {
    columnindex: number;
    id: number;
    newColumnId: number;
  };
};

type DeleteBoard = {
  type: "DELETE_BOARD";
  payload: {
    id: number;
  };
};

type EditBoard = {
  type: "EDIT_BOARD";
  payload: {
    id: number;
    name: string;
    columns: string[];
  };
};

type AddBoard = {
  type: "ADD_BOARD";
  payload: {
    name: string;
    columns: string[];
  };
};

type ChangeBoard = {
  type: "CHANGE_BIARD";
  payload: QBoard;
};
