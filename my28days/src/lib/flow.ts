import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";

const ec = new EC('p256');

// Initialize Flow configuration
fcl.config({
  "accessNode.api": process.env.FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org",
  "discovery.wallet": process.env.FLOW_WALLET_DISCOVERY || "https://fcl-discovery.onflow.org/testnet/authn",
});

// Generate key pair for new account
function generateKeyPair() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate().toString('hex');
  const publicKey = keyPair.getPublic().encode('hex');
  
  return {
    privateKey,
    publicKey
  };
}

// Create account transaction
const createAccountTransaction = `
  transaction(publicKey: String) {
    prepare(signer: AuthAccount) {
      let account = AuthAccount(payer: signer)
      
      let key = PublicKey(
        publicKey: publicKey.decodeHex(),
        signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
      )
      
      account.keys.add(
        publicKey: key,
        hashAlgorithm: HashAlgorithm.SHA3_256,
        weight: 1000.0
      )
    }
  }
`;

// Create new Flow account
export async function createFlowAccount(): Promise<{
  address: string;
  privateKey: string;
  publicKey: string;
}> {
  try {
    // Generate new key pair
    const { privateKey, publicKey } = generateKeyPair();

    // Create new account transaction
    const transactionId = await fcl.mutate({
      cadence: createAccountTransaction,
      args: (arg: any, t: any) => [
        arg(publicKey, types.String)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    });

    // Wait for transaction to be sealed
    const transaction = await fcl.tx(transactionId).onceSealed();
    
    // Get the new account address from the transaction
    const event = transaction.events.find((event: any) => 
      event.type === 'flow.AccountCreated'
    );
    
    const address = event.data.address;

    return {
      address,
      privateKey,
      publicKey
    };
  } catch (error) {
    console.error('Error creating Flow account:', error);
    throw error;
  }
}

// Sign transaction with private key
export function signTransaction(privateKey: string, message: string): string {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sha3 = new SHA3(256);
  sha3.update(Buffer.from(message, 'hex'));
  const digest = sha3.digest();
  const sig = key.sign(digest);
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
}

// Verify signature
export function verifySignature(publicKey: string, message: string, signature: string): boolean {
  const key = ec.keyFromPublic(Buffer.from(publicKey, 'hex'));
  const sha3 = new SHA3(256);
  sha3.update(Buffer.from(message, 'hex'));
  const digest = sha3.digest();
  const signatureBuffer = Buffer.from(signature, 'hex');
  const r = signatureBuffer.slice(0, 32);
  const s = signatureBuffer.slice(32, 64);
  return key.verify(digest, { r, s });
}
