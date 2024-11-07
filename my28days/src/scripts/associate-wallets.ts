import { db } from "../lib/data";
import { createFlowAccount } from "../lib/flow";

async function associateWalletsWithExistingUsers() {
  try {
    // Get all users
    const users = db.getUsers();
    
    console.log('Starting Flow wallet association process...\n');

    // Associate wallets with each user
    for (const user of users) {
      try {
        console.log(`Creating Flow testnet wallet for user: ${user.email}`);
        
        // Create new Flow wallet on testnet
        const flowAccount = await createFlowAccount();

        // Update user with wallet details
        db.updateUserWallet(user._id, flowAccount);

        console.log(`Successfully created testnet wallet for user: ${user.email}`);
        console.log(`Wallet address: ${flowAccount.address}`);
        console.log(`Public key: ${flowAccount.publicKey}`);
        console.log('---');
      } catch (error) {
        console.error(`Error creating wallet for user ${user.email}:`, error);
        // Continue with next user even if one fails
        continue;
      }
    }

    // Display final wallet associations
    console.log('\nFinal wallet associations:');
    users.forEach(user => {
      console.log(`User: ${user.email}`);
      if (user.flowWallet) {
        console.log(`Wallet address: ${user.flowWallet.address}`);
        console.log(`Public key: ${user.flowWallet.publicKey}`);
      } else {
        console.log('No wallet associated');
      }
      console.log('---');
    });

    console.log('\nFinished associating Flow testnet wallets');
    process.exit(0);
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
}

// Run the script
associateWalletsWithExistingUsers();
