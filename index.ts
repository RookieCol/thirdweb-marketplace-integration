import {
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
  sendTransaction,
} from 'thirdweb';
import { thirdwebClient } from './config/client';
import { privateKeyToAccount } from 'thirdweb/wallets';
import {  displayTable } from './utils';
import { CUSTOM_COLOR, GREEN_COLOR, RESET_COLOR } from './utils/constants';


const marketplaceContract = getContract({
  client: thirdwebClient,
  chain: defineChain(31),
  address: '0x3830e3b28e6927658fFF2F34c12BF91f4Ca16103',
});


async function getActiveListings() {
  const totalListings = await readContract({
    contract: marketplaceContract,
    method: 'function totalListings() view returns (uint256)',
    params: [],
  });
  console.log(
    `${GREEN_COLOR}Total listings: ${totalListings.toString()}${RESET_COLOR}`,
  );
  const data = await readContract({
    contract: marketplaceContract,
    method:
      'function getAllValidListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _validListings)',
    params: [0n, totalListings - 1n],
  });
  console.log(
    `${GREEN_COLOR}Number of valid listings: ${data.length}${RESET_COLOR}`,
  );
  displayTable(Array.from(data));
}
async function createDirectListing() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Private Key not found');
  }

  const publisherAccount = privateKeyToAccount({
    client: thirdwebClient,
    privateKey: privateKey,
  });

  const collectionContract = getContract({
    client: thirdwebClient,
    chain: defineChain(31),
    address: '0x86F424CE44D790513b9F6A4Cfc441007102871F1',
  });
  const collectionApproval = prepareContractCall({
    contract: collectionContract,
    method: 'function setApprovalForAll(address operator, bool approved)',
    params: [marketplaceContract.address, true], // market place contract approved to administrate the owner's tokens
  });
  const { transactionHash } = await sendTransaction({
    transaction: collectionApproval,
    account: publisherAccount,
  });
  console.log(`${GREEN_COLOR}Tx: Marketplace approval ${RESET_COLOR}${transactionHash}`);
}
console.log(
  `${CUSTOM_COLOR}---------------------------------------------------------------------------------------------MarketPlace Flow------------------------------------------------------------------------------${RESET_COLOR}`,
);

getActiveListings();
//createDirectListing();
