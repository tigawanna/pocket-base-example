# Starter files for vite with react and tailwindcss

### *clone the repo and do `npm install` and do `npm update` if necesary*


### dependancies 
- **tailwindcss**
- **dayjs for time formating**
- **react-query for server state management**
- **uniqid**
- **react-icons**


### [costom components](src\components\Shared)

### [react-query](src\main.tsx) :
is preconfigured feel free to omit the defaultConfig if you want default behaviour

tailwind is configured with a few custom classes
```css
.flex-center{
  @apply flex justify-center items-center
}
.flex-center-col{
  @apply flex flex-col justify-center items-center
}
.scroll-bar {
  @apply scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-green-500;
}

```


# [pocket base](https://pocketbase.io/)
Open Source backend
for your next SaaS and Mobile app
in 1 file

##  [setup docs](https://pocketbase.io/docs/)

[Download for Linux (11MB zip)](https://github.com/pocketbase/pocketbase/releases/download/v0.7.4/pocketbase_0.7.4_linux_amd64.zip)<br>
[Download for Windows (11MB zip)](https://github.com/pocketbase/pocketbase/releases/download/v0.7.4/pocketbase_0.7.4_windows_amd64.zip)<br>
[Download for macOS x64 (11MB zip)](https://github.com/pocketbase/pocketbase/releases/download/v0.7.4/pocketbase_0.7.4_darwin_amd64.zip)<br>
[Download for macOS ARM64 (11MB zip)](https://github.com/pocketbase/pocketbase/releases/download/v0.7.4/pocketbase_0.7.4_darwin_arm64.zip)<br>

download a the zipped foledr, exctract it's contents and you'll have a binary execute it in the command line

```sh
./pocketbase serve.
```
 in powershell it would look something like this

 ```sh
  .\pocketbase.exe serve
 ```

to  serve it on your LAN
on windows run 
```sh
ipconfig
```
and something lke this in linux 
> this doesn't work on mac or wsl, but there a lot of other ways 
```sh
hostname -I
```

```sh
 .\pocketbase.exe serve 192.168.20.87
```

onceit's up and running ctrl + click on one of the urls in the terminal

```sh
Server started at: http://127.0.0.1:8090
  - REST API: http://127.0.0.1:8090/api/
  - Admin UI: http://127.0.0.1:8090/_/
```

next we deal with the front-edn by using the provided [javascript sdk](https://github.com/pocketbase/js-sdk)

```sh
npm install pocketbase
```
then create a config.ts file (optional, you can put all the logic in a component)

```ts
import PocketBase, { Record } from 'pocketbase';
import { QueryClient } from "react-query";


export interface PeepResponse {
  id: string;
  created: string;
  updated: string;
  "@collectionId": string;
  "@collectionName": string;
  age: number;
  bio: string;
  name: string;
  "@expand": {};
}

// export const client = new PocketBase("http://192.168.43.238:8090");
export const client = new PocketBase("http://127.0.0.1:8090");
export const realTime = async (
  index: [string],
  queryClient: QueryClient,
 ) => {
  return await client.realtime.subscribe("peeps", function (e) {
    console.log("real time peeps", e.record);
 });
};

export const allPeeps=async():Promise<PeepResponse[]|Record[]>=>{
 return await client.records.getFullList("peeps", 200 /* batch size */, {
   sort: "-created",
 });
}

```

in the above example i created a peeps collection and have a function `allPeeps` that fetches  all records  from it , the client sdk also has a paginated variaint

## query
we can the use this in out cpmponent with react-query

```ts
const peepsQuery = useQuery(["peeps"], allPeeps);
```
 and map over the data array inside the query
 ```ts
 peepQuery.data?.map((item)=>{
  return <TheRows list={peepsQuery.data} />
 })
 ```
 
 ## mutation

 we can add a new peep by using the sdk too

 ```ts
 const mutation = useMutation(
({ data, index }: MutationVars) => {
    return client.records.create(index, data);
},
// react-query options , in order to append new peeps by using the data returned after the mutation instaed of having tun run the query again to update our list of peeps
// the index will be the react-query index and also the sdk client index
{
//print error if mutation fails
        onError: (err, { data: newData, index }, context) => {
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

```
Then we'll use that inside a function that'll be passed to our form's onsubmit prop  

```ts
const createPeep = async (data: any) => {
        mutation.mutate({ data, index: "peeps" })
};
```

## real time listeners
the client sdk has support for real time data from collections
which we'll wrap i our function 
```ts
export const realTime = async (
  index: [string],
  queryClient: QueryClient,
 ) => {
  // sdk realtime listener 
  return await client.realtime.subscribe("peeps", function (e) {
    console.log("real time peeps", e.record);
      appendToCache(index,queryClient,e.record);

  });
};
```
you can use the data directly , but because we already have react-query managing thinf we might as well append any new changes to the te existing `['peeps']` query cache

```ts
export const appendToCache=async(index:[string],queryClient:QueryClient,newData:any)=>{
 queryClient.setQueryData(index, (old:any) => {
  old.unshift(newData)
  return old
 });
}
```
> tip when using react-query `QueryClient()` is that you shoul not do it like this 
```ts
const queryClient = new QueryClient()
``` 
since ths will create a new instance on every component render
instead use the provided hook

```ts
const queryClient = usQueryClient()
```
which returns the curret instance of the `QueryClient`

if the function is in a n external fie pass it in as a prop.
 and now calling this inside the app will update the ui automaitcally when any of the data changes

# authentication 

i skipped straight to Oauth providers since the password one looked pretty straigt forward

in this case i wanted the google auth becauseia already ad configured a service account from [Google Ouath 2 project](https://dev.to/tigawanna/my-experience-with-google-apis-and-oauth2-4786)

you'll need a client id and client secrete  [ Google Ouath 2 project](https://dev.to/tigawanna/my-experience-with-google-apis-and-oauth2-4786)

then you'll enable it in the admin dashboard 
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9vib6tdiwwb1b29h5ku8.png)

>tips , when setting up the service account you'll need
allowed javascripy origin and a redirectUrl
you can use `http://localhost:3000` and `http://localhost:3000/redirect` respectively , this is assuming that's where your react app will be running

after that setup the login page 

```ts
import React from 'react'
import { TheButton } from '../Shared/TheButton';
import { client, providers } from './../../pocket/config';


interface LoginProps {

}

export const Login: React.FC<LoginProps> = ({}) => {
let provs = providers.authProviders
    let redirectUrl = 'http://localhost:3000/redirect'

const startLogin = (prov:any)=>{
localStorage.setItem("provider", JSON.stringify(prov));
    const url = provs[0].authUrl + redirectUrl
    if (typeof window !== 'undefined') {
        window.location.href = url;
    }
}




return (
 <div className='w-full h-full flex-col-center'>
        <div className='text-3xl font-bold '>LOGIN</div>
        {
           provs&&provs?.map((item,index)=>{
            return (
                <TheButton
                key={item.name}
                label={item.name}
                border={'1px solid'}
                padding={'2%'}
                textSize={'1.2 rem'}
                onClick={()=>startLogin(item)}
                />
            )
        })
        }
 </div>
);
}

```
and te redirect page as so

```ts
import React from 'react'
import { useSearchParams,useNavigate,Navigate } from 'react-router-dom';
import { client } from './../../pocket/config';
import { useQueryClient } from 'react-query';
import { UserType } from './types';


interface RedirectProps {
user?: UserType | null
}

export const Redirect: React.FC<RedirectProps> = ({ user }) => {
    //@ts-ignore
    const local_prov = JSON.parse(localStorage.getItem('provider'))
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code') as string
    // compare the redirect's state param and the stored provider's one
    const queryClient= useQueryClient()
   let redirectUrl = 'http://localhost:3000/redirect'
    const [loading,setLoading]= React.useState(true)
   if (local_prov.state !== searchParams.get("state")) {
        let url = 'http://localhost:3000/login'
        if (typeof window !== 'undefined') {
            window.location.href = url;
        }
    } else {
        client.users.authViaOAuth2(
            local_prov.name,
            code,
            local_prov.codeVerifier,
            redirectUrl)
            .then((response) => {
              console.log("authentication data === ", response)
             client.records.update('profiles', response.user.profile?.id as string, {
                    name:response.meta.name,
                    avatarUrl:response.meta.avatarUrl
                }).then((res)=>{
                    console.log(" successfully updated profi;e",res)
                    }).catch((e) => {
                    console.log("error updating profile  == ", e)
                })
                setLoading(false)
                console.log("client modal after logg   == ",client.authStore.model)
                queryClient.setQueryData(['user'], client.authStore.model)
         
            }).catch((e) => {
                console.log("error logging in with provider  == ", e)
            })
    }
    if(user){
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            {
                loading?(
                    <div className='w-full h-full flex-center'>loading .... </div>) : 
                    (
                        <div className='w-full h-full flex-center'>success</div>
                    
                    )}
        </div>
    );
}





```

this also assumes that you're using react-router-dom v6

```ts
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
```

and that's it . 
i plan to port over and app to pocketbase and write about all the quirky things one might run into 
for the complete code 
