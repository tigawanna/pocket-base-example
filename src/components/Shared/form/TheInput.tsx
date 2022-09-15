import React from 'react'

interface TheInputProps {
  handleChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void>;
  field: string;
  input: { name: string };
  error: {
    name: string;
    message: string;
  };
  type:"text"|"number"
}

export const TheInput: React.FC<TheInputProps> = ({
    handleChange,
    error,
    input,
    field,
    type
}) => {


const isError = () => {
  if (error.message != "" && error.name === field) {
    return true;
  }
  return false;
};

return (
  <div className="flex-col-center  w-full ">
    <label className="font-bold text-md capitalize  w-[80%] flex items-start">
      {field}
    </label>
    <input
      style={{ borderColor: isError() ? "red" : "" }}
      className="w-[80%] md:w-[80%] p-2 m-1   border border-black dark:border-white h-10 text-base
       rounded-sm   dark:bg-slate-700"
      id={field}
      type={type}
      placeholder={"enter " + field}
      onChange={handleChange}
      autoComplete={"off"}
      // @ts-ignore
      value={input[field]}
    />
    {isError() ? (
      <div className="text-base  text-red-600">{error.message}</div>
    ) : null}
  </div>
);
}
