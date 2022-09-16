import PocketBase, { Record } from 'pocketbase';

import { useQuery } from "react-query";
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



export const client = new PocketBase("http://192.168.43.238:8090");



export const getAdmin = async () => {
    return await client.admins.authViaEmail(
      "denniskinuthiaw@gmail.com",
      "SBwptpWeAN9BezV"
    );
};

export const realTime = async (
  index: [string],
  queryClient: QueryClient,
 ) => {
  return await client.realtime.subscribe("peeps", function (e) {
    console.log("real time peeps", e.record);
    appendToCache(index,queryClient,e.record);

    //    queryClient.setQueryData(["peeps", { id: e.record.id }], e.record);
  });
};

export const allPeeps=async():Promise<PeepResponse[]|Record[]>=>{
 return await client.records.getFullList("peeps", 200 /* batch size */, {
   sort: "-created",
 });
}

export const appendToCache=async(index:[string],queryClient:QueryClient,newData:any)=>{
 queryClient.setQueryData(index, (old:any) => [...old,newData]);
}

export const getPrevdata =(index:[string],queryClient:QueryClient)=>{
const previous = queryClient.getQueryData(index);
console.log("previous items", previous);
}



  const appendtoCache=async(queryClient:QueryClient,newobj:any,index:any[])=>{
  
  // console.log("index for the query === ",index)
  // console.log("new data to append=== ",newobj)

  await queryClient.cancelQueries(index);
  // Snapshot the previous value
  const previous = queryClient.getQueryData(index) as any[]

  // Optimistically update to the new value
   if(previous){
    //since this is being called on create and update , if the dpaymentId
  //exists it's spliced out to avoid duplication in cache

    queryClient.setQueryData(index, (oldobj:any) => {
      // console.log("oldobj === ",oldobj)
      let final =  [...oldobj, newobj]
      for(let i = 0; i<oldobj.length; i++){
        if(oldobj[i].paymentId === newobj.paymentId){
     
         oldobj.splice(i,1,newobj)
         final = oldobj
        //  console.log("oldobj after splice=== ",oldobj)  
         break
        }
      }
      
      return(final)
    });
   
  }
}


