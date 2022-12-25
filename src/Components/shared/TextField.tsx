const TextField = () => {
  return (
    <label className="text-hs tracking-normal text-mediumGrey">
      Text Field
      <input
        className={` my-2 flex h-[40px] w-[350px] items-center  justify-between rounded-[4px] border border-[#828FA3]  border-opacity-25 py-2
          px-4  text-bodyl text-black placeholder:text-opacity-25`}
        placeholder="Enter task name"
      />
    </label>
  );
};

export default TextField;
