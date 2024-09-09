import { defineChain, getContract, readContract } from 'thirdweb';
import { thirdwebClient } from './config/client';
import { formatUnits } from 'viem';

const ORANGE_COLOR = "\x1b[38;5;214m";
const GREEN_COLOR = "\x1b[32m";
const YELLOW_COLOR = "\x1b[33m";
const CUSTOM_COLOR = "\x1b[38;5;199m"; 
const RESET_COLOR = "\x1b[0m"; 

const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const marketplaceContract = getContract({
  client: thirdwebClient,
  chain: defineChain(31),
  address: "0x3830e3b28e6927658fFF2F34c12BF91f4Ca16103",
});
function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
function formatRBTC(value: bigint): string {
  return formatUnits(value, 18) + ' RBTC'; 
}
function displayTable(data: any[]) {
  console.log(`${GREEN_COLOR}Listed tokens:${RESET_COLOR}`);
  console.table(
    data.map((listing: any) => ({
      'Listing ID': listing.listingId.toString(),
      'Token ID': listing.tokenId.toString(),
      'Quantity': listing.quantity.toString(),
      'Price Per Token': formatRBTC(listing.pricePerToken), 
      'Start Timestamp': new Date(Number(listing.startTimestamp) * 1000).toLocaleString(),
      'End Timestamp': new Date(Number(listing.endTimestamp) * 1000).toLocaleString(),
      'Listing Creator': shortenAddress(listing.listingCreator),
      'Asset Contract': shortenAddress(listing.assetContract),
      'Currency': listing.currency === NATIVE_TOKEN
        ? `${ORANGE_COLOR}RBTC${RESET_COLOR}` 
        : shortenAddress(listing.currency), 
      'Token Type': listing.tokenType,
      'Status': listing.status === 1 ? `${GREEN_COLOR}Active${RESET_COLOR}` : `${YELLOW_COLOR}Inactive${RESET_COLOR}`, 
      'Reserved': listing.reserved ? 'Yes' : 'No',
    }))
  );
}
async function getActiveListings() {
  const totallistings = await readContract({
    contract: marketplaceContract,
    method: "function totalListings() view returns (uint256)",
    params: []
  });
  console.log(`${GREEN_COLOR}Total listings: ${totallistings.toString()}${RESET_COLOR}`);
  const data = await readContract({
    contract: marketplaceContract,
    method: "function getAllValidListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _validListings)",
    params: [0n, totallistings - 1n]
  });
  console.log(`${GREEN_COLOR}Number of valid listings: ${data.length}${RESET_COLOR}`);
  displayTable(Array.from(data));
}
console.log(`${CUSTOM_COLOR}---------------------------------------------------------------------------------------------MarketPlace Flow------------------------------------------------------------------------------${RESET_COLOR}`);

getActiveListings();
