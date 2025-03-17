'use client';

import React, { useState, useEffect } from 'react';
import { MetaDataVoteDetails } from '../../components/MetaDataVoteDetails/MetaDataVoteDetails';
import { VoteProgressCircles } from '../../components/voteProgressCircles/voteProgressCircles';
import { VotersTableTransactions } from '../../components/VotersTableTransactions/VotersTableTransactions';
import { getContract } from '../../Services/getContract';
import { Spiner } from '../../components/Spiner/Spiner';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

export default function PollDetails({ params }) {
  const { id } = params;
  const [pollData, setPollData] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Get wallet connection and user info
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider("eip155");
  const { address, isConnected } = useAppKitAccount();

  // Connect wallet function
  const connectWallet = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  // Check if user has already voted for this poll
  const checkUserVoted = async () => {
    if (!isConnected || !address) return;
    
    try {
      const { contract } = await getContract();
      const votedPolls = await contract.getUserPollsAllreadyVoted();
      const votedPollsIds = votedPolls.map(id => Number(id));
      setHasVoted(votedPollsIds.includes(Number(id)));
    } catch (error) {
      console.error("Error checking user votes:", error);
    }
  };

  // Vote function
  const submitVote = async (choice) => {
    if (!isConnected || !address) {
      toast.warning("Please connect your wallet first");
      return;
    }

    if (hasVoted) {
      toast.warning("You have already voted for this poll");
      return;
    }

    if (!pollData?.isActive) {
      toast.error("This poll has expired and is no longer accepting votes");
      return;
    }

    try {
      setVoting(true);
      
      // Get signer and contract
      const provider = new ethers.BrowserProvider(walletProvider);
      if (!provider) {
        throw new Error("Provider not available");
      }
      
      // Log for debugging
      const signer = await provider.getSigner();
      if (!signer) {
        throw new Error("Failed to get signer");
      }
      
      const { contract } = await getContract(signer);
      if (!contract) {
        throw new Error("Failed to get contract instance");
      }
      
      // Validate parameters
      if (!id) {
        throw new Error("Invalid poll ID");
      }
      
      // Valid choices check
      const validChoices = ["Yes", "No", "NoInterested"];
      
      // Map frontend choices to contract choices
      const choiceMapping = {
        "accept": "Yes",
        "reject": "No",
        "notinterested": "NoInterested"
      };

      // Convert frontend choice to contract choice
      const contractChoice = choiceMapping[choice.toLowerCase()];
      
      if (!contractChoice) {
        throw new Error(`Invalid choice: ${choice}. Valid choices are: accept, reject, notinterested`);
      }
      
      // Call vote function on smart contract with the correct choice format
      console.log(`Sending transaction with choice "${contractChoice}"...`);
      const tx = await contract.vote(id, contractChoice);
      
      toast.info("Your vote is being processed. Please wait for confirmation...");
      
      // Wait for transaction to be confirmed
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success("Your vote has been submitted successfully!");
        setHasVoted(true);
        
        // Refresh poll data
        fetchPollDetails();
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      
      // Check for specific error messages from the contract
      const errorMessage = error.message || "Unknown error";
      
      if (errorMessage.includes("already voted")) {
        toast.error("You have already voted for this poll");
        setHasVoted(true);
      } else if (errorMessage.includes("user rejected")) {
        toast.error("Transaction was rejected by the user");
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("Insufficient funds for gas fee. Please add funds to your wallet.");
      } else if (errorMessage.includes("Poll expired")) {
        toast.error("This poll has expired and is no longer accepting votes");
        // Update poll status in the UI
        if (pollData) {
          setPollData({
            ...pollData,
            isActive: false
          });
        }
      } else if (errorMessage.includes("execution reverted")) {
        // Try to extract the revert reason
        const revertReason = errorMessage.includes(":") 
          ? errorMessage.split(":").pop().trim() 
          : "Contract execution failed";
        toast.error(`Vote failed: ${revertReason}`);
      } else {
        // General error with more details
        toast.error(`Failed to submit your vote: ${errorMessage.substring(0, 100)}`);
      }
    } finally {
      setVoting(false);
    }
  };

  // Fetch poll details function
  const fetchPollDetails = async () => {
    try {
      setLoading(true);
      const { contract } = await getContract();
      
      // Fetch poll details
      const details = await contract.getPollDetailes(id);
      const isActive = await contract.pollExpirationStatus(id);
      
      // Fetch votes list
      const votesList = await contract.getVotes(id);
      
      setPollData({
        id: Number(id),
        title: details.title,
        expirationDate: Number(details.expirationDate) * 1000,
        imageHash: details.imageHash,
        description: details.description,
        rejectVotes: Number(details.rejectVotes),
        acceptVotes: Number(details.acceptVotes),
        notInterestedVotes: Number(details.notInterestedVotes),
        isActive
      });
      
      // Format votes data
      const formattedVotes = votesList.map(vote => ({
        voter: vote.voter,
        choice: vote.choice,
        time: Number(vote.time) * 1000
      }));
      
      setVotes(formattedVotes);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch poll details:", error);
      setError("An error occurred while trying to fetch poll details. Please try again later.");
      setLoading(false);
    }
  };

  // Run on initial load
  useEffect(() => {
    if (id) {
      fetchPollDetails();
    }
  }, [id]);

  // Check if user has voted whenever address changes
  useEffect(() => {
    checkUserVoted();
  }, [address, id,fetchPollDetails,checkUserVoted]);

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

  if (!pollData) {
    return (
      <div className="text-center text-white p-10 min-h-screen flex items-center justify-center">
        <p>The requested poll was not found.</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto text-white'>
      <MetaDataVoteDetails 
        title={pollData.title}
        description={pollData.description}
        imageHash={pollData.imageHash}
        expirationDate={pollData.expirationDate}
        isActive={pollData.isActive}
      />
      
      {/* Voting Section */}
      <div className="my-10 mx-auto max-w-2xl p-6 rounded-xl bg-gradient-to-b from-primary/10 to-dark border border-gray-400/20">
        <h2 className="text-2xl font-bold text-center mb-6">Cast Your Vote</h2>
        
        {!isConnected ? (
          <div className="text-center">
            <p className="mb-4 text-gray-300">Connect your wallet to cast your vote</p>
            <button 
              onClick={connectWallet}
              className="bg-primary text-dark font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition">
              Connect Wallet
            </button>
          </div>
        ) : hasVoted ? (
          <div className="text-center bg-gray-800/50 p-6 rounded-lg">
            <div className="mb-2 text-2xl">✓</div>
            <p className="text-primary font-medium">You have already voted on this poll</p>
            <p className="text-gray-400 text-sm mt-2">Each wallet can only vote once per poll</p>
          </div>
        ) : !pollData.isActive ? (
          <div className="text-center bg-gray-800/50 p-6 rounded-lg">
            <p className="text-red-400 font-medium">This poll has expired</p>
            <p className="text-gray-400 text-sm mt-2">Voting is no longer available</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => submitVote("accept")}
              disabled={voting}
              className="bg-green-600/20 text-green-500 border border-green-500/40 w-full md:w-auto py-3 px-8 rounded-lg hover:bg-green-600/30 transition">
              {voting ? <Spiner small /> : "Accept"}
            </button>
            <button 
              onClick={() => submitVote("reject")}
              disabled={voting}
              className="bg-red-600/20 text-red-500 border border-red-500/40 w-full md:w-auto py-3 px-8 rounded-lg hover:bg-red-600/30 transition">
              {voting ? <Spiner small /> : "Reject"}
            </button>
            <button 
              onClick={() => submitVote("notinterested")}
              disabled={voting}
              className="bg-gray-600/20 text-gray-300 border border-gray-500/40 w-full md:w-auto py-3 px-8 rounded-lg hover:bg-gray-600/30 transition">
              {voting ? <Spiner small /> : "Not Interested"}
            </button>
          </div>
        )}
      </div>
      
      <VoteProgressCircles 
        acceptVotes={pollData.acceptVotes}
        rejectVotes={pollData.rejectVotes}
        notInterestedVotes={pollData.notInterestedVotes}
      />
      <VotersTableTransactions votes={votes} />
    </div>
  );
} 