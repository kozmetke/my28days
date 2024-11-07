import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import axios from "axios";

const ec = new EC('p256');

type FlowEvent = {
  type: string;
  data: {
    address: string;
    [key: string]: any;
  };
};

type FlowTransaction = {
  events: FlowEvent[];
  status: number;
  errorMessage?: string;
};

type FlowAccount = {
  address: string;
  balance: string;
  keys: any[];
};

// For demo purposes, we'll use pre-generated testnet accounts
const DEMO_ACCOUNTS = [
  {
    address: "0x01cf0e2f2f715450",
    privateKey: "7066849554fe2e2cfba8887be3ce6c7baf3a368d3239d6b391f5c564c114ef4c",
    publicKey: "5a5b3e159b2ae22f3e64226f09c830b5440e85b9fb8332010b8c43a7c71c5c756f3f1dcc7af8f0d477c4c8c0b2f2c0c5f08c5c5c5c5c5c5c5c5c5c5c5c5c5c"
  },
  {
    address: "0x179b6b1cb6755e31",
    privateKey: "2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a",
    publicKey: "3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b"
  },
  {
    address: "0x3c3c3c3c3c3c3c3c",
    privateKey: "4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d",
    publicKey: "5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e"
  }
];

let currentAccountIndex = 0;

// Enhanced Flow configuration for testnet
fcl.config({
  "app.detail.title": "My28Days",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet",
  "0xFungibleToken": "0x9a0766d93b6608b7",
  "0xFlowToken": "0x7e60df042a9c0868",
});

// Create new Flow testnet account using pre-generated accounts
export async function createFlowAccount(): Promise<{
  address: string;
  privateKey: string;
  publicKey: string;
}> {
  try {
    if (currentAccountIndex >= DEMO_ACCOUNTS.length) {
      throw new Error('No more pre-generated accounts available');
    }

    const account = DEMO_ACCOUNTS[currentAccountIndex];
    currentAccountIndex++;

    return {
      address: account.address,
      privateKey: account.privateKey,
      publicKey: account.publicKey
    };
  } catch (err) {
    const error = err as Error;
    console.error('Error creating Flow account:', error.message);
    throw new Error(`Failed to create Flow account: ${error.message}`);
  }
}

// Get account details
export async function getAccountDetails(address: string): Promise<FlowAccount> {
  try {
    const account = await fcl.account(address);
    return {
      ...account,
      balance: account.balance.toString()
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get account details: ${errorMessage}`);
  }
}

// Get testnet FLOW balance
export async function getFlowBalance(address: string): Promise<string> {
  try {
    const account = await fcl.account(address);
    return account.balance.toString();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get FLOW balance: ${errorMessage}`);
  }
}

// Execute a script (read-only operation)
export async function executeScript<T>(cadence: string, args: any[] = []): Promise<T> {
  try {
    return await fcl.query({
      cadence,
      args: (arg: any, t: any) => args
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to execute script: ${errorMessage}`);
  }
}

// Execute a transaction
export async function executeTransaction(
  cadence: string,
  args: any[] = [],
  limit = 999
): Promise<FlowTransaction> {
  try {
    const transactionId = await fcl.mutate({
      cadence,
      args: (arg: any, t: any) => args,
      proposer: fcl.authz as any,
      payer: fcl.authz as any,
      authorizations: [fcl.authz] as any[],
      limit
    });

    return await fcl.tx(transactionId).onceSealed() as FlowTransaction;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to execute transaction: ${errorMessage}`);
  }
}
