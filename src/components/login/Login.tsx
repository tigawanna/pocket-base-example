import React from 'react'
import { TheButton } from '../Shared/TheButton';
import { client, providers } from './../../pocket/config';


interface LoginProps {

}

export const Login: React.FC<LoginProps> = ({}) => {
let provs = providers.authProviders
    let redirectUrl = 'http://localhost:3000/redirect'
//  const [provis,setProvis]=React.useState(async()=>{
//      return await listSignInMethods()
//  })

const loginWithGoogge=async()=>{
const authData = await client.users.authViaOAuth2('google', 'CODE', 'VERIFIER', 'REDIRECT_URL');
console.log("authentication data === ",authData)
}

console.log("is valid from auth store", client.authStore.isValid)
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
