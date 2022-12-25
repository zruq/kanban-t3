// import {ReactComponent as Checkmark} from '../../assets/icon-check.svg'
type CheckboxProps = {
  title: string;
  isCompleted: boolean;
};

const Checkbox = ({ title, isCompleted }: CheckboxProps) => {
  return (
    <div className="tablet:w-[26rem] flex w-[18.43rem] rounded-[4px] bg-lightGrey p-3 hover:bg-purple hover:bg-opacity-25 dark:bg-veryDarkGrey">
      <Box isCompleted={isCompleted} />
      <div className="px-4 text-hs tracking-normal text-black dark:text-white ">
        {title}
      </div>
    </div>
  );
};

export default Checkbox;

const Box = ({ isCompleted }: { isCompleted: boolean }) => {
  return (
    <div
      className={`h-4 w-4 cursor-pointer rounded-sm border border-[#828FA3] border-opacity-25 ${
        !isCompleted ? "bg-white dark:bg-darkGrey" : "bg-purple"
      }`}
    ></div>
  );
};
