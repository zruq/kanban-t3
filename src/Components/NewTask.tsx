import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Button from "./shared/Button";
import Card from "./shared/Card";
import { trpc } from "../utils/trpc";
import type { Action } from "../state/reducer";

type NewTaskProps = {
  cols: { name: string; id: number }[];
  dispatch: Dispatch<Action>;
  setShowModal:
    | Dispatch<SetStateAction<boolean | number>>
    | Dispatch<SetStateAction<boolean>>;
  boardID: number;
  task?: {
    SubTask: {
      id: number;
      title: string;
    }[];
    id: number;
    status: {
      id: number;
    };
    title: string;
    description: string | null;
  };
};
const NewTask = ({
  cols,
  dispatch,
  setShowModal,
  task,
  boardID,
}: NewTaskProps) => {
  const [newTaskState, setNewTaskState] = useState(
    task
      ? {
          title: { content: task?.title as string, error: "" },
          description: task?.description || "",
          subtasks: task?.SubTask.map((subtask) => {
            return { ...subtask, error: "", fakeid: undefined };
          }) as {
            title: string;
            id?: number;
            fakeid?: number;
            error: string;
          }[],
          status: cols.filter((col) => col.id === task?.status.id)[0]
            ?.name as string,
        }
      : {
          title: { content: "", error: "" },
          description: "",
          status: cols[0]?.name as string,
          subtasks: [
            { title: "", id: undefined, fakeid: -1, error: "" },
            { title: "", id: undefined, fakeid: -2, error: "" },
          ],
        }
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const mutation = trpc.auth.postNewTask.useMutation({
    onSuccess: (data) => {
      dispatch({ type: "ADD_TASK", payload: { task: data, boardID } });
      setShowModal(false);
    },
  });
  const editTaskMutation = trpc.auth.editTask.useMutation({
    onSuccess: (data) => {
      // update task silently mostly subtasks ids
      dispatch({
        type: "SILENT_EDIT_TASK",
        payload: { task: data, boardID },
      });
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
          {task ? "Edit Task" : "Add New Task"}
        </h2>
        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          Title
          <div className="relative">
            <input
              onBlur={(e) => {
                if (!e.target.value) {
                  setNewTaskState({
                    ...newTaskState,
                    title: {
                      content: newTaskState.title.content,
                      error: "Can’t be empty",
                    },
                  });
                }
              }}
              placeholder="e.g. Take coffee break"
              className={`textInput ${
                newTaskState.title.error ? "border-red" : ""
              } `}
              value={newTaskState.title.content}
              onChange={(e) =>
                setNewTaskState({
                  ...newTaskState,
                  title: {
                    content: e.target.value,
                    error: e.target.value ? "" : "Can’t be empty",
                  },
                })
              }
            />
            {newTaskState.title.error && (
              <div className="absolute right-0 top-0 bottom-0 my-auto mr-4 h-fit text-bodyl text-red">
                {newTaskState.title.error}
              </div>
            )}
          </div>
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
          <div className="mt-6 pb-2"> Subtasks </div>
          {newTaskState.subtasks.map((subtask, index) => (
            <div
              className="flex items-center justify-start pb-3"
              key={subtask.id || subtask.fakeid}
            >
              <div className="relative mr-4 w-full">
                <input
                  placeholder={
                    index % 2 === 0
                      ? "e.g. Make coffee"
                      : "e.g. Drink coffee & smile"
                  }
                  className={`textInput my-0  ${
                    subtask.error ? "border-red" : ""
                  } `}
                  value={subtask.title}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setNewTaskState((newTaskState) => {
                        return {
                          ...newTaskState,
                          subtasks: newTaskState.subtasks.map((subtaskie) => {
                            if (
                              subtask.id
                                ? subtaskie.id === subtask.id
                                : subtaskie.fakeid === subtask.fakeid
                            )
                              return { ...subtaskie, error: "Can’t be empty" };
                            return subtaskie;
                          }),
                        };
                      });
                    }
                  }}
                  onChange={(e) =>
                    setNewTaskState({
                      ...newTaskState,
                      subtasks: newTaskState.subtasks.map((subtaskie) => {
                        if (
                          subtask.id
                            ? subtaskie.id === subtask.id
                            : subtaskie.fakeid === subtask.fakeid
                        )
                          return {
                            ...subtaskie,
                            title: e.target.value,
                            error: e.target.value ? "" : "Can’t be empty",
                            fakeid: subtaskie.fakeid,
                          };
                        return subtaskie;
                      }),
                    })
                  }
                />
                {subtask.error && (
                  <div className="absolute right-0 top-0 bottom-0 my-auto mr-4 h-fit rounded-l-3xl bg-white pl-4 text-bodyl text-red dark:bg-darkGrey">
                    {subtask.error}
                  </div>
                )}
              </div>
              <svg
                onClick={() =>
                  setNewTaskState({
                    ...newTaskState,
                    subtasks: newTaskState.subtasks.filter((subtaskie) =>
                      subtask.id
                        ? subtaskie.id !== subtask.id
                        : subtaskie.fakeid !== subtask.fakeid
                    ),
                  })
                }
                className="w-4 cursor-pointer fill-mediumGrey hover:fill-red"
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
              subtasks: [
                ...newTaskState.subtasks,
                { title: "", error: "", fakeid: new Date().getTime() },
              ],
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
                    setNewTaskState({ ...newTaskState, status: col.name });
                    setShowDropdown(false);
                  }}
                  key={col.id}
                  className="mb-2 cursor-pointer text-bodyl capitalize text-mediumGrey hover:text-black dark:hover:text-white"
                >
                  {col.name}
                </li>
              ))}
            </ul>
          </div>
        </label>
        {/* dropdown */}
        <Button
          disabled={
            !!newTaskState.title.error ||
            !!newTaskState.subtasks.find((subtask) => subtask.error)?.error ||
            mutation.isLoading
          }
          onClick={(e) => {
            e.preventDefault();
            //check for errors
            let theresAnError = false;
            if (!newTaskState.title.content) {
              setNewTaskState((newTaskState) => {
                return {
                  ...newTaskState,
                  title: { content: "", error: "Can’t be empty" },
                };
              });
              theresAnError = true;
            }
            const uniqueSubtasksNames: string[] = [];
            const subtasks = newTaskState.subtasks.map((subtask) => {
              if (!subtask.title) {
                theresAnError = true;
                return { ...subtask, error: "Can’t be empty" };
              }
              if (
                uniqueSubtasksNames.find(
                  (subtaskname) =>
                    subtaskname === subtask.title.trim().toLowerCase()
                )
              ) {
                theresAnError = true;
                return { ...subtask, error: "Must be unique" };
              } else {
                uniqueSubtasksNames.push(subtask.title.trim().toLowerCase());
              }
              return subtask;
            });
            setNewTaskState((newTaskState) => {
              return { ...newTaskState, subtasks: subtasks };
            });
            if (theresAnError) return;
            //if no error mutate
            if (!task)
              mutation.mutate({
                boardID: boardID,
                status: newTaskState.status,
                title: newTaskState.title.content,
                subtasks: newTaskState.subtasks.map((subtask) => subtask.title),
                description: newTaskState.description,
              });
            else {
              dispatch({
                type: "EDIT_TASK",
                payload: {
                  taskID: task.id,
                  boardID: boardID,
                  status: cols.find((col) => col.name === newTaskState.status)
                    ?.id as number,
                  title: newTaskState.title.content,
                  subtasks: newTaskState.subtasks,
                  description: newTaskState.description,
                },
              });
              editTaskMutation.mutate({
                taskID: task.id,
                boardID: boardID,
                status: newTaskState.status,
                title: newTaskState.title.content,
                subtasks: newTaskState.subtasks,
                description: newTaskState.description,
              });
              setShowModal(false);
            }
          }}
          cType="primaryS"
          className="my-0 mt-6 w-full disabled:cursor-not-allowed disabled:opacity-25"
          type="submit"
        >
          {task ? (
            "Save Changes"
          ) : mutation.isLoading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2  inline-block h-4 w-4  animate-spin rounded-full border-l border-purple "></div>{" "}
              <div className="inline-block"> Creating New Task</div>
            </div>
          ) : (
            "Create Task"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default NewTask;
