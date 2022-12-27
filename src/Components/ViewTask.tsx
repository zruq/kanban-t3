import { useState } from "react";
import type { Dispatch } from "react";
import type { Action } from "../state/action";
import Checkbox from "./shared/Checkbox";
import Dropdown from "./shared/Dropdown";
import Card from "./shared/Card";

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
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <Card
      onClick={(e) => {
        e.stopPropagation();
        if (showSettings) setShowSettings(false);
        if (showDropdown) setShowDropdown(false);
      }}
    >
      <div className="relative flex items-center justify-between pb-6">
        <h2 className="pr-6 text-hl text-black dark:text-white">
          {task.title}
        </h2>
        <svg
          onClick={() => setShowSettings(!showSettings)}
          width="6"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer fill-mediumGrey hover:fill-purple dark:hover:fill-purpleHover"
        >
          <g fillRule="evenodd">
            <circle cx="2.308" cy="2.308" r="2.308" />
            <circle cx="2.308" cy="10" r="2.308" />
            <circle cx="2.308" cy="17.692" r="2.308" />
          </g>
        </svg>
        {showSettings && (
          <ul className="absolute -right-[24%] top-[70%] min-w-[12rem] cursor-pointer rounded-lg bg-white p-4 text-bodyl  text-mediumGrey dark:bg-veryDarkGrey">
            <li className="hover:text-black">Edit Task</li>
            <li className="pt-4 text-red hover:text-redHover">Delete Task</li>
          </ul>
        )}
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
        active={showDropdown}
        setActive={setShowDropdown}
      />
    </Card>
  );
};

export default ViewTask;
