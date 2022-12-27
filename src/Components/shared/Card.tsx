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
        "my-auto h-fit w-[30rem] rounded-md bg-white p-8 dark:bg-darkGrey " +
        className
      }
    >
      {children}
    </div>
  );
};

export default Card;
