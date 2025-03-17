import React from 'react'
import Image from 'next/image'
import VoteImg from '../../../public/VoteCardTest.jpg';
import { getIpfsFile } from '../../Services/IpftFileUploader';

export const MetaDataVoteDetails = ({ title, description, imageHash, expirationDate, isActive }) => {
  // Convert expiration date to readable format
  const formatExpirationDate = (timestamp) => {
    if (!timestamp) return 'Undefined';
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };
  // Process IPFS image address
  const imageUrl = imageHash 
    ? getIpfsFile(imageHash)
    : VoteImg.src;

  return (
    <div className='max-w-full'>
        <div className='p-5 text-white'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <h1 className='text-3xl font-bold text-primary'>{title || 'Vote Title'}</h1>
                <div className='flex items-center gap-3 mt-4 md:mt-0'>
                    <div className={`border py-2 px-4 rounded-xl ${isActive ? 'border-primary text-primary' : 'border-red-500 text-red-500'}`}>
                        {isActive ? 'Active' : 'Expired'}
                    </div>
                    <div className='border border-gray-400 py-2 px-4 rounded-xl text-gray-400'>
                        Expiration Date: {formatExpirationDate(expirationDate)}
                    </div>
                </div>
            </div>
            <div className='relative mt-8'>
                <Image 
                src={imageUrl} 
                alt={title || 'Vote Image'}
                width={1200}
                height={500}
                className='w-full object-cover rounded-t-3xl'
                unoptimized={imageHash ? true : false}
                />
                <div className='absolute left-0 right-0 z-0 w-full h-full bottom-0 bg-gradient-to-t from-black/90 to-transparent'></div>
            </div>  
            <h1 className='text-primary font-bold text-xl md:text-2xl pt-5 pb-1'>Vote Description</h1>
            <p className='text-white'>
                {description || 'No description available for this vote.'}
            </p>
        </div>
    </div>
  )
}

