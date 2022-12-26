import type { Dispatch } from "react";
import type { Action } from "../state/action";
import Checkbox from "./shared/Checkbox";
import Dropdown from "./shared/Dropdown";

type ViewTaskProps = {
  indices: { taskindex: number; columnindex: number };
  cols: { name: string; index: number }[];
  task: {
    SubTask: {
      id: number;
      title: string;
      isCompleted: boolean;
    }[];
    id: number;
    title: string;
    statusName: string;
    description: string | null;
  };
  dispatch: Dispatch<Action>;
};
const ViewTask = ({ cols, task, indices, dispatch }: ViewTaskProps) => {
  return (
    <div
      className="w-[30rem] rounded-md bg-white p-8 dark:bg-darkGrey"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-6">
        <h2 className="pr-6 text-hl text-black dark:text-white">
          {task.title}
        </h2>
        <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
          <g fill="#828FA3" fillRule="evenodd">
            <circle cx="2.308" cy="2.308" r="2.308" />
            <circle cx="2.308" cy="10" r="2.308" />
            <circle cx="2.308" cy="17.692" r="2.308" />
          </g>
        </svg>
      </div>
      <p
        className={`pb-6 text-bodyl text-mediumGrey ${
          task.description ? "" : "hidden"
        }`}
      >
        {task.description}
      </p>
      <h3 className="pb-4 text-bodym font-bold text-black dark:text-white">
        Subtasks ({task.SubTask.filter((subtask) => subtask.isCompleted).length}{" "}
        of {task.SubTask.length} )
      </h3>
      {task.SubTask.map((subtask, index) => (
        <Checkbox
          className="mb-2"
          indices={{ ...indices, index }}
          isCompleted={subtask.isCompleted}
          key={subtask.id}
          title={subtask.title}
          dispatch={dispatch}
        />
      ))}
      <h3 className="mt-6 pb-2 text-bodym font-bold text-black dark:text-white">
        Current Status
      </h3>
      <Dropdown
        dispatch={dispatch}
        columns={cols}
        currentColumn={task.statusName}
        indices={indices}
      />
    </div>
  );
};

export default ViewTask;
