import React from 'react'
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { allPeeps, client, getPrevdata } from '../../pocket/config';
import { useTheme } from '../../utils/hooks/themeHook';
import TheForm from '../Shared/form/TheForm';
import { validate } from '../Shared/form/validation';
import { TheRows } from '../Shared/lists/TheRows';
import { TheButton } from '../Shared/TheButton';
 import {useNavigate} from 'react-router-dom'
import { UserType } from './../login/types';

interface HomeProps {
user?:UserType|null
}
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
export const Home: React.FC<HomeProps> = ({user}) => {
const queryClient = useQueryClient();
 const navigate = useNavigate()
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
const logout=()=>{
    client.authStore.clear()
    queryClient.invalidateQueries(['user'])
}

return (
 <div>
        <div className="w-full h-full">
            <div className="w-full p-2 m-3 flex-center flex-">
                <img src={user?.profile.avatarUrl} className="h-[120px] gap-12"/>
                <div className='text-xl font-mono gap-12'>{
                    user?.email
                }</div>
            </div>
            <TheForm
                header="FORM"
                validate={validate}
                fields={better_input}
                submitFn={createPeep}

            />
        </div>
        <div className="flex-center ">
            <TheButton
                label="logout"
                onClick={() => logout()}
                radius="5px"
                textSize='1.3rem'
                margin='10px'
                border={"1px  solid"}
            />
            <TheButton
                label="login"
                onClick={() => navigate('/login')}
                radius="5px"
                textSize='1.3rem'
                margin='10px'
                border={"1px  solid"}
            />
        </div>

        {/* <div className="w-full h-full ">
            <TheRows list={peepsQuery.data} />
        </div> */}
 </div>
);
}
