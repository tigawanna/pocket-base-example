import './App.css'
import TheForm from './components/Shared/form/TheForm';
import { validate } from './components/Shared/form/validation';
import { useTheme } from './utils/hooks/themeHook'
import { BsSunFill, BsFillMoonFill } from "react-icons/bs";;
import { TheIcon } from './components/Shared/TheIcon';
import { client, getAdmin, allPeeps, appendToCache, getPrevdata, realTime } from './pocket/config';
import { useQuery } from 'react-query';
import { TheRows } from './components/Shared/lists/TheRows';
import { TheButton } from './components/Shared/TheButton';
import { useQueryClient, useMutation } from "react-query";
import { useCreate } from './utils/hooks/useCreate';

type AppProps = {
  // queryClient:QueryClient
};
type MutationVars = {
  data: any;
  index: string;
}
export interface FormOptions {
  field_name: string;
  field_type: string;
  default_value: string | number
  options?: { name: string; value: string }[]
}
function App({ }: AppProps) {

  const queryClient = useQueryClient();
  const { colorTheme, setTheme } = useTheme();

  const userQuery = useQuery(["user"], getAdmin);
  const peepsQuery = useQuery(["peeps"], allPeeps);
  const mutation = useMutation(
    ({ data, index }: MutationVars) => {
      return client.records.create(index, data);
    },
    {

      //throw error if mutation fails
      onError: (err, { data: newData, index }, context) => {
        // queryClient.setQueryData(index, context?.previousData);
        console.log("error saving the item === ", err)
      },
      //update the list with created record  
      onSuccess: (data, { index }) => {
        console.log("vars === ", data, index)
        queryClient.setQueryData(index, (old: any) => {
          old.unshift(data);
          return old;
        });
        console.log("successfull save of item ", data);
      },

    }
  );

  // if(peepsQuery.data)
  // console.log("query == ",peepsQuery.data);

  const mode = colorTheme === "light" ? BsSunFill : BsFillMoonFill;
  const toggle = () => {
    setTheme(colorTheme);
  };
  // const options = [
  //   { name: "Cash deposit", value: "cash_deposit" },
  //   { name: "Cheque", value: "cheque" },
  //   { name: "Mpesa", value: "mpesa" },
  //   { name: "Direct deposit", value: "direct_deposit" }
  // ]
  const options = [
    { name: "C", value: "c" },
    { name: "JS", value: "javascript" },
    { name: "TS", value: "typescript" },
    { name: "C#", value: "java" }
  ]

  const better_input: FormOptions[] = [
    { field_name: "name", field_type: "text", default_value: "leeroy" },
    { field_name: "age", field_type: "number", default_value: 24 },
    { field_name: "bio", field_type: "text", default_value: "mahindi wary" },
    { field_name: "language", field_type: "select", default_value: "pick a language", options }
  ]

  const input = { name: "boni", age: 10, bio: "slutember", language: "C" };
  const createPeep = async (data: any) => {
    mutation.mutate({ data, index: "peeps" })
  };
  // console.log("query client data ",peepsQuery.data);
  // realTime(['peeps'],queryClient).catch((e)=>{console.log(e)})
  return (
    <div
      className="w-full min-h-screen text-7xl font-bold flex-col-center 
   dark:bg-black dark:text-white"
    >
      <div className="w-fit p-1  flex-center">
        <TheIcon Icon={mode} size={"25"} color={""} iconAction={toggle} />
      </div>
      <div className="w-full h-full">
        <TheForm
          header="FORM"
          validate={validate}
          fields={better_input}
          submitFn={createPeep}

        />
      </div>
      <div className="flex-center ">
        <TheButton
          label="list"
          onClick={() => getPrevdata(["peeps"], queryClient)}
          radius="5px"
          border={"1px  solid"}
        />

      </div>

      <div className="w-full h-full">
        <TheRows list={peepsQuery.data} />
      </div>
    </div>
  );
}

export default App
