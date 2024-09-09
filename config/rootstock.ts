import { defineChain } from "thirdweb/chains";

const rpc = process.env.TESTNETRPC

  if(!rpc){
    throw new Error("RPC was not found");
    
  }

const rootstockTestnet = defineChain({
  id: 31,
  rpc: rpc, 
  nativeCurrency: {
    name: "Rootstock Testnet Ether",
    symbol: "tETH",  
    decimals: 18,
  },
});

export default rootstockTestnet;
