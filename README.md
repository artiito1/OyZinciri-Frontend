# oyzinciri - Blockchain Voting System

## 📌 Overview
oyzinciri is a smart contract written in Solidity that enables the creation and management of voting polls in a decentralized and secure manner. Users can vote on existing polls with specified options, and all votes are stored transparently on the blockchain.

## 🚀 Features
- **Poll Creation:** Only the admin (manager) can create new polls and set their duration.  
- **Secure Voting:** Users can vote only once per poll.  
- **Voting Options:** Yes, No, Not Interested.  
- **Viewing Poll Details:** Users can view active and completed polls.  
- **Transparency:** All votes are recorded and viewable.  
- **Flexible Management:** Ability to check if a poll is still active.  

## 🛠️ Technologies Used
- **Solidity** - Smart contract development.  
- **OpenZeppelin** - For managing poll identities with the `Counters` library.  
- **Web3.js** - For interacting with the smart contract.  
- **Ethereum Blockchain** - For secure data storage and transparency.  
- **Next.js & React** - For creating the user interface.  
- **Tailwind CSS** - For designing a sleek and modern interface.  
- **Pinata Cloud** - For managing and storing files on IPFS.  
- **Infura Sepolia ETH Network API** - For reliable interaction with the Ethereum network.  
- **react-dropzone** - For easy file uploads.  
- **react-toastify** - For displaying notifications and alerts.  
- **Etherscan** - For viewing blockchain transactions.  

## 📜 Smart Contract Structure
- **Admin:** Manager who can only create polls.  
- **Poll Struct:** Contains the poll's title, description, duration, and vote information.  
- **Vote Struct:** Contains the user's address, chosen option, and vote time.  
- **Functions:**  
  - `createPoll(...)` - Creates a new poll.  
  - `vote(...)` - Allows the user to vote.  
  - `getPollDetails(...)` - Returns the poll's details.  
  - `getVotes(...)` - Retrieves all votes for a specific poll.  
  - `getAllPolls()` - Retrieves active and completed polls.  
  - `pollExpirationStatus(...)` - Checks if the poll's duration has expired.  
  - `getUserPollsAlreadyVoted()` - Retrieves all polls the user has already voted on.  

## 🖥️ User Interface
oyzinciri's frontend is developed using **Next.js and React**, with **Tailwind CSS** providing a modern and responsive design. 
The system supports file uploads via **react-dropzone**, displays notifications using **react-toastify**, and allows users to view transaction details on **Etherscan**.
