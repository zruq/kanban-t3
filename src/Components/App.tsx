import { isNumber } from "lodash";
import { useReducer, useState } from "react";
import type { QBoard } from "../server/trpc/router/_app";
import reducer from "../state/appStateReducer";
import ColumnCard from "./ColumnCard";
import Navbar from "./Navbar";
import Modal from "./shared/Modal";
import ViewTask from "./ViewTask";

type AppProps = {
  showSideBar: boolean;
  board: QBoard;
};

const App = ({ board, showSideBar }: AppProps) => {
  const [appState, dispatch] = useReducer(reducer, board);
  const [showModal, setShowModal] = useState<boolean | number>(false);

  // const tasks = appState.Column.reduce((acc: TaskType[], curr) => {
  //   return acc.concat(curr.Task);
  // }, []);
  // const focusedTask = !isBoolean(showModal)
  //   ? tasks.find((task) => task.id === showModal.id)
  //   : undefined;
  return (
    <>
      <Navbar
        boardId={appState.id}
        dispatch={dispatch}
        showSideBar={showSideBar}
        boardName={appState.name}
        colsList={appState.columnsList}
      />
      <main
        className={`h-full  overflow-auto bg-lightGrey dark:bg-veryDarkGrey`}
      >
        <div className="flex items-start justify-start p-10">
          {appState.columnsList.map((col, index) => (
            <ColumnCard
              setShowModal={setShowModal}
              index={index}
              className="mr-6 w-[17.5rem]"
              key={col.id}
              tasks={appState.tasks.filter((task) => task.status.id === col.id)}
              name={col.name}
            />
          ))}
        </div>
        {isNumber(showModal) && (
          <Modal setShowModal={setShowModal}>
            <ViewTask
              task={appState.tasks.find((twisk) => twisk.id === showModal)}
              dispatch={dispatch}
              cols={appState.columnsList}
            />
          </Modal>
        )}
      </main>
    </>
  );
};

export default App;
