import './App.css'
import TheForm from './components/Shared/form/TheForm';
import { validate } from './components/Shared/form/validation';
import { useTheme } from './utils/hooks/themeHook'
import { BsSunFill, BsFillMoonFill } from "react-icons/bs";;
import { TheIcon } from './components/Shared/TheIcon';

function App() {
const { colorTheme, setTheme } = useTheme();
const mode = colorTheme === "light" ? BsSunFill : BsFillMoonFill;
const toggle = () => {
  setTheme(colorTheme);
};
const input = { name: "", age: 0, height: 0, hobbies: "" };
 return (
   <div
     className="w-full h-screen text-7xl font-bold flex-col-center 
   dark:bg-black dark:text-white"
   >
     <div className="w-fit p-1  flex-center">
       <TheIcon Icon={mode} size={"25"} color={""} iconAction={toggle} />
     </div>
     <TheForm
       header="FORM"
       validate={validate}
       input={input}
     />
   </div>
 );
}

export default App
