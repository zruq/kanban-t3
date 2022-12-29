import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Button from "./shared/Button";
import Card from "./shared/Card";
import { trpc } from "../utils/trpc";
import { AppStateContext } from "../state/appStateContext";

type NewBoardProps = {
  board?: {
    name: string;
    id?: number;
    columns: { name: string; id?: number }[];
  };
  setShowModal:
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<number | boolean>>;
};

const NewBoard = ({ board, setShowModal }: NewBoardProps) => {
  const [boardState, setBoardState] = useState(
    board
      ? board
      : {
          name: "",
          id: undefined,
          columns: [
            { name: "Todo", id: undefined },
            { name: "Doing", id: undefined },
          ],
        }
  );

  const { dispatch } = useContext(AppStateContext);
  const mutation = trpc.auth.editBoard.useMutation({
    onSuccess: (data) => {
      dispatch({
        type: "SILENT_EDIT_BOARD",
        payload: { newBoard: data, id: board?.id as number },
      });
    },
  });
  const newBoardMutation = trpc.auth.createBoard.useMutation({
    onSuccess: (data) => {
      dispatch({ type: "ADD_BOARD", payload: data });
      setShowModal(false);
    },
  });
  return (
    <Card
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <form>
        <h2 className="pb-6 text-hl text-black dark:text-white">
          {board ? "Edit Board" : "Add New Board"}
        </h2>
        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          Board Name
          <input
            placeholder="e.g. Web Design"
            className={`textInput`}
            value={boardState.name}
            onChange={(e) =>
              setBoardState({ ...boardState, name: e.target.value })
            }
          />
        </label>

        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          <div className="pb-2 pt-4"> Board Columns</div>
          {boardState.columns.map((column, index) => (
            <div className="flex items-center justify-start pb-3" key={index}>
              <input
                className={`textInput my-0 mr-4 `}
                value={column.name}
                onChange={(e) =>
                  setBoardState({
                    ...boardState,
                    columns: boardState.columns.map((colmny, indexie) => {
                      if (indexie === index)
                        return { ...colmny, name: e.target.value };
                      return colmny;
                    }),
                  })
                }
              />
              <svg
                onClick={() =>
                  setBoardState({
                    ...boardState,
                    columns: boardState.columns.filter(
                      (colmny, indexie) => indexie !== index
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
            setBoardState({
              ...boardState,
              columns: [...boardState.columns, { name: "", id: undefined }],
            });
          }}
        >
          + Add New Column
        </Button>

        <Button
          cType="primaryS"
          className="my-0 w-full"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (board) {
              mutation.mutate({
                boardID: boardState.id as number,
                columns: boardState.columns,
                name: boardState.name,
              });
              dispatch({
                type: "EDIT_BOARD",
                payload: {
                  boardID: boardState.id as number,
                  columns: boardState.columns,
                  name: boardState.name,
                },
              });
              setShowModal(false);
            } else {
              newBoardMutation.mutate({
                name: boardState.name,
                columns: boardState.columns,
              });
            }
          }}
        >
          {board ? "Save Changes" : "Create New Board"}
        </Button>
      </form>
    </Card>
  );
};

export default NewBoard;
