import { useSession } from "next-auth/react";
import { useEffect, useReducer } from "react";
import type { ReactElement, Dispatch } from "react";
import type { Action } from "./reducer";
import { createContext } from "react";
import { trpc } from "../utils/trpc";
import { reducer } from "./reducer";

export type BoardType = {
  id: number;
  name: string;
  tasks: {
    SubTask: {
      id: number;
      title: string;
      isCompleted: boolean;
      frontendId?: boolean;
    }[];
    id: number;
    status: {
      id: number;
    };
    title: string;
    description: string | null;
  }[];
  columnsList: {
    id: number;
    name: string;
  }[];
};

export type StateType = {
  boards: BoardType[];
  activeBoardId: number;
};

type AppStateContextProps = {
  activeBoard: BoardType;
  boardsList: { id: number; name: string }[];
  dispatch: Dispatch<Action>;
  getNumberOfBoards: () => number;
  getActiveBoardName: () => string;
  changeBoard: (newBoardId: number) => void;
};

export const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

const AppStateProvider = ({ children }: { children: ReactElement }) => {
  const session = useSession();
  const { data: boards, status: fetchStatus } = trpc.auth.getBoards.useQuery(
    undefined,
    {
      enabled: session.data?.user !== undefined,
    }
  );

  const [state, dispatch] = useReducer(
    reducer,
    boards
      ? { boards, activeBoardId: boards[0]?.id as number }
      : {
          boards: [
            { name: "Untitled Board", id: -1, tasks: [], columnsList: [] },
          ],
          activeBoardId: -1,
        }
  );

  useEffect(() => {
    if (fetchStatus === "success")
      if (boards.length > 0) {
        dispatch({
          type: "POPULATE",
          payload: { boards, activeBoardId: boards[0]?.id as number },
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStatus]);
  if (fetchStatus === "loading") return <div className="">Loading</div>;

  const changeBoard = (newBoardId: number) => {
    dispatch({ type: "CHANGE_BOARD", payload: newBoardId });
  };
  const getNumberOfBoards = () =>
    state.boards.map((board) => {
      return { name: board.name, id: board.id };
    }).length;
  const activeBoard = state.boards.find(
    (board) => board.id === state.activeBoardId
  ) as BoardType;
  return (
    <AppStateContext.Provider
      value={{
        changeBoard,
        activeBoard,
        boardsList: state.boards.map((board) => {
          return { name: board.name, id: board.id };
        }),
        dispatch,
        getNumberOfBoards,
        getActiveBoardName: () => activeBoard?.name as string,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
