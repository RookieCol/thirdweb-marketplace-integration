import { defineChain } from "thirdweb/chains";

const rpc = process.env.TESTNET_RPC

  if(!rpc){
    throw new Error("RPC was not found");
    
  }

const rootstockTestnet = defineChain({
  id: 31,
  rpc: rpc, 
  nativeCurrency: {
    name: "rBTC",
    symbol: "rBTC",  
    decimals: 18,
  },
});

export default rootstockTestnet;
