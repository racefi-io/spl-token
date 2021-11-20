import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CONNECTION } from "../constant";

import * as SPLToken from "@solana/spl-token";
import bs58 from "bs58";
import { resolve } from "path";
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, "../../.env") });
const PRIVATE_KEY: any | undefined = process.env.SecretKey;
if (!PRIVATE_KEY) {
    throw new Error("Please set your PRIVATE_KEY in a .env file");
}


async function main() {
    const totalSupply = 2 * 1e8;
    const tokenDecimal = 1e8;

    if (PRIVATE_KEY) {

        let fromWallet = Keypair.fromSecretKey(
            Uint8Array.from([111, 244, 42, 161, 162, 202, 84, 117, 148, 141, 81, 67, 232, 92, 99, 207, 235, 214, 209, 180, 118, 47, 48, 188, 110, 74, 74, 200, 104, 97, 32, 60, 44, 183, 13, 168, 154, 226, 170, 66, 209, 12, 59, 119, 124, 23, 156, 180, 160, 148, 13, 202, 150, 147, 225, 103, 2, 65, 27, 239, 164, 217, 200, 48])
        );

        // const bytes = bs58.decode(process.env.PRIVATE_KEY)
        // const fromWallet = Keypair.fromSecretKey(bytes)

        /**Request Airdop for devnet */
        // const fromAirdropSignature = await CONNECTION.requestAirdrop(
        //     fromWallet.publicKey,
        //     LAMPORTS_PER_SOL,
        // );
        // await CONNECTION.confirmTransaction(fromAirdropSignature);
        let multisig = Keypair
        let mint = await SPLToken.Token.createMint(
            CONNECTION,
            fromWallet,
            fromWallet.publicKey,
            null,
            6,
            SPLToken.TOKEN_PROGRAM_ID,
        );


        // // Create ATA with wallet
        const mintTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
            fromWallet.publicKey
        );

        await mint.mintTo(
            mintTokenAccount.address,
            fromWallet.publicKey,
            [],
            totalSupply * tokenDecimal
        )

        console.log(mint.publicKey.toBase58());

        /**
         * Disable mint and set multisig
         */
        await mint.setAuthority(
            mint.publicKey,
            null,
            "MintTokens",
            fromWallet.publicKey,
            []
        )


    }
}

main().then(
    () => process.exit(),
    (err) => {
        console.error(err);
        process.exit(-1);
    }
);
