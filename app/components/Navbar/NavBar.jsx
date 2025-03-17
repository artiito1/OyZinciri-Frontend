'use client';
import React,{useState} from 'react';  
import Image from 'next/image';
import logo from '../../../public/logo.png';
import {Bars3Icon, XMarkIcon,FingerPrintIcon} from '@heroicons/react/24/solid';
import {useAppKit, useAppKitAccount} from '@reown/appkit/react';




export const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const options = [
        {"label": "Home", "link": "/"},
        {"label": "My Polling", "link": "/mypolling"},
    ]

    const {open} = useAppKit();
    const {address, isConnected} = useAppKitAccount();

    const connectHandler = async () => {
        try {
            await open();
        }catch (error) {
            console.error("Error connecting wallet", error);
        }
    }

    return <div className="w-full" >
        <header className="bg-dark border-gray-400/30 border-b">
            <div className="contianer mx-auto flex items-center justify-between px-4 md:px-20 h-20">
                <div>
                    <Image src={logo} alt="logo" width={160} height={50}/>
                </div>
                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="hidden md:flex space-x-8 items-center">
                        {options.map((option, index) => {
                            return <li 
                            key={index} 
                            className="text-white text-sm font-medium cursor-pointer">
                                <a href={option.link} className="text-white hover:text-primary">{option.label}</a>
                            </li>
                        })}
                        {address ? (
                            <div className="text-sm cursor-pointer text-primary bg-primary/20 py-2.5 px-4 rounded-full" onClick={connectHandler}>
                                <button className='flex items-center gap-2'><FingerPrintIcon className='h-5 w-5'></FingerPrintIcon>{address.slice(0,15)}...</button>
                            </div>):
                            <div className="text-sm cursor-pointer text-primary bg-primary/20 py-2.5 px-4 rounded-full">
                                <button onClick={connectHandler}>Connect Wallet</button>
                            </div>
                        }
                    </ul>
                </nav>

                {/* Mobile Navigation Toggle */}
                <div className="block md:hidden">
                    {isMenuOpen ? (
                        <XMarkIcon 
                            className="h-8 w-8 text-white cursor-pointer"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    ) : (
                        <Bars3Icon 
                            className="h-8 w-8 text-white cursor-pointer"
                            onClick={() => setIsMenuOpen(true)}
                        />
                    )}
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute w-full bg-dark border-gray-400/30 border-b">
                    <ul className="px-4 py-4 space-y-4">
                        {options.map((option, index) => (
                            <li key={index} 
                                className="text-white text-sm font-medium">
                                <a  href={option.link} 
                                    className="text-white hover:text-primary block py-2"
                                    onClick={() => setIsMenuOpen(false)}>
                                    {option.label}
                                </a>
                            </li>
                        ))}
                        <div className="text-sm text-primary bg-primary/20 py-2.5 px-4 rounded-full inline-block">
                            <button onClick={() => {setIsMenuOpen(false);connectHandler();}}>
                                Connect Wallet
                            </button>
                        </div>
                    </ul>
                </div>
            )}
        </header>
    </div>;
}