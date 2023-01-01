import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import type { Dispatch } from "react";
import NewTask from "./NewTask";
import Button from "./shared/Button";
import Modal from "./shared/Modal";

import DeleteModal from "./DeleteModal";
import NewBoard from "./NewBoard";
import { trpc } from "../utils/trpc";
import type { Action } from "../state/reducer";

type NavbarProps = {
  boardsList: { id: number; name: string }[];
  showSideBar: boolean;
  boardName: string;
  boardID: number;
  colsList: {
    name: string;
    id: number;
  }[];
  dispatch: Dispatch<Action>;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
};
const Navbar = ({
  setShowSidebar,
  dispatch,
  boardsList,
  boardID,
  showSideBar,
  boardName,
  colsList,
}: NavbarProps) => {
  const [showModal, setShowModal] = useState<boolean | number>(false);
  const [showSettings, setShowSettings] = useState(false);
  const deleteMutation = trpc.auth.deleteBoard.useMutation();
  useEffect(() => {
    if (showSettings) {
      document.body.addEventListener("click", () => setShowSettings(false));
    }
    return () =>
      document.body.removeEventListener("click", () => setShowSettings(false));
  }, [showSettings]);
  return (
    <>
      <div className="flex  h-16 w-full items-center justify-between border-b border-linesLight bg-white p-6 dark:border-linesDark dark:bg-darkGrey tablet:h-[5rem] desktop:h-[6rem]">
        <div
          className={
            showSideBar
              ? "flex items-center justify-center tablet:block"
              : "flex items-center justify-center "
          }
        >
          {!showSideBar && (
            <div className="hidden h-16 items-center border-r border-linesLight pr-8 dark:border-linesDark tablet:flex tablet:h-[5rem] desktop:h-[6rem]">
              <svg
                width="153"
                height="26"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden dark:block"
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M44.56 25v-5.344l1.92-2.112L50.928 25h5.44l-6.304-10.432 6.336-7.04h-5.92l-5.92 6.304V.776h-4.8V25h4.8Zm19.36.384c2.176 0 3.925-.672 5.248-2.016V25h4.48V13.48c0-1.259-.315-2.363-.944-3.312-.63-.95-1.51-1.69-2.64-2.224-1.13-.533-2.432-.8-3.904-.8-1.856 0-3.483.427-4.88 1.28-1.397.853-2.352 2.005-2.864 3.456l3.84 1.824a4.043 4.043 0 0 1 1.424-1.856c.65-.47 1.403-.704 2.256-.704.896 0 1.605.224 2.128.672.523.448.784 1.003.784 1.664v.48l-4.832.768c-2.09.341-3.648.992-4.672 1.952-1.024.96-1.536 2.176-1.536 3.648 0 1.579.55 2.816 1.648 3.712 1.099.896 2.587 1.344 4.464 1.344Zm.96-3.52c-.597 0-1.099-.15-1.504-.448-.405-.299-.608-.715-.608-1.248 0-.576.181-1.019.544-1.328.363-.31.885-.528 1.568-.656l3.968-.704v.544c0 1.067-.363 1.973-1.088 2.72-.725.747-1.685 1.12-2.88 1.12ZM81.968 25V14.792c0-1.003.299-1.808.896-2.416.597-.608 1.365-.912 2.304-.912.939 0 1.707.304 2.304.912.597.608.896 1.413.896 2.416V25h4.8V13.768c0-1.323-.277-2.48-.832-3.472a5.918 5.918 0 0 0-2.32-2.32c-.992-.555-2.15-.832-3.472-.832-1.11 0-2.09.208-2.944.624a4.27 4.27 0 0 0-1.952 1.904V7.528h-4.48V25h4.8Zm24.16.384c1.707 0 3.232-.405 4.576-1.216a8.828 8.828 0 0 0 3.184-3.296c.779-1.387 1.168-2.923 1.168-4.608 0-1.707-.395-3.248-1.184-4.624a8.988 8.988 0 0 0-3.2-3.28c-1.344-.81-2.848-1.216-4.512-1.216-2.112 0-3.787.619-5.024 1.856V.776h-4.8V25h4.48v-1.664c.619.661 1.392 1.168 2.32 1.52a8.366 8.366 0 0 0 2.992.528Zm-.576-4.32c-1.301 0-2.363-.443-3.184-1.328-.821-.885-1.232-2.043-1.232-3.472 0-1.408.41-2.56 1.232-3.456.821-.896 1.883-1.344 3.184-1.344 1.323 0 2.41.453 3.264 1.36.853.907 1.28 2.053 1.28 3.44 0 1.408-.427 2.56-1.28 3.456-.853.896-1.941 1.344-3.264 1.344Zm17.728 4.32c2.176 0 3.925-.672 5.248-2.016V25h4.48V13.48c0-1.259-.315-2.363-.944-3.312-.63-.95-1.51-1.69-2.64-2.224-1.13-.533-2.432-.8-3.904-.8-1.856 0-3.483.427-4.88 1.28-1.397.853-2.352 2.005-2.864 3.456l3.84 1.824a4.043 4.043 0 0 1 1.424-1.856c.65-.47 1.403-.704 2.256-.704.896 0 1.605.224 2.128.672.523.448.784 1.003.784 1.664v.48l-4.832.768c-2.09.341-3.648.992-4.672 1.952-1.024.96-1.536 2.176-1.536 3.648 0 1.579.55 2.816 1.648 3.712 1.099.896 2.587 1.344 4.464 1.344Zm.96-3.52c-.597 0-1.099-.15-1.504-.448-.405-.299-.608-.715-.608-1.248 0-.576.181-1.019.544-1.328.363-.31.885-.528 1.568-.656l3.968-.704v.544c0 1.067-.363 1.973-1.088 2.72-.725.747-1.685 1.12-2.88 1.12ZM141.328 25V14.792c0-1.003.299-1.808.896-2.416.597-.608 1.365-.912 2.304-.912.939 0 1.707.304 2.304.912.597.608.896 1.413.896 2.416V25h4.8V13.768c0-1.323-.277-2.48-.832-3.472a5.918 5.918 0 0 0-2.32-2.32c-.992-.555-2.15-.832-3.472-.832-1.11 0-2.09.208-2.944.624a4.27 4.27 0 0 0-1.952 1.904V7.528h-4.48V25h4.8Z"
                    fill="#FFF"
                    fillRule="nonzero"
                  />
                  <g transform="translate(0 1)" fill="#635FC7">
                    <rect width="6" height="25" rx="2" />
                    <rect opacity=".75" x="9" width="6" height="25" rx="2" />
                    <rect opacity=".5" x="18" width="6" height="25" rx="2" />
                  </g>
                </g>
              </svg>
              <svg
                width="153"
                height="26"
                xmlns="http://www.w3.org/2000/svg"
                className="dark:hidden"
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M44.56 25v-5.344l1.92-2.112L50.928 25h5.44l-6.304-10.432 6.336-7.04h-5.92l-5.92 6.304V.776h-4.8V25h4.8Zm19.36.384c2.176 0 3.925-.672 5.248-2.016V25h4.48V13.48c0-1.259-.315-2.363-.944-3.312-.63-.95-1.51-1.69-2.64-2.224-1.13-.533-2.432-.8-3.904-.8-1.856 0-3.483.427-4.88 1.28-1.397.853-2.352 2.005-2.864 3.456l3.84 1.824a4.043 4.043 0 0 1 1.424-1.856c.65-.47 1.403-.704 2.256-.704.896 0 1.605.224 2.128.672.523.448.784 1.003.784 1.664v.48l-4.832.768c-2.09.341-3.648.992-4.672 1.952-1.024.96-1.536 2.176-1.536 3.648 0 1.579.55 2.816 1.648 3.712 1.099.896 2.587 1.344 4.464 1.344Zm.96-3.52c-.597 0-1.099-.15-1.504-.448-.405-.299-.608-.715-.608-1.248 0-.576.181-1.019.544-1.328.363-.31.885-.528 1.568-.656l3.968-.704v.544c0 1.067-.363 1.973-1.088 2.72-.725.747-1.685 1.12-2.88 1.12ZM81.968 25V14.792c0-1.003.299-1.808.896-2.416.597-.608 1.365-.912 2.304-.912.939 0 1.707.304 2.304.912.597.608.896 1.413.896 2.416V25h4.8V13.768c0-1.323-.277-2.48-.832-3.472a5.918 5.918 0 0 0-2.32-2.32c-.992-.555-2.15-.832-3.472-.832-1.11 0-2.09.208-2.944.624a4.27 4.27 0 0 0-1.952 1.904V7.528h-4.48V25h4.8Zm24.16.384c1.707 0 3.232-.405 4.576-1.216a8.828 8.828 0 0 0 3.184-3.296c.779-1.387 1.168-2.923 1.168-4.608 0-1.707-.395-3.248-1.184-4.624a8.988 8.988 0 0 0-3.2-3.28c-1.344-.81-2.848-1.216-4.512-1.216-2.112 0-3.787.619-5.024 1.856V.776h-4.8V25h4.48v-1.664c.619.661 1.392 1.168 2.32 1.52a8.366 8.366 0 0 0 2.992.528Zm-.576-4.32c-1.301 0-2.363-.443-3.184-1.328-.821-.885-1.232-2.043-1.232-3.472 0-1.408.41-2.56 1.232-3.456.821-.896 1.883-1.344 3.184-1.344 1.323 0 2.41.453 3.264 1.36.853.907 1.28 2.053 1.28 3.44 0 1.408-.427 2.56-1.28 3.456-.853.896-1.941 1.344-3.264 1.344Zm17.728 4.32c2.176 0 3.925-.672 5.248-2.016V25h4.48V13.48c0-1.259-.315-2.363-.944-3.312-.63-.95-1.51-1.69-2.64-2.224-1.13-.533-2.432-.8-3.904-.8-1.856 0-3.483.427-4.88 1.28-1.397.853-2.352 2.005-2.864 3.456l3.84 1.824a4.043 4.043 0 0 1 1.424-1.856c.65-.47 1.403-.704 2.256-.704.896 0 1.605.224 2.128.672.523.448.784 1.003.784 1.664v.48l-4.832.768c-2.09.341-3.648.992-4.672 1.952-1.024.96-1.536 2.176-1.536 3.648 0 1.579.55 2.816 1.648 3.712 1.099.896 2.587 1.344 4.464 1.344Zm.96-3.52c-.597 0-1.099-.15-1.504-.448-.405-.299-.608-.715-.608-1.248 0-.576.181-1.019.544-1.328.363-.31.885-.528 1.568-.656l3.968-.704v.544c0 1.067-.363 1.973-1.088 2.72-.725.747-1.685 1.12-2.88 1.12ZM141.328 25V14.792c0-1.003.299-1.808.896-2.416.597-.608 1.365-.912 2.304-.912.939 0 1.707.304 2.304.912.597.608.896 1.413.896 2.416V25h4.8V13.768c0-1.323-.277-2.48-.832-3.472a5.918 5.918 0 0 0-2.32-2.32c-.992-.555-2.15-.832-3.472-.832-1.11 0-2.09.208-2.944.624a4.27 4.27 0 0 0-1.952 1.904V7.528h-4.48V25h4.8Z"
                    fill="#000112"
                    fillRule="nonzero"
                  />
                  <g transform="translate(0 1)" fill="#635FC7">
                    <rect width="6" height="25" rx="2" />
                    <rect opacity=".75" x="9" width="6" height="25" rx="2" />
                    <rect opacity=".5" x="18" width="6" height="25" rx="2" />
                  </g>
                </g>
              </svg>
            </div>
          )}
          <div className="tablet:hidden">
            <svg width="24" height="25" xmlns="http://www.w3.org/2000/svg">
              <g fill="#635FC7" fillRule="evenodd">
                <rect width="6" height="25" rx="2" />
                <rect opacity=".75" x="9" width="6" height="25" rx="2" />
                <rect opacity=".5" x="18" width="6" height="25" rx="2" />
              </g>
            </svg>
          </div>
          <h1
            className={`${
              showSideBar ? "ml-4 tablet:ml-0" : "ml-4 tablet:ml-6 desktop:ml-8"
            } overflow-hidden  whitespace-nowrap text-hl capitalize text-black dark:text-white tablet:text-[1.25rem] tablet:font-bold tablet:leading-[1.575rem] desktop:text-hxl `}
          >
            <span className="... max-w-36 inline-block truncate text-ellipsis tablet:w-44 desktop:w-96">
              {boardName}
            </span>
            {showSideBar ? (
              <svg
                width="10"
                height="7"
                onClick={() => setShowSidebar(!showSideBar)}
                className="ml-2 -mt-3 inline-block cursor-pointer tablet:hidden"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="#635FC7"
                  strokeWidth="2"
                  fill="none"
                  d="M9 6 5 2 1 6"
                />
              </svg>
            ) : (
              <svg
                onClick={() => setShowSidebar(!showSideBar)}
                className="ml-2 -mt-3  inline-block cursor-pointer tablet:hidden"
                width="10"
                height="7"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="#635FC7"
                  strokeWidth="2"
                  fill="none"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            )}
          </h1>
        </div>
        <div className="relative flex items-center justify-evenly">
          <Button
            disabled={colsList.length === 0}
            onClick={() => {
              setShowModal(1);
            }}
            cType="primaryL"
            className="mr-4 hidden py-4 px-6 disabled:cursor-not-allowed disabled:opacity-25  tablet:block tablet:w-[10.25rem]"
          >
            + Add New Task
          </Button>
          <Button
            disabled={colsList.length === 0}
            onClick={() => {
              setShowModal(1);
            }}
            cType="primaryL"
            className="mr-4 block py-3 px-4 disabled:cursor-not-allowed disabled:opacity-25 tablet:hidden"
          >
            <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#FFF"
                d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
              />
            </svg>{" "}
          </Button>
          <svg
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            width="5"
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
            <ul className="absolute right-[1.5%] top-[130%] z-20 min-w-[12rem] cursor-pointer rounded-lg bg-white p-4 text-bodyl  text-mediumGrey dark:bg-veryDarkGrey">
              <li
                className="hover:text-black dark:hover:text-lightGrey"
                onClick={() => {
                  setShowModal(2);
                }}
              >
                Edit Board
              </li>
              <li
                onClick={() => {
                  setShowModal(3);
                }}
                className="pt-4 text-red hover:text-[#BC2727] dark:hover:text-redHover"
              >
                Delete Board
              </li>
            </ul>
          )}
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          {showModal === 1 ? (
            <NewTask
              boardID={boardID}
              setShowModal={setShowModal}
              cols={colsList}
              dispatch={dispatch}
            />
          ) : showModal === 2 ? (
            <NewBoard
              setShowModal={setShowModal}
              board={{ name: boardName, columns: colsList, id: boardID }}
            />
          ) : (
            <DeleteModal
              type="board"
              title={boardName}
              onDelete={() => {
                const createNewBoard = Boolean(boardsList.length === 1);
                deleteMutation.mutate({ id: boardID, createNewBoard });
                dispatch({ type: "DELETE_BOARD", payload: boardID });
              }}
              setShowModal={setShowModal}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default Navbar;
