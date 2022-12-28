import type { SubTask } from "@prisma/client";
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
  payload: {
    task: {
      SubTask: SubTask[];
      id: number;
      title: string;
      description: string | null;
      status: { id: number };
    };
  };
};

type EditTask = {
  type: "EDIT_TASK";
  payload: {
    task: {
      SubTask: SubTask[];
      id: number;
      title: string;
      description: string | null;
      status: { id: number };
    };
    taskID: number;
  };
};

type ToggleSubTask = {
  type: "TOGGLE_SUBTASK";
  payload: {
    taskID: number;
    subtaskID: number;
  };
};

type DeleteTask = {
  type: "DELETE_TASK";
  payload: {
    id: number;
  };
};

type MoveTask = {
  type: "MOVE_TASK";
  payload: {
    taskID: number;
    newColumnID: number;
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
