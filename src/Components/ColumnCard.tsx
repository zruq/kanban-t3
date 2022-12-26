import type {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";
import TaskCard from "./TaskCard";

export type TaskType = {
  SubTask: {
    id: number;
    title: string;
    isCompleted: boolean;
  }[];
  id: number;
  title: string;
  description: string | null;
  statusName: string;
};
type ColumnCardProps = {
  setShowModal: Dispatch<
    SetStateAction<boolean | { id: number; index: number }>
  >;
  index: number;
  tasks: TaskType[];
  name: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ColumnCard = ({
  setShowModal,
  tasks,
  name,
  ...props
}: ColumnCardProps) => {
  // const [showModal, setShowModal] = useState<boolean | number>(false);
  return (
    <>
      <div {...props}>
        <div className="flex items-center justify-start pb-6">
          <div className=" mr-3 h-[15px] w-[15px] rounded-full bg-[#49C4E5]"></div>
          <h2 className=" text-hs uppercase text-mediumGrey">
            {name} ({tasks.length})
          </h2>
        </div>
        {tasks.map((task, index) => (
          <TaskCard
            onClick={() => setShowModal({ id: task.id, index })}
            key={task.id}
            numberOfCompletedSubtasks={
              task.SubTask.filter((subtask) => subtask.isCompleted).length
            }
            numberOfTotalSubtasks={task.SubTask.length}
            title={task.title}
            className="mb-5"
          />
        ))}
      </div>
    </>
  );
};

export default ColumnCard;

//
// col.Task.map((task) => {
//     return {
//       id: task.id,
//       title: task.title,
//       numberOfCompletedSubtasks:
//       numberOfTotalSubtasks: task.SubTask.length,
//     };
//   })
