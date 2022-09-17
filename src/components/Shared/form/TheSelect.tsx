import React from 'react'

interface TheSelectProps {
  handleChange(event: React.ChangeEvent<HTMLSelectElement>): Promise<void>;
  field: string;
  input: { name: string };
  error: {
    name: string;
    message: string;
  };
  type:any
}

export const TheSelect: React.FC<TheSelectProps> = ({
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
const options=[
  {name:"Cash deposit",value:"cash_deposit"},
  {name:"Cheque",value:"cheque"},
  {name:"Mpesa",value:"mpesa"},
  {name:"Direct deposit",value:"direct_deposit"}
]
return (
  <div className="flex-col-center  w-full ">
    <div className="w-full h-full flex sm:flex-row flex-col ">
      {/* select item */}
      <div className="w-[95%] flex flex-col m-1 ">
        <label className="text-sm">{field}</label>
        <select id={field} onChange={handleChange} className="p-2 border-0 text-black">
          <option value={options[0].value}>select one</option>
          {
            options&&options.map((opt)=>{
              return(
                <option value={opt.value}>{opt.name}</option>
              )
            })
          }
        </select>

     </div>
    </div>
    {isError() ? (
      <div className="text-base  text-red-600">{error.message}</div>
    ) : null}
  </div>
);
}
