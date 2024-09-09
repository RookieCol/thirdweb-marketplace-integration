import { createThirdwebClient } from "thirdweb";
 
const thirdwebClientId = process.env.THIRDWEB_CLIENT_ID;

if(!thirdwebClientId){
throw new Error('Thirdweb client not found')
}

export const thirdwebClient = createThirdwebClient({ clientId: thirdwebClientId});




