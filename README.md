# thirdweb-marketplace

This project aims to facilitate the integration of a marketplace contract using the thirdweb SDK v5 on the Rootstock testnet (chain ID 31). It provides a client-side application to interact with the marketplace contract, allowing you to:

- Get the total number of listings
- Create a new listing
- Purchase an item from a listing
- Cancel an existing listing

## Prerequisites

- **Bun**: This project uses Bun, a fast all-in-one JavaScript runtime. Ensure you have Bun installed (version 1.1.26 or higher).
- **Node.js**: If you prefer using Node.js, you can adapt the scripts accordingly.
- **thirdweb SDK v5**: Make sure you have the latest version installed.
- **Private Key**: You'll need a private key with sufficient permissions and funds on the Rootstock testnet.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-repo/thirdweb-marketplace.git
cd thirdweb-marketplace
bun install
```

## Configuration

### Environment Variables:

1. Create a `.env` file in the root directory.
2. Add your private key to the `.env` file:

```env
TESTNET_RPC=rsk_testnet_rpc
THIRDWEB_CLIENT_ID=thirdweb-client-id 
PRIVATE_KEY=your_private_key_here
```

**Note:** Never commit your `.env` file to version control to keep your private key secure.

### Client Configuration:

- The `thirdwebClient` is configured in `./config/client.ts`.
- Ensure the client is set up to connect to the Rootstock testnet.

### Constants:

- Update `./utils/constants.ts` if necessary, ensuring that color codes and other constants are correctly defined.

## Usage

### Running the Script

To execute the main script:

```bash
bun run index.ts
```

## Features Implemented

### 1. Get Total Listings

The script fetches and displays all active listings from the marketplace. It uses the `getActiveListings` function to:

- Fetch the total number of listings.
- Retrieve all valid listings within a specified range.
- Display the listings in a formatted table.

```typescript
// Fetch and display active listings
await getActiveListings();
```

### 2. Create a New Listing

**Note:** The create listing functionality is currently commented out in the script. You can enable it by uncommenting the relevant sections.

The `createDirectListing` function (commented out) allows you to:

- Approve the marketplace contract to handle your NFTs.
- Create a new listing with specified parameters such as assetContract, tokenId, pricePerToken, etc.

To use this functionality:

1. Uncomment the `createDirectListing` function and its call in the main function.
2. Update the parameters as needed.

```typescript
// Example of creating a new listing (commented out)
// await createDirectListing({
//   assetContract: collectionAddress,
//   tokenId: 7n,
//   pricePerToken: 10000000000000n,
//   quantity: 1n,
//   startTimestamp: BigInt(Math.floor(Date.now() / 1000)),
//   endTimestamp: BigInt(Math.floor(Date.now() / 1000)) + 86400n,
//   reserved: false,
// });
```

### 3. Purchase an Item from a Listing

**Note:** The purchase functionality is currently commented out. You can enable it by uncommenting the relevant sections.

The `buyFromListingFunction` allows you to:

- Purchase an item from an existing listing.
- Specify parameters like listingId, quantity, and recipient.

To use this functionality:

1. Uncomment the `buyFromListingFunction` call in the main function.
2. Update the parameters with the desired listing ID, quantity, and recipient address.

```typescript
// Example of buying from a listing (commented out)
// await buyFromListingFunction({
//   listingId: 2n,
//   quantity: 1n,
//   recipient: '0xRecipientAddress',
// });
```

### 4. Cancel an Existing Listing

**Note:** The cancel listing functionality is also commented out. You can enable it by uncommenting the relevant sections.

The `cancelListing` function allows you to:

- Cancel a listing by its ID.

To use this functionality:

1. Uncomment the `cancelListing` call in the main function.
2. Provide the listing ID you wish to cancel.

```typescript
// Example of canceling a listing (commented out)
// await cancelListing(7n);
```

## Code Structure

### `index.ts`

This is the main script that orchestrates the interaction with the marketplace contract.

- **Imports**: Includes necessary functions and types from thirdweb, as well as utilities and constants.
- **Configuration**: Sets up the marketplace and collection contracts, and retrieves the publisher account.
- **Functions**:
  - `getActiveListings`: Fetches and displays active listings.
  - `createDirectListing`: Creates a new listing (commented out).
  - `buyFromListingFunction`: Purchases an item from a listing (commented out).
  - `cancelListing`: Cancels an existing listing (commented out).
- **Main Execution Flow**: Calls `getActiveListings` to display listings.

### `./config/client.ts`

Contains the configuration for the `thirdwebClient`, specifying the network and other settings.

### `./utils/constants.ts`

Defines constants used throughout the script, such as color codes for console output.

### `./utils/index.ts`

Includes utility functions, such as `displayTable`, to assist with data presentation and formatting.

## Notes

- **Error Handling**: Each function includes error handling to catch and display any issues during execution.
- **Modularity**: The code is modular, allowing you to easily enable or disable features by commenting or uncommenting function calls.
- **Customization**: Update parameters like `listingId`, `tokenId`, and addresses as per your requirements.


- **Additional Features**: Extend functionality to include bidding, offers, and more detailed listing management.
- **UI Integration**: Develop a frontend interface to interact with the marketplace more intuitively.

## Contributing

Contributions are welcome! Please submit issues and pull requests for any improvements or new features.

## License

This project is open-source and available under the MIT License.