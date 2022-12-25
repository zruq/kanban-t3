import type { Dispatch } from "react";
import type { Action } from "../../state/action";

type CheckboxProps = {
  title: string;
  isCompleted: boolean;
  dispatch: Dispatch<Action>;
};

const Checkbox = ({ dispatch, title, isCompleted }: CheckboxProps) => {
  return (
    <div
      onClick={() =>
        dispatch({
          type: "TOGGLE_SUBTASK",
          payload: { columnindex: 0, index: 1, taskindex: 0 },
        })
      }
      className="tablet:w-[26rem] flex w-[18.43rem] cursor-pointer rounded-[4px] bg-lightGrey p-3 hover:bg-purple hover:bg-opacity-25 dark:bg-veryDarkGrey dark:hover:bg-purple dark:hover:bg-opacity-25"
    >
      <Box isCompleted={isCompleted} />
      <div
        className={`cursor-text px-4 text-hs tracking-normal text-black dark:text-white ${
          isCompleted ? "text-opacity-50 line-through dark:text-opacity-50" : ""
        } `}
      >
        {title}
      </div>
    </div>
  );
};

export default Checkbox;

const Box = ({ isCompleted }: { isCompleted: boolean }) => {
  return (
    <div
      className={` flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border border-[#828FA3] border-opacity-25 pt-[0.1rem] ${
        !isCompleted ? "bg-white dark:bg-darkGrey" : "bg-purple"
      }`}
    >
      <svg
        className={`h-2 w-[0.7rem] ${isCompleted ? "" : "hidden"} `}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="#FFF"
          strokeWidth="2"
          fill="none"
          d="m1.276 3.066 2.756 2.756 5-5"
        />
      </svg>
    </div>
  );
};