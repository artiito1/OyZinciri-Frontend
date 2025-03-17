'use client';

import React, { useState, useEffect } from 'react';
import { getContract } from '../Services/getContract';
import {UserIcon} from '@heroicons/react/24/solid';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { Spiner } from '../components/Spiner/Spiner';
import Link from 'next/link';
import { ethers } from 'ethers';
import Image from 'next/image';
import { getIpfsFile } from '../Services/IpftFileUploader';
import VoteImg from '../../public/VoteCardTest.jpg';

export default function MyPolling() {
  // States for polls and UI
  const [userPolls, setUserPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'expired', 'active', 'all'
  
  // Get wallet connection and user info
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  
  // Fetch polls the user has voted on
  const fetchUserPolls = async () => {
    if (!isConnected || !address || !walletProvider) {
      setUserPolls([]);
      setFilteredPolls([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use a signer for contract calls to ensure address validation
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      
      // Get contract with signer to access user-specific data
      const { contract } = await getContract(signer);
      
      // Try first approach - getting user's voted polls directly
      let userPollIds = [];
      try {
        // Get poll IDs the user has voted on
        const votedPollsIds = await contract.getUserPollsAllreadyVoted();
        userPollIds = votedPollsIds.map(id => Number(id));
      } catch (error) {
        console.error("Error calling getUserPollsAllreadyVoted:", error);
      }
      
      // If direct method returns empty, try alternative approach
      if (userPollIds.length === 0) {
        // Get total poll count to iterate through all polls
        const totalPolls = await contract.getNumberOfPolls();
        
        // Check each poll to see if user has voted
        const checkVotePromises = [];
        for (let i = 1; i <= Number(totalPolls); i++) {
          checkVotePromises.push(
            (async (pollId) => {
              try {
                const hasVoted = await contract.checkUserVoted(pollId);
                return hasVoted ? pollId : null;
              } catch (error) {
                console.error(`Error checking poll ${pollId}:`, error);
                return null;
              }
            })(i)
          );
        }
        
        // Wait for all checks to complete
        const results = await Promise.all(checkVotePromises);
        userPollIds = results.filter(id => id !== null);
      }
      
      if (userPollIds.length === 0) {setUserPolls([]);
        setFilteredPolls([]);
        setLoading(false);
        return;
      }
      
      // Fetch details for each poll
      const pollsPromises = userPollIds.map(async (pollId) => {
        try {
          const details = await contract.getPollDetailes(pollId);
          const isActive = await contract.pollExpirationStatus(pollId);
          
          return {
            id: pollId,
            title: details.title,
            expirationDate: Number(details.expirationDate) * 1000,
            imageHash: details.imageHash,
            description: details.description,
            rejectVotes: Number(details.rejectVotes),
            acceptVotes: Number(details.acceptVotes),
            notInterestedVotes: Number(details.notInterestedVotes),
            isActive,
            userVoted: true
          };
        } catch (error) {
          console.error(`Error fetching details for poll ${pollId}:`, error);
          return null;
        }
      });
      
      // Wait for all promises to resolve
      const pollsDetails = await Promise.all(pollsPromises);
      
      // Filter out nulls (failed fetches)
      const validPolls = pollsDetails.filter(poll => poll !== null);
      
      setUserPolls(validPolls);
      filterPolls(validPolls, activeTab);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user polls:", error);
      setError(`Error fetching your voted polls: ${error.message || "Unknown error"}`);
      setLoading(false);
    }
  };
  
  // Filter polls based on active tab
  const filterPolls = (polls, tab) => {
    const now = new Date().getTime();
    
    switch (tab) {
      case 'expired':
        setFilteredPolls(polls.filter(poll => !poll.isActive));
        break;
      case 'active':
        setFilteredPolls(polls.filter(poll => poll.isActive));
        break;
      case 'all':
      default:
        setFilteredPolls(polls);
        break;
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterPolls(userPolls, tab);
  };
  
  // Fetch polls on initial load and when address changes
  useEffect(() => {
    fetchUserPolls();
  }, [address, isConnected,fetchUserPolls]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spiner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-10 min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-white">
        <div className="flex items-center space-x-2 text-gray-400 text-sm mt-6 mb-6 ">
            <UserIcon className="h-6 w-6 text-gray-400 cursor-pointer"></UserIcon>
            <p>My Polling</p>
        </div>
        <p className="text-center mb-8 text-gray-300">Connect your wallet to view polls you have voted on</p>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <p className="text-gray-400">You need to connect your wallet to view your polls</p>
        </div>
      </div>
    );
  }

  if (userPolls.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-white">
        <div className="flex items-center space-x-2 text-gray-400 text-sm mt-6 mb-6 ">
            <UserIcon className="h-6 w-6 text-gray-400 cursor-pointer"></UserIcon>
            <p>My Polling</p>
        </div>
        <p className="text-center mb-8 text-gray-300">You have not voted on any polls yet</p>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <p className="text-gray-400">Explore available polls and cast your vote</p>
          <Link href="/pollings" className="mt-4 inline-block bg-primary text-dark font-bold py-2 px-6 rounded-full hover:bg-primary/90 transition">
            View All Polls
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <div className="flex items-center space-x-2 text-gray-400 text-sm mt-6 mb-6 ">
          <UserIcon className="h-6 w-6 text-gray-400 cursor-pointer"></UserIcon>
          <p>My Polling</p>
      </div>
      <p className="text-center mb-8 text-gray-300">Polls you have voted on</p>
      
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-800/50 p-1 rounded-lg">
          <button 
            onClick={() => handleTabChange('all')}
            className={`px-6 py-2 rounded-md transition ${activeTab === 'all' ? 'bg-primary text-dark' : 'text-gray-300 hover:bg-gray-700/50'}`}
          >
            All Polls
          </button>
          <button 
            onClick={() => handleTabChange('active')}
            className={`px-6 py-2 rounded-md transition ${activeTab === 'active' ? 'bg-primary text-dark' : 'text-gray-300 hover:bg-gray-700/50'}`}
          >
            Active Polls
          </button>
          <button 
            onClick={() => handleTabChange('expired')}
            className={`px-6 py-2 rounded-md transition ${activeTab === 'expired' ? 'bg-primary text-dark' : 'text-gray-300 hover:bg-gray-700/50'}`}
          >
            Expired Polls
          </button>
        </div>
      </div>
      
      {/* Poll Cards */}
      {filteredPolls.length === 0 ? (
        <div className="text-center bg-gray-800/50 p-6 rounded-lg">
          <p className="text-gray-400">No polls found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map(poll => (
            <Link href={`/pollDetails/${poll.id}`} key={poll.id}>
              <div className="bg-gradient-to-b from-primary/10 to-dark border border-gray-400/20 rounded-xl overflow-hidden hover:border-primary/40 transition duration-300 h-full flex flex-col">
                <div className="h-48 relative">
                    <Image 
                      src={poll.imageHash ? getIpfsFile(poll.imageHash) : VoteImg.src}
                      alt={poll.title}
                      fill
                      className="object-cover"
                      unoptimized={poll.imageHash ? true : false}
                    />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${poll.isActive ? 'bg-green-500/30 text-green-400 border border-green-500/40' : 'bg-red-500/30 text-red-400 border border-red-500/40'}`}>
                    {poll.isActive ? 'Active' : 'Expired'}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-bold mb-2 line-clamp-2">{poll.title}</h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{poll.description}</p>
                  <div className="text-xs text-gray-400">
                    Expires: {new Date(poll.expirationDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <div className="text-green-400">Yes: {poll.acceptVotes}</div>
                    <div className="text-red-400">No: {poll.rejectVotes}</div>
                    <div className="text-gray-400">Not Interested: {poll.notInterestedVotes}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}