import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useState } from 'react'


const SendSolForm = () => {
    const [txSig, setTxSig] = useState('')
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    }

    const sendSol = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!connection || !publicKey) {
            return 
        }

        const formData = new FormData(event.currentTarget);
        const amount = parseFloat(formData.get('amount') as string);
        const recipient = formData.get('recipient') as string;

        const transaction = new web3.Transaction();
        const recipientPubKey = new web3.PublicKey(recipient);

        const sendSolInstruction = web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubKey,
            lamports: LAMPORTS_PER_SOL * amount
        })

        transaction.add(sendSolInstruction)
        sendTransaction(transaction, connection).then((sig) => {
            setTxSig(sig)
        })
    }

    return (
        <div className='bg-[]'>
            <div>
                {
                    publicKey ? 
                    <form onSubmit={sendSol} className='flex flex-col justify-center items-center mt-24 mx-auto max-w-md'>
                        <div className="mb-6">
                            <label htmlFor="amount" className='block mb-2 text-lg font-medium text-gray-800'>Amount (in SOL) to Send:</label>
                            <input type="text" id='amount' placeholder='e.g. 0.1' required className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#512da8]' />
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="recipient" className='block mb-2 text-lg font-medium text-gray-800'>Send SOL to:</label>
                            <input type="text" id='recipient' placeholder='e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA' required className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#512da8]' />
                        </div>
                        
                        <button type="submit" className='bg-black text-white px-4 py-2 rounded-lg hover:bg-[#512da8] transition duration-300 ease-in-out'>Send</button>
                    </form>

                            :
                            <div className='flex justify-center items-center text-gray-800 font-bold text-xl mt-60 mr-20'>
                                <p>Connect Your Wallet</p>
                            </div>
                }
                {
                    txSig ?
                        <div>
                            <p>View your transaction on</p>
                            <a href={link()}>Solana Explorer</a>
                        </div> :
                        null
                }
            </div>
        </div>
        
    )
    
}

export default SendSolForm