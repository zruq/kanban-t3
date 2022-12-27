import type { QBoard } from "../server/trpc/router/_app";
import type { Action } from "./action";
import { cloneDeep } from "lodash";

export default function reducer(state: QBoard, action: Action) {
  if (action.type === "ADD_TASK") {
    const { task } = action.payload;
    return {
      id: state.id,
      name: state.name,
      Column: state.Column.map((column) => {
        if (column.name === task.statusName) {
          return {
            id: column.id,
            name: column.name,
            Task: column.Task.concat([
              {
                id: task.id,
                description: task.description,
                statusName: task.statusName,
                SubTask: task.SubTask,
                title: task.title,
              },
            ]),
          };
        }
        return column;
      }),
    };
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
  }
  if (action.type === "MOVE_TASK") {
    const { newColumnIndex, columnindex, taskindex } = action.payload;
    const newState = cloneDeep(state);
    const task = newState.Column[columnindex]!.Task[taskindex];
    console.log(task?.id);
    if (task) {
      task.statusName = newState.Column[newColumnIndex]!.name;
      newState.Column[newColumnIndex]!.Task.push(task);
      console.log("moved to", task.statusName);
    }
    newState.Column[columnindex]!.Task.splice(taskindex, 1);
    return newState;
  }
  return state;
}
