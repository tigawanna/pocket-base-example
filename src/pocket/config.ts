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
 queryClient.setQueryData(index, (old:any) => {
  old.unshift(newData)
  return old
 });
}

export const getPrevdata =(index:[string],queryClient:QueryClient)=>{
const previous = queryClient.getQueryData(index);
console.log("previous items", previous);
}






