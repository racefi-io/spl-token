import { Keypair, Connection, PublicKey } from "@solana/web3.js";

export const DEV_ENDPOINT = "https://api.devnet.solana.com";
export const MAIN_ENDPOINT = "https://api.mainet.solana.com";

export const CONNECTION = new Connection(DEV_ENDPOINT,'confirmed');
