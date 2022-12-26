import type { Dispatch, SetStateAction } from "react";
import { useReducer, useState } from "react";
import type { QBoard } from "../server/trpc/router/_app";
import reducer from "../state/appStateReducer";
import Button from "./shared/Button";
import Checkbox from "./shared/Checkbox";
import Dropdown from "./shared/Dropdown";
import TextField from "./shared/TextField";
import Sidebar from "./Sidebar";

type AppProps = {
  initBoard: QBoard;
  isLight: boolean;
  setIsLight: Dispatch<SetStateAction<boolean>>;
};

const App = ({ initBoard, isLight, setIsLight }: AppProps) => {
  const [appState, dispatch] = useReducer(reducer, initBoard);
  //   const [appState, setAppState] = useState(initBoard);
  console.log("stito", appState);
  return (
    <>
      <div className="h-screen w-full">
        <main
          className={` h-full w-full bg-lightGrey dark:bg-darkGrey
           `}
        >
          <div className="my-4">
            <Button cType="primaryS" onClick={() => setIsLight(!isLight)}>
              Button Primary (S)
            </Button>
          </div>
          <div className="my-4">
            <Button cType="secondary">Button secondary</Button>
          </div>
          <div className="my-4">
            <Button cType="destructive">Button destructive</Button>
          </div>
          <div className="my-4">
            <Button cType="primaryL">Button Primary (L)</Button>
          </div>
          <div className="my-10">
            <Checkbox
              dispatch={dispatch}
              title={appState?.Column[0]?.Task[0]?.SubTask[0]?.title || "asd"}
              isCompleted={
                appState?.Column[0]?.Task[0]?.SubTask[0]?.isCompleted || false
              }
            />
            <Checkbox
              dispatch={dispatch}
              title={appState?.Column[0]?.Task[0]?.SubTask[1]?.title || ""}
              isCompleted={
                appState?.Column[0]?.Task[0]?.SubTask[1]?.isCompleted || false
              }
            />
          </div>
          <div className="p-10">
            <Dropdown
              currentColumn={"doing"}
              columns={["Doing", "To do", "Done"]}
            />
          </div>
          <div className="p-4">
            <TextField />
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
