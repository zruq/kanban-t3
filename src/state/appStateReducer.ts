import type { QBoard } from "../server/trpc/router/_app";
import type { Action } from "./action";

export default function reducer(state: QBoard, action: Action): QBoard {
  if (action.type === "TOGGLE_SUBTASK") {
    const { taskID, subtaskID } = action.payload;
    return {
      ...state,
      tasks: state?.tasks.map((task) => {
        if (task.id === taskID)
          return {
            ...task,
            SubTask: task.SubTask.map((subtask) => {
              if (subtask.id === subtaskID) {
                return { ...subtask, isCompleted: !subtask.isCompleted };
              }
              return subtask;
            }),
          };
        return task;
      }),
    };
  }
  if (action.type === "MOVE_TASK") {
    const { taskID, newColumnID } = action.payload;
    return {
      ...state,
      tasks: state?.tasks.map((task) => {
        if (task.id === taskID)
          return {
            ...task,
            status: { id: newColumnID },
          };
        return task;
      }),
    };
  }
  if (action.type === "ADD_TASK") {
    const { task } = action.payload;
    return { ...state, tasks: state.tasks.concat(task) };
  }
  if (action.type === "EDIT_TASK") {
    const { task, taskID } = action.payload;
    return {
      ...state,
      tasks: state.tasks.map((twisk) => {
        if (twisk.id === taskID) return task;
        return twisk;
      }),
    };
  }
  if (action.type === "DELETE_TASK") {
    return {
      ...state,
      tasks: state.tasks.filter((task) => task.id !== action.payload.id),
    };
  }
  return state;
  // if (action.type === "TOGGLE_SUBTASK") {
  //   const { index, columnindex, taskindex } = action.payload;
  //   // const newState = JSON.parse(JSON.stringify(state)) as QBoard;
  //   const newState = cloneDeep(state);
  //   console.log("from reducer", newState);
  //   const isSubTaskCompleted =
  //     newState.Column[columnindex]!.Task[taskindex]!.SubTask[index]!
  //       .isCompleted;
  //   newState.Column[columnindex]!.Task[taskindex]!.SubTask[index]!.isCompleted =
  //     !isSubTaskCompleted;
  //   return newState;
  // }
  // if (action.type === "MOVE_TASK") {
  //   const { newColumnIndex, columnindex, taskindex } = action.payload;
  //   const newState = cloneDeep(state);
  //   const task = newState.Column[columnindex]!.Task[taskindex];
  //   console.log(task?.id);
  //   if (task) {
  //     task.statusName = newState.Column[newColumnIndex]!.name;
  //     newState.Column[newColumnIndex]!.Task.push(task);
  //     console.log("moved to", task.statusName);
  //   }
  //   newState.Column[columnindex]!.Task.splice(taskindex, 1);
  //   return newState;
  // }
}
