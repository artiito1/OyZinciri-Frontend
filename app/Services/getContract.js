import { ethers } from "ethers";
import contractAbi from '../components/assets/AbiContract.json'
export const getContract = async (signer) =>{
    
    const provider =new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_NETWORK_SEPOLIA_RPC);
    
    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractAbi,
        signer?signer:provider,
    );
    
    try {return {contract};}
    catch (error) {
        console.error(error,error.message);
    }
}