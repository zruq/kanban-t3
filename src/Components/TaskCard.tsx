type TaskCardProps = {
  title: string;
  numberOfTotalSubtasks: number;
  numberOfCompletedSubtasks: number;
};
const TaskCard = ({
  numberOfCompletedSubtasks,
  numberOfTotalSubtasks,
  title,
}: TaskCardProps) => {
  return (
    <div className="w-[17.5rem] rounded-lg bg-white px-4 py-6 shadow-[0px_4px_6px_rgba(54,_78,_126,_0.101545)] dark:bg-darkGrey">
      <h2 className="pb-2 text-hm text-black dark:text-white">{title}</h2>
      <p className="text-bodym font-bold text-mediumGrey">
        {numberOfCompletedSubtasks} of {numberOfTotalSubtasks} subtasks{" "}
      </p>
    </div>
  );
};

export default TaskCard;
