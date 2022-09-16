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
import { useQueryClient } from "react-query";

type AppProps = {
  // queryClient:QueryClient
};

function App({ }: AppProps) {

  const queryClient = useQueryClient();
  const { colorTheme, setTheme } = useTheme();

  const userQuery = useQuery(["user"], getAdmin);

  const peepsQuery = useQuery(["peeps"], allPeeps);

  // if(peepsQuery.data)
  // console.log("query == ",peepsQuery.data);

  const mode = colorTheme === "light" ? BsSunFill : BsFillMoonFill;
  const toggle = () => {
    setTheme(colorTheme);
  };

  const input = { name: "boni", age: 10, bio: "slutember" };
  const createPeep = async (data: any) => {
    return await client.records.create("peeps", data);
  };
  console.log("query client data ",peepsQuery.data);
  realTime(['peeps'],queryClient).catch((e)=>{console.log(e)})
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
          input={input}
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
