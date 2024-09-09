import { createThirdwebClient } from "thirdweb";
 
const thirdwebClientId = process.env.THIRDWEBCLIENT;

if(!thirdwebClientId){
throw new Error('Thirdweb client not found')
}

export const thirdwebClient = createThirdwebClient({ clientId: thirdwebClientId});




