'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VoteCard } from '../UI/VoteCard';
import { getContract } from '../../Services/getContract';
import { ethers } from 'ethers';
import { Spiner } from '../Spiner/Spiner';

export const ExploreSection = () => {
  const [activePolls, setActivePolls] = useState([]);
  const [endedPolls, setEndedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const { contract } = await getContract();
        
        // Call the getAllPollings function to get the list of votes.
        const [active, ended] = await contract.getAllPollings();
        
        // Convert data from BigNumber to regular numbers
        const activeIds = active.map(id => Number(id));
        const endedIds = ended.map(id => Number(id));
        
        // Get details of active votes
        const activeDetails = await Promise.all(
          activeIds.map(async (id) => {
            const details = await contract.getPollDetailes(id);
            return {
              id,
              title: details.title,
              expirationDate: Number(details.expirationDate) * 1000, 
              imageHash: details.imageHash,
              description: details.description,
              rejectVotes: Number(details.rejectVotes),
              acceptVotes: Number(details.acceptVotes),
              notInterestedVotes: Number(details.notInterestedVotes),
              isActive: true
            };
          })
        );
        
        // Fetch details only the latest 8 votes completed
        const recentEndedIds = endedIds.slice(-8);
        const endedDetails = await Promise.all(
          recentEndedIds.map(async (id) => {
            const details = await contract.getPollDetailes(id);
            return {
              id,
              title: details.title,
              expirationDate: Number(details.expirationDate) * 1000,
              imageHash: details.imageHash,
              description: details.description,
              rejectVotes: Number(details.rejectVotes),
              acceptVotes: Number(details.acceptVotes),
              notInterestedVotes: Number(details.notInterestedVotes),
              isActive: false
            };
          })
        );
        
        setActivePolls(activeDetails);
        setEndedPolls(endedDetails);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while trying to fetch votes. Please try again later.");
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  //Select the latest 8 votes to display on the home page.
  const displayPolls = [...activePolls, ...endedPolls].slice(0, 8);

  return (
    <div  className="bg-gradient-to-b from-[#0B171E] to-dark py-7 max-w-screen-3xl min-h-screen  mx-auto">
      <div className="container mx-auto p-6">
        <div className="text-white flex flex-col lg:flex-row lg:items-center justify-between mx-10">
          <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold">
              Explore All Polls {""}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9997 1.20819L18.3185 3.68102L20.7913 4.99986L18.3185 6.3187L16.9997 8.79153L15.6808 6.3187L13.208 4.99986L15.6808 3.68102L16.9997 1.20819ZM7.99967 4.33319L10.6663 9.33319L15.6663 11.9998L10.6663 14.6665L7.99967 19.6665L5.333 14.6665L0.333008 11.9998L5.333 9.33319L7.99967 4.33319ZM19.6663 16.3332L17.9997 13.2082L16.333 16.3332L13.208 17.9998L16.333 19.6665L17.9997 22.7915L19.6663 19.6665L22.7913 17.9998L19.6663 16.3332Z" fill="#1CFBAD"></path></svg>
          </h1>
          <p className="text-lg text-gray-400 my-5">Check out the latest polls, see who&apos;s leading, and vote for your favorite candidates.</p>
          </div>
          <Link href="/pollings" className='flex items-center gap-1 md-4 bg-white/20 rounded-full py-2 px-8 max-w-[150px]'>
            See All 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          </Link>
        </div>
        <div className=''>
        {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spiner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-10">
              <p>{error}</p>
            </div>
          ) : (
            <div className="flex gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-10">
              {displayPolls.length > 0 ? (
                displayPolls.map((poll) => (
                  <VoteCard
                    key={poll.id}
                    id={poll.id}
                    title={poll.title}
                    description={poll.description}
                    expirationDate={poll.expirationDate}
                    imageHash={poll.imageHash}
                    isActive={poll.isActive}
                  />
                ))
              ) : (
                <div className="col-span-4 text-center text-white p-10">
                  <p>There are no votes available at this time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>  
    </div>
    
  )
}
