import type { DetailedHTMLProps, HTMLAttributes } from "react";

const Card = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={
        "my-auto h-fit w-[21.43rem] rounded-md bg-white p-8 dark:bg-darkGrey tablet:w-[30rem] " +
        className
      }
    >
      {children}
    </div>
  );
};

export default Card;
