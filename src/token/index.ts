import { Keypair, LAMPORTS_PER_SOL, PublicKey, Signer, SystemProgram } from "@solana/web3.js";
import { CONNECTION } from "../constant";

import * as SPLToken from "@solana/spl-token";
import bs58 from "bs58";
import { resolve } from "path";
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, "../../.env") });
const PRIVATE_KEY: any | undefined = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
    throw new Error("Please set your PRIVATE_KEY in a .env file");
}

async function main() {
    const totalSupply = 2 * 1e8;
    const tokenDecimal = 1e6;

    if (PRIVATE_KEY) {


        const bytes = bs58.decode(PRIVATE_KEY.toString())
        const fromWallet = Keypair.fromSecretKey(bytes);

        let mintToken = await SPLToken.Token.createMint(
            CONNECTION,
            fromWallet,
            fromWallet.publicKey,
            null,
            6,
            SPLToken.TOKEN_PROGRAM_ID,
        );

        // Create ATA with wallet
        const mintTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
            fromWallet.publicKey
        );

        await mintToken.mintTo(
            mintTokenAccount.address,
            fromWallet.publicKey,
            [],
            totalSupply * tokenDecimal
        )
        /**
         * Disable mint
         */
        await mintToken.setAuthority(
            mintToken.publicKey,
            null,
            "MintTokens",
            fromWallet.publicKey,
            []
        )
        console.log(mintToken.publicKey.toBase58());


    }
}

main().then(
    () => process.exit(),
    (err) => {
        console.error(err);
        process.exit(-1);
    }
);
