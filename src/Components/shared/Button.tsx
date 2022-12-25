import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const Button = ({ cType, className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={`rounded-full   ${
        getcTypeStyles(cType) + (className ? className : "")
      }
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

type ButtonProps = {
  cType: "primaryL" | "primaryS" | "secondary" | "destructive" | "ghost";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

function getcTypeStyles(
  cType: "primaryL" | "primaryS" | "secondary" | "destructive" | "ghost"
): string {
  switch (cType) {
    case "primaryL":
      return "bg-purple p-4 text-hm text-white hover:bg-purpleHover ";
    case "primaryS":
      return "bg-purple p-2 text-hl text-[0.8125rem] text-white hover:bg-purpleHover ";
    case "secondary":
      return "bg-[#F2F2F6] p-2 text-hl text-[0.8125rem] text-purple hover:bg-[#D8D7F1] ";
    case "destructive":
      return "bg-red p-2 text-hl text-[0.8125rem] text-white hover:bg-redHover ";
    case "ghost":
      return "bg-purple p-4 text-hm text-mediumGrey bg-opacity-0 hover:bg-opacity-10 hover:text-purple dark:hover:bg-white ";
  }
}
