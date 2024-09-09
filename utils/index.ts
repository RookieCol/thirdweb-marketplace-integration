import { formatUnits } from 'viem';
import { GREEN_COLOR, NATIVE_TOKEN, ORANGE_COLOR, RESET_COLOR, YELLOW_COLOR } from './constants';

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
export function formatRBTC(value: bigint): string {
  return formatUnits(value, 18) + ' RBTC';
}
export function displayTable(data: any[]) {
  console.log(`${GREEN_COLOR}Listed tokens:${RESET_COLOR}`);
  console.table(
    data.map((listing: any) => ({
      'Listing ID': listing.listingId.toString(),
      'Token ID': listing.tokenId.toString(),
      Quantity: listing.quantity.toString(),
      'Price Per Token': formatRBTC(listing.pricePerToken),
      'Start Timestamp': new Date(
        Number(listing.startTimestamp) * 1000,
      ).toLocaleString(),
      'End Timestamp': new Date(
        Number(listing.endTimestamp) * 1000,
      ).toLocaleString(),
      'Listing Creator': shortenAddress(listing.listingCreator),
      'Asset Contract': shortenAddress(listing.assetContract),
      Currency:
        listing.currency === NATIVE_TOKEN
          ? `${ORANGE_COLOR}RBTC${RESET_COLOR}`
          : shortenAddress(listing.currency),
      'Token Type': listing.tokenType,
      Status:
        listing.status === 1
          ? `${GREEN_COLOR}Active${RESET_COLOR}`
          : `${YELLOW_COLOR}Inactive${RESET_COLOR}`,
      Reserved: listing.reserved ? 'Yes' : 'No',
    })),
  );
}
