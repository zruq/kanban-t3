import type { Dispatch, MouseEventHandler, SetStateAction } from "react";
import Button from "./shared/Button";
import Card from "./shared/Card";

const DeleteModal = ({
  type,
  title,
  setShowModal,
  onDelete,
}: DeleteModalProps) => {
  return (
    <Card>
      <div className="text-hl text-red">Delete this {type}?</div>
      <div className="py-6 text-bodyl text-mediumGrey">
        {type === "task"
          ? `Are you sure you want to delete the ‘${title}’ task and its subtasks? This action cannot be reversed.`
          : `Are you sure you want to delete the ‘${title}’ board? This action will remove all columns and tasks and cannot be reversed.`}
      </div>
      <div className="">
        <Button
          cType="destructive"
          className="mb-4 w-full tablet:mr-4 tablet:mb-0 tablet:w-[48%]"
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          cType="secondary"
          className="w-full tablet:w-[48%]"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
};

export default DeleteModal;

type DeleteModalProps = {
  onDelete: MouseEventHandler<HTMLButtonElement>;
  type: "task" | "board";
  title: string;
  setShowModal: Dispatch<SetStateAction<number | boolean>>;
};
