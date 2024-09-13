import {
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
  sendTransaction,
  type Address,
  type AddressInput,
} from 'thirdweb';
import { thirdwebClient } from './config/client';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { displayTable } from './utils';
import {
  CUSTOM_COLOR,
  GREEN_COLOR,
  RESET_COLOR,
  NATIVE_TOKEN,
  BLUE_COLOR, // Import BLUE_COLOR from your constants
} from './utils/constants';
import {
  // createListing,
  cancelListing as cancelListingExtension,
  buyFromListing,
  createListing,
} from 'thirdweb/extensions/marketplace';
import { isApprovedForAll } from 'thirdweb/extensions/erc1155';

// Marketplace contract configuration
const chainId = 31; // Replace with the correct chain ID if necessary

const marketplaceAddress: Address =
  '0x3830e3b28e6927658fFF2F34c12BF91f4Ca16103'; // Marketplace contract address
const collectionAddress: Address =
  '0x86F424CE44D790513b9F6A4Cfc441007102871F1'; // Collection contract address

// Initialize the marketplace contract
const marketplaceContract = getContract({
  client: thirdwebClient,
  chain: defineChain(chainId),
  address: marketplaceAddress,
});

// Initialize the collection contract
const collectionContract = getContract({
  client: thirdwebClient,
  chain: defineChain(chainId),
  address: collectionAddress,
});

// Retrieve the private key from environment variables
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error('Private Key not found');
}

// Create an account object for the publisher using the private key
const publisherAccount = privateKeyToAccount({
  client: thirdwebClient,
  privateKey: privateKey,
});

// Function to fetch and display active listings
async function getActiveListings(
  startId: bigint = 0n,
  endId?: bigint,
): Promise<void> {
  try {
    // Fetch the total number of listings from the marketplace contract
    const totalListings: bigint = await readContract({
      contract: marketplaceContract,
      method: 'function totalListings() view returns (uint256)',
      params: [],
    });

    console.log(
      `${GREEN_COLOR}Total listings: ${totalListings.toString()}${RESET_COLOR}`,
    );

    // If endId is not provided, set it to totalListings - 1
    if (endId === undefined) {
      endId = totalListings > 0n ? totalListings - 1n : 0n;
    }

    // Fetch all valid listings within the specified range
    const data = await readContract({
      contract: marketplaceContract,
      method:
        'function getAllValidListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _validListings)',
      params: [startId, endId],
    });

    console.log(
      `${GREEN_COLOR}Number of valid listings: ${data.length}${RESET_COLOR}`,
    );

    // Display the listings in a formatted table
    displayTable(Array.from(data));
  } catch (error) {
    console.error('Error fetching active listings:', error);
  }
}

// Commented out the existing createDirectListing function for future reference
/*
interface ListingParams {
  assetContract: Address;
  tokenId: bigint;
  quantity?: bigint;
  currency?: Address;
  pricePerToken: bigint;
  startTimestamp?: bigint;
  endTimestamp?: bigint;
  reserved?: boolean;
}

async function createDirectListing(params: ListingParams): Promise<void> {
  try {
    // Set default values for optional parameters
    const {
      assetContract,
      tokenId,
      quantity = 1n,
      currency = NATIVE_TOKEN,
      pricePerToken,
      startTimestamp = BigInt(Math.floor(Date.now() / 1000)),
      endTimestamp = startTimestamp + 86400n, // Default to 24 hours from startTimestamp
      reserved = false,
    } = params;

    // Approve the marketplace contract to handle the assets
    const collectionApproval = prepareContractCall({
      contract: collectionContract,
      method: 'function setApprovalForAll(address operator, bool approved)',
      params: [marketplaceAddress, true], // Use marketplaceAddress directly
    });

    const { transactionHash: approvalTxHash } = await sendTransaction({
      transaction: collectionApproval,
      account: publisherAccount,
    });

    console.log(
      `${GREEN_COLOR}Tx: Marketplace approval ${RESET_COLOR}${approvalTxHash}`,
    );

    // Prepare listing parameters
    const _params = {
      assetContract,
      tokenId,
      quantity,
      currency,
      pricePerToken,
      startTimestamp,
      endTimestamp,
      reserved,
    };

    // Create the listing on the marketplace
    const createListingTransaction = prepareContractCall({
      contract: marketplaceContract,
      method:
        'function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)',
      params: [_params],
    });

    const { transactionHash: listingTxHash } = await sendTransaction({
      transaction: createListingTransaction,
      account: publisherAccount,
    });

    console.log(
      `${GREEN_COLOR}Tx: Listing created ${RESET_COLOR}${listingTxHash}`,
    );
  } catch (error) {
    console.error('Error creating direct listing:', error);
  }
}
*/

// Function to cancel a listing by its ID
async function cancelListing(listingId: bigint): Promise<void> {
  try {
    // Prepare the transaction to cancel the listing
    const transaction = cancelListingExtension({
      contract: marketplaceContract,
      listingId: listingId,
    });

    // Send the transaction
    const tx = await sendTransaction({
      account: publisherAccount,
      transaction: transaction,
    });

    console.log(
      `${GREEN_COLOR}Tx: Listing canceled ${RESET_COLOR}${tx.transactionHash} ${BLUE_COLOR}https://rootstock-testnet.blockscout.com/tx/${tx.transactionHash}${RESET_COLOR}`,
    );
  } catch (error) {
    console.error('Error canceling listing:', error);
  }
}

// Function to buy from a listing with parameters passed as an object
async function buyFromListingFunction(params: {
  listingId: bigint;
  quantity: bigint;
  recipient: Address;
}): Promise<void> {
  try {
    // Prepare the transaction to buy from the listing
    const transaction = buyFromListing({
      contract: marketplaceContract,
      listingId: params.listingId,
      quantity: params.quantity,
      recipient: params.recipient,
    });

    // Send the transaction to execute the purchase
    const tx = await sendTransaction({
      transaction,
      account: publisherAccount,
    });

    console.log(
      `${GREEN_COLOR}Tx: Bought from listing ${RESET_COLOR}${tx.transactionHash} ${BLUE_COLOR}https://rootstock-testnet.blockscout.com/tx/${tx.transactionHash}${RESET_COLOR}`,
    );
  } catch (error) {
    console.error('Error buying from listing:', error);
  }
}

// Main execution flow
async function main() {
  console.log(
    `${CUSTOM_COLOR}----------------------------------------- Marketplace Thirdweb By Rookie -------------------------------------------${RESET_COLOR}`,
  );

  // Get all active listings (you can specify startId and endId if needed)
  await getActiveListings();

  // Commented out the code for creating a direct listing
  /*
  await createDirectListing({
    assetContract: collectionAddress, // Now using collectionAddress directly
    tokenId: 7n,
    pricePerToken: 10000000000000n,
    // Optional parameters can be set here
    quantity: 1n,
    startTimestamp: BigInt(Math.floor(Date.now() / 1000)),
    endTimestamp: BigInt(Math.floor(Date.now() / 1000)) + 86400n,
    reserved: false,
  });
  */

  // Commented out the approval and create listing steps
  
  /* const collectionApproval = prepareContractCall({
    contract: collectionContract,
    method: 'function setApprovalForAll(address operator, bool approved)',
    params: [marketplaceAddress, true], // Use marketplaceAddress directly
  });

  const { transactionHash: approvalTxHash } = await sendTransaction({
    transaction: collectionApproval,
    account: publisherAccount,
  });

  console.log(
    `${GREEN_COLOR}Tx: Marketplace approval ${RESET_COLOR}${approvalTxHash} ${BLUE_COLOR}https://rootstock-testnet.blockscout.com/tx/${approvalTxHash}${RESET_COLOR}`,
  );

  const transaction = createListing({
    contract: marketplaceContract,
    assetContractAddress: collectionAddress, // The NFT contract address that you want to sell
    tokenId: 2n, // The token ID you want to sell
    pricePerToken: '0.1', // Sell for 0.1 native token
  });

  const tx = await sendTransaction({
    transaction,
    account: publisherAccount,
  });

  console.log(
    `${GREEN_COLOR} Publisher address ${RESET_COLOR}${publisherAccount.address}`,
  );

  const approved = await isApprovedForAll({
    contract: collectionContract,
    owner: publisherAccount.address,
    operator: marketplaceContract.address,
  });

  console.log(`${GREEN_COLOR}Approved: ${RESET_COLOR}${approved}`);

  console.log(
    `${GREEN_COLOR}Tx: Listing created ${RESET_COLOR}${tx.transactionHash} ${BLUE_COLOR}https://rootstock-testnet.blockscout.com/tx/${tx.transactionHash}${RESET_COLOR}`,
  ); */
 

  /*
  await buyFromListingFunction({
    listingId: 2n,
    quantity: 1n,
    recipient: '0x0Dab77595cb372100fcCe62FA0d57e0a64A182E7',
  });
  */

  
  /*
  await cancelListing(7n);
  */
}

// Execute the main function
main().catch((error) => {
  console.error('An error occurred:', error);
});
