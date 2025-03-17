'use client'
import React, { useState, useEffect } from 'react';
import { VoteCard } from '../components/UI/VoteCard';
import { getContract } from '../Services/getContract';
import { Spiner } from '../components/Spiner/Spiner';

const Pollings = () => {
  const [allPolls, setAllPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPolls = async () => {
      try {
        setLoading(true);
        const { contract } = await getContract();
        
        // Get all active and ended polls
        const [active, ended] = await contract.getAllPollings();
        
        // Convert data from BigNumber to regular numbers
        const activeIds = active.map(id => Number(id));
        const endedIds = ended.map(id => Number(id));
        
        // Combine all poll IDs
        const allPollIds = [...activeIds, ...endedIds];
        
        // Get details for all polls
        const allPollsDetails = await Promise.all(
          allPollIds.map(async (id) => {
            const details = await contract.getPollDetailes(id);
            const isActive = await contract.pollExpirationStatus(id);
            
            return {
              id,
              title: details.title,
              expirationDate: Number(details.expirationDate) * 1000,
              imageHash: details.imageHash,
              description: details.description,
              rejectVotes: Number(details.rejectVotes),
              acceptVotes: Number(details.acceptVotes),
              notInterestedVotes: Number(details.notInterestedVotes),
              isActive
            };
          })
        );
        
        setAllPolls(allPollsDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching polls:", error);
        setError("An error occurred while trying to fetch polls. Please try again later.");
        setLoading(false);
      }
    };

    fetchAllPolls();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#0B171E] to-dark py-7 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="text-white mb-8 mx-10">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            All Available Polls
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9997 1.20819L18.3185 3.68102L20.7913 4.99986L18.3185 6.3187L16.9997 8.79153L15.6808 6.3187L13.208 4.99986L15.6808 3.68102L16.9997 1.20819ZM7.99967 4.33319L10.6663 9.33319L15.6663 11.9998L10.6663 14.6665L7.99967 19.6665L5.333 14.6665L0.333008 11.9998L5.333 9.33319L7.99967 4.33319ZM19.6663 16.3332L17.9997 13.2082L16.333 16.3332L13.208 17.9998L16.333 19.6665L17.9997 22.7915L19.6663 19.6665L22.7913 17.9998L19.6663 16.3332Z" 
              fill="#1CFBAD"/>
            </svg>
          </h1>
          <p className="text-lg text-gray-400 my-5">
            Browse through all available polls and participate in active voting sessions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spiner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-10">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
            {allPolls.length > 0 ? (
              allPolls.map((poll) => (
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
                <p>There are no polls available at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pollings;