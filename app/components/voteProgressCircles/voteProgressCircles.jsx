import React from 'react'
import { ProgressCircle } from '../UI/ProgressCircle'

export const VoteProgressCircles = ({ acceptVotes = 0, rejectVotes = 0, notInterestedVotes = 0 }) => {
    // Calculate total votes
    const totalVotes = acceptVotes + rejectVotes + notInterestedVotes;
    
    // Calculate vote percentages
    const calculatePercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };
    
    const voteData = [
        { percentag: calculatePercentage(acceptVotes), lable: "Accept", count: acceptVotes },
        { percentag: calculatePercentage(rejectVotes), lable: "Reject", count: rejectVotes },
        { percentag: calculatePercentage(notInterestedVotes), lable: "Not Interested", count: notInterestedVotes }
    ];
  
    return (
        <div className='mx-20 lg:mx-10 md:mx-20 mb-20'>
            <div className='p-10'>
                <h1 className="text-3xl font-semibold text-center">Total Votes</h1>
                <h2 className="text-2xl font-medium text-center text-primary">{totalVotes} Voters</h2>
            </div>
            {/* Circles */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {voteData.map((item, index) => (
                    <div key={index}>
                        <ProgressCircle 
                            percentage={item.percentag} 
                            lable={item.lable} 
                            count={item.count}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
