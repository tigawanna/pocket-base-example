import './App.css'
import { useTheme } from './utils/hooks/themeHook'
import { BsSunFill, BsFillMoonFill } from "react-icons/bs";;
import { TheIcon } from './components/Shared/TheIcon';

import { Query, useQuery } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/home/Home';
import { Redirect } from './components/login/Redirect';
import { Login } from './components/login/Login';
import { useEffect, useInsertionEffect } from 'react';
import { client } from './pocket/config';
import { ProtectedRoute } from './components/login/PrivateRoutes';
import { UserType } from './components/login/types';


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
  const { colorTheme, setTheme } = useTheme();
 const mode = colorTheme === "light" ? BsSunFill : BsFillMoonFill;
  const toggle = () => {
    setTheme(colorTheme);
  };

  const getUser = async()=>{
    return client.authStore.model
  }




  const userQuery = useQuery(["user"],getUser); 

   console.log("user query ======  ",userQuery)
  

if(userQuery.isLoading){
  return(
    <div className="w-full min-h-screen text-5xl font-bold flex-col-center">
     LOADING....
    </div>
  )
}
  if (userQuery.isError) {
    return (
      <div className="w-full min-h-screen text-5xl font-bold flex-col-center">
        {/* @ts-ignore */}
        {userQuery?.error?.message}
      </div>
    )
  }
const user = userQuery.data as UserType|null|undefined
  return (
    <div
      className="w-full min-h-screen  flex-col-center scroll-bar
   dark:bg-black dark:text-white "
    >

      <BrowserRouter>
        <div className="fixed top-[0px] w-[100%] z-50">
          <div className="w-fit p-1  flex-center">
            <TheIcon Icon={mode} size={"25"} color={""} iconAction={toggle} />
          </div>
        </div>
        <div className="w-full h-[90%] mt-16  ">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}> 
                  <Home user={user} />
                  </ProtectedRoute>
           }
            />
            {/* @ts-ignore */}
            <Route path="/login" element={<Login />} />
            
            <Route path="/redirect" element={<Redirect  user={user}/>} />

          </Routes>
        </div>
      </BrowserRouter>

    </div>
  );
}

export default App


