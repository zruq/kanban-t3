import type { QBoard } from "../server/trpc/router/_app";
import type { Action } from "./action";
export default function reducer(state: QBoard, action: Action) {
  if (action.type === "ADD_TASK") {
    return state;
  }
  return state;
}
