import React from 'react'
import  Link  from 'next/link';
import Image from 'next/image';
import icon from '../../../public/JoinPoll.png';
import BlurHero from '../../../public/blour.png';
import HeroImage from '../../../public/HeroImage.png';

export const HeroSection = () => {
  return (
    <div className="bg-dark max-w-screen-3xl mx-auto pb-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="min-h-screen/2 grid grid-cols-1 md:grid-cols-2 gap-16 p-5 md:p-10 ">
                <div className="flex flex-col justify-center gap-3">
                    <h1 className="text-primary text-5xl font-bold">Welcome to Voter DAO</h1>
                    <h2 className="text-white text-3xl font-bold">Empowering Transparent Polls</h2>
                    <p className="text-white text-lg text-gray-500">A decentralized platform where everyone can participate in polls. Only admins can create new polls, but all users can voice their opinions.</p>
                    <Link href="/pollings" className="bg-gradient-to-r w-64 py-2.5 mt-3 flex justify-center items-center rounded-full text-white text-lg mt-5 gap-2 from-primary/60 to-gray-400/20 hover:from-primary/70 hover:to-gray-400/30">
                        <Image src={icon} alt="Hero Icon"/>
                        Join To Pollings
                    </Link>
                </div>
                <div className="image relative flex justify-center items-center h-96">
                    <Image src={BlurHero} className="absolute" alt="Blur Hero Image" />
                    <Image src={HeroImage} alt="Hero Image" />
                </div>
            </div>
        </div>
    </div>

  )
}
