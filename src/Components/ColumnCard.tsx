import TaskCard from "./TaskCard";

type ColumnCardProps = {
  Task: {
    numberOfTotalSubtasks: number;
    numberOfCompletedSubtasks: number;
    id: number;
    title: string;
  }[];
  name: string;
};

const ColumnCard = (column: ColumnCardProps) => {
  return (
    <div className="">
      <div className="flex items-center justify-start pb-6">
        <div className=" mr-3 h-[15px] w-[15px] rounded-full bg-[#49C4E5]"></div>
        <h2 className=" text-hs uppercase text-mediumGrey">
          {column.name} ({column.Task.length})
        </h2>
      </div>
      {column.Task.map((task) => (
        <TaskCard
          key={task.id}
          numberOfCompletedSubtasks={task.numberOfCompletedSubtasks}
          numberOfTotalSubtasks={task.numberOfTotalSubtasks}
          title={task.title}
          className="mb-5"
        />
      ))}
    </div>
  );
};

export default ColumnCard;
