import { useRef, useState } from "react";

type DropdownProps = {
  columns: string[];
  currentColumn: string;
};

const Dropdown = ({ columns, currentColumn }: DropdownProps) => {
  const [active, setActive] = useState(false);
  const [currCol, setCurrCol] = useState(currentColumn);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  window.addEventListener("click", function (e) {
    // if outside of dropdown
    if (dropdownRef.current)
      if (!dropdownRef.current.contains(e.target as Node)) {
        setActive(false);
      }
  });
  return (
    <>
      <div
        ref={dropdownRef}
        onClick={() => {
          setActive(!active);
        }}
        className={`mb-2 flex h-[40px] w-[350px] cursor-pointer items-center justify-between rounded-[4px] border  ${
          active ? "border-purple" : "border-[#828FA3] border-opacity-25"
        }  py-2 px-4`}
      >
        <div className="text-bodyl text-black dark:text-white">{currCol}</div>
        <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
          <path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" />
        </svg>
      </div>
      <ul
        className={`fixed  z-50 w-[350px] rounded-lg bg-white p-4 dark:bg-veryDarkGrey ${
          active ? "" : "hidden"
        } `}
      >
        {columns.map((col) => (
          <li
            onClick={() => setCurrCol(col)}
            key={col}
            className="mb-2 cursor-pointer text-bodyl capitalize text-mediumGrey hover:text-black dark:hover:text-white"
          >
            {col}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Dropdown;
