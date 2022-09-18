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



