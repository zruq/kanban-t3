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
    columns: { name: string; id?: number; fakeid?: number }[];
  };
  setShowModal:
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<number | boolean>>;
};

const NewBoard = ({ board, setShowModal }: NewBoardProps) => {
  const { boardsList } = useContext(AppStateContext);
  const [boardState, setBoardState] = useState(
    board
      ? {
          name: { content: board.name, error: "" },
          id: board.id,
          columns: board.columns.map((col) => {
            return {
              name: col.name,
              id: col.id,
              error: "",
              fakeid: col.fakeid,
            };
          }),
        }
      : {
          name: { content: "", error: "" },
          id: undefined,
          columns: [
            { name: "Todo", id: undefined, fakeid: -1, error: "" },
            { name: "Doing", id: undefined, fakeid: -2, error: "" },
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
        <label className=" text-hs tracking-normal text-mediumGrey dark:text-white">
          Board Name
          <div className="relative">
            <input
              onBlur={(e) => {
                if (!e.target.value) {
                  setBoardState({
                    ...boardState,
                    name: {
                      content: boardState.name.content,
                      error: "Can't be empty",
                    },
                  });
                }
              }}
              placeholder="e.g. Web Design"
              className={`textInput ${
                boardState.name.error ? "border-red" : ""
              } `}
              value={boardState.name.content}
              onChange={(e) => {
                setBoardState({
                  ...boardState,
                  name: {
                    content: e.target.value,
                    error: e.target.value ? "" : "Can’t be empty",
                  },
                });
              }}
            />
            {boardState.name.error && (
              <div className="absolute right-0 top-0 bottom-0 my-auto mr-4 h-fit rounded-l-3xl bg-white pl-4 text-bodyl text-red dark:bg-darkGrey">
                {boardState.name.error}
              </div>
            )}
          </div>
        </label>

        <label className="text-hs tracking-normal text-mediumGrey dark:text-white">
          <div className="pb-2 pt-4"> Board Columns</div>
          {boardState.columns.map((column) => (
            <div
              className="flex items-center justify-start pb-3"
              key={column.id || column.fakeid}
            >
              <div className="relative mr-4 w-full ">
                <input
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setBoardState((boardState) => {
                        return {
                          ...boardState,
                          columns: boardState.columns.map((col) => {
                            if (
                              col.id
                                ? col.id === column.id
                                : col.fakeid === column.fakeid
                            )
                              return { ...col, error: "Can’t be empty" };
                            return col;
                          }),
                        };
                      });
                    }
                  }}
                  className={`textInput my-0 
                  
                  ${column.error ? "border-red" : ""}`}
                  value={column.name}
                  onChange={(e) => {
                    setBoardState({
                      ...boardState,
                      columns: boardState.columns.map((colmny) => {
                        if (
                          column.id
                            ? colmny.id === column.id
                            : colmny.fakeid === column.fakeid
                        )
                          return {
                            ...colmny,
                            name: e.target.value,
                            error: e.target.value ? "" : "Can’t be empty",
                          };
                        return colmny;
                      }),
                    });
                  }}
                />
                {column.error && (
                  <div className="absolute right-0 top-0 bottom-0 my-auto mr-4 h-fit rounded-l-3xl bg-white pl-4 text-bodyl text-red dark:bg-darkGrey">
                    {column.error}
                  </div>
                )}
              </div>
              <svg
                onClick={() =>
                  setBoardState({
                    ...boardState,
                    columns: boardState.columns.filter((colmny) =>
                      column.id
                        ? colmny.id !== column.id
                        : colmny.fakeid !== column.fakeid
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
            setBoardState({
              ...boardState,
              columns: [
                ...boardState.columns,
                {
                  name: "",
                  fakeid: new Date().getTime(),
                  id: undefined,
                  error: "",
                },
              ],
            });
          }}
        >
          + Add New Column
        </Button>

        <Button
          disabled={
            !!boardState.name.error ||
            !!boardState.columns.find((col) => col.error)?.error ||
            newBoardMutation.isLoading
          }
          cType="primaryS"
          className="my-0 w-full disabled:cursor-not-allowed disabled:opacity-25"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            let theresAnError = false;

            if (!boardState.name.content) {
              setBoardState((boardState) => {
                return {
                  ...boardState,
                  name: { content: "", error: "Can’t be empty" },
                };
              });
              theresAnError = true;
            }
            if (
              boardsList.filter(
                (board) =>
                  board.name.trim().toLowerCase() ===
                    boardState.name.content.trim().toLowerCase() &&
                  board.id !== boardState.id
              ).length >= 1
            ) {
              setBoardState((boardState) => {
                return {
                  ...boardState,
                  name: {
                    content: boardState.name.content,
                    error: "Must be unique",
                  },
                };
              });
              theresAnError = true;
            }
            const uniqueColNames: string[] = [];
            const columns = boardState.columns.map((col) => {
              if (!col.name) {
                theresAnError = true;
                return { ...col, error: "Can’t be empty" };
              }
              if (
                uniqueColNames.find(
                  (name) => name.toLowerCase() === col.name.trim().toLowerCase()
                )
              ) {
                theresAnError = true;
                return { ...col, error: "Must be unique" };
              } else {
                uniqueColNames.push(col.name.trim().toLowerCase());
              }
              return col;
            });
            setBoardState((boardState) => {
              return { ...boardState, columns: columns };
            });
            if (theresAnError) return;
            //
            if (board) {
              mutation.mutate({
                boardID: boardState.id as number,
                columns: boardState.columns,
                name: boardState.name.content,
              });
              dispatch({
                type: "EDIT_BOARD",
                payload: {
                  boardID: boardState.id as number,
                  columns: boardState.columns,
                  name: boardState.name.content,
                },
              });
              setShowModal(false);
            } else {
              newBoardMutation.mutate({
                name: boardState.name.content,
                columns: boardState.columns,
              });
            }
          }}
        >
          {board ? (
            "Save Changes"
          ) : newBoardMutation.isLoading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2  inline-block h-4 w-4  animate-spin rounded-full border-l border-linesLight"></div>{" "}
              <div className="inline-block"> Creating New Board</div>
            </div>
          ) : (
            "Create New Board"
          )}
        </Button>
        {newBoardMutation.isError && (
          <div className="text-center text-bodyl text-red ">
            Something wrong happened, please try again.
          </div>
        )}
      </form>
    </Card>
  );
};

export default NewBoard;
