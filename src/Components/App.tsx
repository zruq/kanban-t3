import { isNumber } from "lodash";
import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ColumnCard from "./ColumnCard";
import Navbar from "./Navbar";
import NewBoard from "./NewBoard";
import Modal from "./shared/Modal";
import ViewTask from "./ViewTask";
import Button from "./shared/Button";
import { AppStateContext } from "../state/appStateContext";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskCard from "./TaskCardDrag";
import { trpc } from "../utils/trpc";

type AppProps = {
  showSideBar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
};

const App = ({ setShowSidebar, showSideBar }: AppProps) => {
  const [showModal, setShowModal] = useState<boolean | number>(false);
  const [updatedDnd, setUpdatedDnd] = useState(false);
  const { activeBoard, dispatch, boardsList } = useContext(AppStateContext);
  const mutation = trpc.auth.updateOrders.useMutation();
  const [activeId, setActiveId] = useState<number | null>(null);
  if (updatedDnd) {
    mutation.mutate(
      activeBoard.tasks.map((task) => {
        return { taskid: task.id, colid: task.status.id, order: task.order };
      })
    );
    setUpdatedDnd(false);
  }
  const draggedTask = activeId
    ? activeBoard.tasks.find((task) => task.id === activeId)
    : null;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8, tolerance: 100 },
    }),
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as number);
  };

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    const overId = over?.id;

    if (!overId) {
      return;
    }
    const activeColId = +active?.data?.current?.sortable?.containerId.slice(3);
    const overColId =
      +over?.data?.current?.sortable?.containerId.slice(3) ||
      (over?.data?.current?.colid as number);
    if (activeColId !== overColId) {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          boardID: activeBoard.id,
          newColumnID: overColId,
          taskID: active.id as number,
          overId: over.id as number,
        },
      });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      const activeColId =
        +active?.data?.current?.sortable?.containerId.slice(3);
      const overColId =
        +over?.data?.current?.sortable?.containerId.slice(3) ||
        (over?.data?.current?.colid as number);

      if (activeColId === overColId) {
        // change order
        dispatch({
          type: "CHANGE_TASK_ORDER",
          payload: {
            activeTaskId: active.id as number,
            overTaskId: over.id as number,
            colId: activeColId,
          },
        });
      } else {
        // change column
        dispatch({
          type: "MOVE_TASK",
          payload: {
            boardID: activeBoard.id,
            newColumnID: overColId,
            taskID: active.id as number,
            overId: over.id as number,
          },
        });
      }
    }
    setUpdatedDnd(true);
    setActiveId(null);
  };

  return (
    <>
      <div
        className={`h-full ${
          showSideBar
            ? "w-full tablet:w-[calc(100vw-261px)] desktop:w-[calc(100vw-300px)]"
            : "w-full"
        }`}
      >
        <Navbar
          setShowSidebar={setShowSidebar}
          boardID={activeBoard.id}
          dispatch={dispatch}
          showSideBar={showSideBar}
          boardName={activeBoard.name}
          colsList={activeBoard.columnsList}
          boardsList={boardsList}
        />
        <main
          className={`h-full w-full bg-lightGrey pb-12 dark:bg-veryDarkGrey`}
        >
          <div className="flex h-full w-full items-start justify-start overflow-auto  p-10">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {activeBoard.columnsList.map((col) => (
                <ColumnCard
                  colid={col.id}
                  setShowModal={setShowModal}
                  className="mr-6 h-full w-[17.5rem] min-w-[17.5rem]"
                  key={col.id}
                  tasks={activeBoard.tasks
                    .filter((task) => task.status.id === col.id)
                    .sort((a, b) => a.order - b.order)}
                  name={col.name}
                />
              ))}
              <DragOverlay>
                {activeId ? (
                  <TaskCard
                    title={draggedTask?.title ?? ""}
                    numberOfCompletedSubtasks={
                      draggedTask?.SubTask.filter(
                        (subtask) => subtask.isCompleted
                      ).length ?? -1
                    }
                    numberOfTotalSubtasks={draggedTask?.SubTask.length ?? -1}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
            {activeBoard.columnsList.length >= 1 ? (
              <button
                onClick={() => setShowModal(-1)}
                className="mt-10 flex min-h-[90%] w-[17.5rem] min-w-[17.5rem] max-w-[17.5rem] cursor-pointer items-center justify-center rounded-md bg-opacity-25 bg-gradient-to-br from-[#E9EFFA] to-[#e9effa80] text-hxl text-mediumGrey hover:text-purple dark:bg-opacity-25 dark:from-[#2b2c3740] dark:to-[#2b2c3720]"
              >
                + New Column
              </button>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-center text-hl text-mediumGrey">
                This board is empty. Create a new column to get started.
                <Button
                  cType="primaryL"
                  onClick={() => setShowModal(-1)}
                  className="mt-6"
                >
                  + Add New Column
                </Button>
              </div>
            )}
          </div>
          {isNumber(showModal) && (
            <Modal setShowModal={setShowModal}>
              {showModal >= 0 ? (
                <ViewTask
                  parentSetShowModal={setShowModal}
                  boardID={activeBoard.id}
                  task={activeBoard.tasks.find(
                    (twisk) => twisk.id === showModal
                  )}
                  dispatch={dispatch}
                  cols={activeBoard.columnsList}
                />
              ) : showModal === -1 ? (
                <NewBoard
                  setShowModal={setShowModal}
                  // boardsList={boardsList}
                  // dispatch={dispatch}
                  board={{
                    name: activeBoard.name,
                    columns: activeBoard.columnsList,
                    id: activeBoard.id,
                  }}
                />
              ) : null}
            </Modal>
          )}
        </main>
      </div>
      {/* show sidebar */}
      {!showSideBar && (
        <Button
          onClick={() => setShowSidebar(true)}
          cType="primaryL"
          className="fixed bottom-8 -left-1 hidden rounded-l-none tablet:block"
        >
          <svg width="16" height="11" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z"
              fill="#FFF"
            />
          </svg>
        </Button>
      )}
    </>
  );
};

export default App;
