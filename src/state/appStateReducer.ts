import type { QBoard } from "../server/trpc/router/_app";
import type { Action } from "./action";
import { cloneDeep } from "lodash";

export default function reducer(state: QBoard, action: Action) {
  if (action.type === "ADD_TASK") {
    return state;
  }
  if (action.type === "TOGGLE_SUBTASK") {
    const { index, columnindex, taskindex } = action.payload;
    // const newState = JSON.parse(JSON.stringify(state)) as QBoard;
    const newState = cloneDeep(state);
    console.log("from reducer", newState);
    const isSubTaskCompleted =
      newState.Column[columnindex]!.Task[taskindex]!.SubTask[index]!
        .isCompleted;
    newState.Column[columnindex]!.Task[taskindex]!.SubTask[index]!.isCompleted =
      !isSubTaskCompleted;
    return newState;
    // const x = newState.Column[action.payload.columnindex]!.Task[
    //   action.payload.taskindex
    // ]!.SubTask[action.payload.id]!.isCompleted as boolean;
    // newState.Column[action.payload.columnindex]!.Task[
    //   action.payload.taskindex
    // ]!.SubTask[action.payload.id]!.isCompleted = !x;
    // return newState;
    return state;
  }
  return state;
}
