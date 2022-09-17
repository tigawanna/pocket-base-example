import { useMutation, useQueryClient } from "react-query";



export const useCreate=(data:any,index:[string],saveFn:(data:any)=>any)=>{
 const queryClient = useQueryClient()   
 return useMutation((data) => {
  return saveFn(data);
},

{ onMutate: async newData => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(index)

    // Snapshot the previous value
    const previousData = queryClient.getQueryData(index)

    // Optimistically update to the new value
    queryClient.setQueryData(index, (old:any) => [...old, newData])

    // Return a context object with the snapshotted value
    return { previousData }
  },
  // If the mutation fails, use the context returned from onMutate to roll back
  onError: (err, newData, context) => {
      queryClient.setQueryData(index, context?.previousData)
  },
  // Always refetch after error or success:
//   onSettled: () => {
//        queryClient.invalidateQueries(index)
//   },
}
);
}
