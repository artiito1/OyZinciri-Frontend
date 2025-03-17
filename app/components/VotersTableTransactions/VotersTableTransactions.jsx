import React from 'react'
import etherscanLogo from '../../../public/etherscanLogo.png'
import Image from 'next/image'

export const VotersTableTransactions = ({ votes = [] }) => {
    // Format wallet address for abbreviated display
    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };
    
    // Format date and time
    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Format vote choice
    const formatChoice = (choice) => {
        if (!choice) return "";
        switch(choice.toLowerCase()) {
            case "accept":
                return "Accept";
            case "reject":
                return "Reject";
            case "notinterested":
                return "Not Interested";
            default:
                return choice;
        }
    };

    // Get Etherscan link for address
    const getEtherscanUrl = (address) => {
        return `https://sepolia.etherscan.io/address/${address}`;
    };

    return (
        <div>
            <div className='text-center text-2xl font-semibold mt-16 mb-8'>
                <h2>Votes History</h2>
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-2xl shadow-md bg-gradient-to-b via-dark px-4 py-2.5 from-primary/15 border border-gray-400/40 pb-16 gridentB">
                <table className="min-w-full bg-inherit text-gray-200">
                    <thead>
                        <tr className="px-4 py-3 text-left text-sm font-medium text-white">
                            <th>
                                <svg className="inline-block mr-2 mb-1" width="14" height="16" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.41667 5.25002C3.41667 4.03444 3.89955 2.86866 4.75909 2.00911C5.61864 1.14957 6.78442 0.666687 8 0.666687C9.21558 0.666687 10.3814 1.14957 11.2409 2.00911C12.1004 2.86866 12.5833 4.03444 12.5833 5.25002C12.5833 6.46559 12.1004 7.63138 11.2409 8.49093C10.3814 9.35047 9.21558 9.83335 8 9.83335C6.78442 9.83335 5.61864 9.35047 4.75909 8.49093C3.89955 7.63138 3.41667 6.46559 3.41667 5.25002ZM0.5 14.8334C0.5 13.7283 0.938987 12.6685 1.72039 11.8871C2.50179 11.1057 3.5616 10.6667 4.66667 10.6667H11.3333C12.4384 10.6667 13.4982 11.1057 14.2796 11.8871C15.061 12.6685 15.5 13.7283 15.5 14.8334V17.3334H0.5V14.8334Z" fill="#4A9077"></path>
                                </svg>
                                Wallet Address
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                <svg className="inline-block mr-2 mb-1" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1.41089" y="2.40625" width="14.5113" height="14.5938" rx="1" stroke="#4A9077"></rect>
                                <path d="M1.41089 7.28351H15.9222V15.9989C15.9222 16.5512 15.4745 16.9989 14.9222 16.9989H2.41089C1.8586 16.9989 1.41089 16.5512 1.41089 15.9989V7.28351Z" fill="#4A9077" stroke="#4A9077"></path>
                                <path d="M12.6921 1V3.6459" stroke="#4A9077" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M4.75464 1V3.6459" stroke="#4A9077" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                Date & Time
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                <svg className="inline-block mr-2 mb-1" width="22" height="20" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16.2745 7.033C16.4958 8.84936 16.0877 10.6867 15.1183 12.2386C14.149 13.7905 12.6769 14.9632 10.9476 15.5612C9.21824 16.1592 7.33618 16.1462 5.61523 15.5246C3.89429 14.9029 2.43845 13.7101 1.4905 12.145C1.38733 11.9749 1.35597 11.7707 1.40332 11.5775C1.45068 11.3842 1.57286 11.2177 1.743 11.1145C1.91313 11.0113 2.11728 10.98 2.31054 11.0273C2.5038 11.0747 2.67033 11.1969 2.7735 11.367C3.28414 12.2102 3.97988 12.9262 4.80809 13.4609C5.63629 13.9956 6.57525 14.3348 7.55392 14.4531C8.5326 14.5713 9.52534 14.4654 10.457 14.1433C11.3887 13.8212 12.235 13.2915 12.9317 12.5941C13.6285 11.8967 14.1575 11.05 14.4787 10.118C14.7999 9.18606 14.9049 8.19322 14.7858 7.21466C14.6667 6.23609 14.3266 5.29743 13.7912 4.46971C13.2558 3.64199 12.5392 2.94689 11.6955 2.437C11.5252 2.3341 11.4028 2.16777 11.3552 1.9746C11.3075 1.78144 11.3386 1.57727 11.4415 1.407C11.5444 1.23673 11.7107 1.11431 11.9039 1.06668C12.0971 1.01905 12.3012 1.0501 12.4715 1.153C13.5098 1.78059 14.3917 2.63609 15.0505 3.65479C15.7094 4.67348 16.1279 5.82869 16.2745 7.033ZM9.3335 1C9.3335 1.26522 9.22814 1.51957 9.0406 1.70711C8.85307 1.89464 8.59871 2 8.3335 2C8.06828 2 7.81393 1.89464 7.62639 1.70711C7.43885 1.51957 7.3335 1.26522 7.3335 1C7.3335 0.734783 7.43885 0.48043 7.62639 0.292893C7.81393 0.105357 8.06828 0 8.3335 0C8.59871 0 8.85307 0.105357 9.0406 0.292893C9.22814 0.48043 9.3335 0.734783 9.3335 1ZM3.1375 5C3.20419 4.88623 3.24773 4.76039 3.26559 4.62972C3.28346 4.49906 3.2753 4.36615 3.2416 4.23865C3.20789 4.11115 3.14929 3.99158 3.06918 3.88682C2.98907 3.78206 2.88903 3.69418 2.77482 3.62824C2.66061 3.56229 2.53449 3.51959 2.40371 3.5026C2.27293 3.4856 2.14008 3.49464 2.0128 3.52919C1.88553 3.56374 1.76635 3.62313 1.66212 3.70393C1.55789 3.78473 1.47068 3.88535 1.4055 4C1.27498 4.22956 1.24056 4.50142 1.30975 4.75626C1.37894 5.01111 1.54611 5.22824 1.7748 5.36027C2.00349 5.49231 2.27512 5.52853 2.53041 5.46104C2.78571 5.39354 3.00395 5.22781 3.1375 5ZM1.3335 7C1.59871 7 1.85307 7.10536 2.0406 7.29289C2.22814 7.48043 2.3335 7.73478 2.3335 8C2.3335 8.26521 2.22814 8.51957 2.0406 8.7071C1.85307 8.89464 1.59871 9 1.3335 9C1.06828 9 0.813926 8.89464 0.626389 8.7071C0.438853 8.51957 0.333496 8.26521 0.333496 8C0.333496 7.73478 0.438853 7.48043 0.626389 7.29289C0.813926 7.10536 1.06828 7 1.3335 7ZM5.3335 2.804C5.44814 2.73882 5.54876 2.6516 5.62956 2.54737C5.71036 2.44315 5.76975 2.32396 5.80431 2.19669C5.83886 2.06942 5.8479 1.93657 5.8309 1.80579C5.8139 1.67501 5.7712 1.54888 5.70526 1.43467C5.63932 1.32046 5.55144 1.22042 5.44668 1.14031C5.34191 1.06021 5.22234 1.00161 5.09484 0.967901C4.96734 0.934192 4.83444 0.926036 4.70377 0.943902C4.57311 0.961767 4.44727 1.0053 4.3335 1.072C4.10569 1.20555 3.93995 1.42379 3.87246 1.67908C3.80496 1.93438 3.84118 2.20601 3.97322 2.43469C4.10526 2.66338 4.32239 2.83056 4.57723 2.89975C4.83207 2.96894 5.10394 2.93452 5.3335 2.804Z" fill="#4A9077"></path>
                                </svg>
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-white">View on Etherscan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {votes.length > 0 ? (
                            votes.map((vote, index) => (
                                <tr key={index} className="border-b border-gray-400/40">
                                    <td className="px-4 py-3 text-sm">{formatAddress(vote.voter)}</td>
                                    <td className="px-4 py-3 text-sm">{formatDate(vote.time)}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`py-1 px-3 rounded-full ${
                                            vote.choice.toLowerCase() === 'accept' ? 'bg-green-500/20 text-green-500' : 
                                            vote.choice.toLowerCase() === 'reject' ? 'bg-red-500/20 text-red-500' : 
                                            'bg-gray-500/20 text-gray-300'
                                        }`}>
                                            {formatChoice(vote.choice)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <a href={getEtherscanUrl(vote.voter)} target="_blank" rel="noopener noreferrer">
                                            <Image 
                                                alt="etherscan" 
                                                loading="lazy" 
                                                width="28" 
                                                height="28" 
                                                decoding="async" 
                                                className="rounded mx-auto" 
                                                src={etherscanLogo}
                                            />
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b border-gray-400/40">
                                <td colSpan="4" className="px-4 py-10 text-center text-gray-500">No votes available yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
