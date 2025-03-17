import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import VoteImg from '../../../public/VoteCardTest.jpg';
import { getIpfsFile } from '../../Services/IpftFileUploader';

export const VoteCard = ({ id, title, description, expirationDate, imageHash, isActive }) => {
  // Convert voting end date to readable format
  const formatExpirationDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-EG', options);
  
  };
  // IPFS image address processing
  const imageUrl = imageHash 
      ? getIpfsFile(imageHash)
      : VoteImg.src;

  // Trim description if it is too long.
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className='bg-gray-400/5 text-white rounded-3xl border border-gray-400/35 transform transition mt-10 overflow-hidden'>
        <Link href={`/pollDetails/${id}`}>
            <div className='overflow-hidden'>
                <Image 
                    className='object-cover w-full h-auto rounded-t-3xl hover:scale-105 transition-transform duration-300' 
                    alt={title || 'Voting Image'} 
                    src={imageUrl}
                    width={400}
                    height={300}
                    unoptimized={imageHash ? true : false}
                />
            </div>
            <div className='mt-4 pt-1 px-4 pb-5'>
                <div className="flex justify-between items-center">
                    <h2 className='font-bold text-primary'>{title ||'Voting Title'}</h2>
                    {isActive !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {isActive ? 'active' :'Expired'}
                        </span>
                    )}
                </div>
                <p className='mt-2 text-sm text-gray-400'>{truncateDescription(description) || 'No description'}</p>
                <p className='mt-2 text-sm text-gray-500'>
                    Expiration Date: {expirationDate ? formatExpirationDate(expirationDate) : 'undefined'}
                </p>
            </div>
        </Link>
    </div>
  )
}