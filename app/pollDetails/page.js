import React from 'react'
import {MetaDataVoteDetails} from '../components/MetaDataVoteDetails/MetaDataVoteDetails'
import {VoteProgressCircles} from '../components/voteProgressCircles/voteProgressCircles'
import {VotersTableTransactions} from '../components/VotersTableTransactions/VotersTableTransactions'

const pollDetails = () => {
  return (
    <div className='max-w-4xl mx-auto text-white'>
        <MetaDataVoteDetails/>
        <VoteProgressCircles/>
        <VotersTableTransactions/>
    </div>
  )
}
export default pollDetails;
