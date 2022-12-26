import { isBoolean, isNumber } from "lodash";
import { useReducer, useState } from "react";
import type { QBoard } from "../server/trpc/router/_app";
import reducer from "../state/appStateReducer";
import ColumnCard, { TaskType } from "./ColumnCard";
import Modal from "./shared/Modal";
import ViewTask from "./ViewTask";

type AppProps = {
  board: QBoard;
};

const App = ({ board }: AppProps) => {
  const [appState, dispatch] = useReducer(reducer, board);
  const [showModal, setShowModal] = useState<
    boolean | { id: number; index: number }
  >(false);
  const tasks = appState.Column.reduce((acc: TaskType[], curr) => {
    return acc.concat(curr.Task);
  }, []);
  const focusedTask = !isBoolean(showModal)
    ? tasks.find((task) => task.id === showModal.id)
    : undefined;
  const colsList = appState.Column.map((col, index) => {
    return { name: col.name, index: index };
  });
  console.log(tasks);
  return (
    <main className={`h-full  overflow-auto bg-lightGrey dark:bg-veryDarkGrey`}>
      <div className="flex items-start justify-start p-10">
        {appState.Column.map((col, index) => (
          <ColumnCard
            setShowModal={setShowModal}
            index={index}
            dispatch={dispatch}
            className="mr-6 w-[17.5rem]"
            key={col.id}
            tasks={col.Task}
            name={col.name}
          />
        ))}
      </div>
      {!isBoolean(showModal) && (
        <Modal setShowModal={setShowModal}>
          <ViewTask
            task={focusedTask as TaskType}
            dispatch={dispatch}
            cols={colsList}
            indices={{
              taskindex: showModal.index,
              columnindex: colsList.find(
                (col) => col.name === focusedTask?.statusName
              )!.index,
            }}
          />
        </Modal>
      )}
    </main>
  );
};

export default App;
