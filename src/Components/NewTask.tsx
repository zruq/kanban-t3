import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Action } from "../state/action";
import Button from "./shared/Button";
import Card from "./shared/Card";
import { trpc } from "../utils/trpc";

const NewTask = ({
  cols,
  dispatch,
  setShowModal,
}: {
  cols: string[];
  dispatch: Dispatch<Action>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  boardId: number;
}) => {
  const [newTaskState, setNewTaskState] = useState({
    title: "",
    description: "",
    status: cols[0] as string,
    subtasks: ["", ""],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const mutation = trpc.auth.postNewTask.useMutation({
    onSuccess: (data) => {
      dispatch({ type: "ADD_TASK", payload: { task: data } });
    },
  });

  return (
    <Card
      onClick={(e) => {
        e.stopPropagation();
        setShowDropdown(false);
      }}
    >
      <form>
        <h2 className="pb-6 text-hl text-black dark:text-white">
          Add New Task
        </h2>
        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          Title
          <input
            placeholder="e.g. Take coffee break"
            className={`textInput`}
            value={newTaskState.title}
            onChange={(e) =>
              setNewTaskState({ ...newTaskState, title: e.target.value })
            }
          />
        </label>
        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          Description
          <textarea
            value={newTaskState.description}
            onChange={(e) =>
              setNewTaskState({ ...newTaskState, description: e.target.value })
            }
            placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little."
            className={`textInput h-[7rem] resize-none`}
          />
        </label>
        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          Subtasks
          {newTaskState.subtasks.map((subtask, index) => (
            <div className="flex items-center justify-start pb-3" key={index}>
              <input
                placeholder={
                  index % 2 === 0
                    ? "e.g. Make coffee"
                    : "e.g. Drink coffee & smile"
                }
                className={`textInput my-0 mr-4 `}
                value={subtask}
                onChange={(e) =>
                  setNewTaskState({
                    ...newTaskState,
                    subtasks: newTaskState.subtasks.map(
                      (subtaskie, indexie) => {
                        if (indexie === index) return e.target.value;
                        return subtaskie;
                      }
                    ),
                  })
                }
              />
              <svg
                onClick={() =>
                  setNewTaskState({
                    ...newTaskState,
                    subtasks: newTaskState.subtasks.filter(
                      (subtaskie, indexie) => indexie !== index
                    ),
                  })
                }
                className="cursor-pointer fill-mediumGrey hover:fill-red"
                width="15"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fillRule="evenodd">
                  <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                  <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                </g>
              </svg>
            </div>
          ))}
        </label>
        <Button
          cType="secondary"
          className="mb-6 w-full"
          onClick={(e) => {
            e.preventDefault();

            setNewTaskState({
              ...newTaskState,
              subtasks: [...newTaskState.subtasks, ""],
            });
          }}
        >
          + Add New Subtask
        </Button>
        {/* dropdown */}
        <label
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="text-hs tracking-normal text-mediumGrey dark:text-white"
        >
          Status
          <div
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className={`relative mt-2 flex h-[40px]  cursor-pointer items-center justify-between rounded-[4px] border  ${
              showDropdown
                ? "border-purple"
                : "border-[#828FA3] border-opacity-25"
            }  py-2 px-4`}
          >
            <div className="text-bodyl text-black dark:text-white">
              {newTaskState.status}
            </div>
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke="#635FC7"
                strokeWidth="2"
                fill="none"
                d="m1 1 4 4 4-4"
              />
            </svg>
            <ul
              className={` absolute top-[120%] left-0 z-50 w-full rounded-lg  bg-white p-4  dark:bg-veryDarkGrey ${
                showDropdown ? "" : "hidden"
              } `}
            >
              {cols.map((col) => (
                <li
                  onClick={() => {
                    setNewTaskState({ ...newTaskState, status: col });
                    setShowDropdown(false);
                  }}
                  key={col}
                  className="mb-2 cursor-pointer text-bodyl capitalize text-mediumGrey hover:text-black dark:hover:text-white"
                >
                  {col}
                </li>
              ))}
            </ul>
          </div>
        </label>
        {/* dropdown */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            mutation.mutate({
              boardId: 1,
              status: newTaskState.status,
              title: newTaskState.title,
              subtasks: newTaskState.subtasks,
              description: newTaskState.description,
            });
            setShowModal(false);
          }}
          cType="primaryS"
          className="my-0 mt-6 w-full"
          type="submit"
        >
          Create Task
        </Button>
      </form>
    </Card>
  );
};

export default NewTask;