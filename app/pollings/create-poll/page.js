'use client';
import React,{useState, useEffect} from 'react'
import {UserIcon,ArchiveBoxIcon,CloudArrowUpIcon} from '@heroicons/react/24/solid';
import {useDropzone} from 'react-dropzone';
import { ethers } from "ethers";
import {getContract} from '../../Services/getContract';
import {IpfsFileUploader} from '../../Services/IpftFileUploader';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {Spiner} from '../../components/Spiner/Spiner';

const CreatePoll = () => {

  const [files, setFiles] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [voteTitle,setVoteTitle] = useState(null);
  const [expirationDate,setExpirationDate] = useState(null);
  const [voteDescription,setVoteDescription] = useState(null);
  const [loading,setLoading] = useState(null);

  const onDrop = (acceptFiles) => {
    const uploadedFile = acceptFiles[0];
    setSelectedImage(uploadedFile);
    const filePreview = {
      file: uploadedFile,
      preview: URL.createObjectURL(uploadedFile)
    };
    setFiles(filePreview);
  }
    // Cleanup function to revoke object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (files) {
        URL.revokeObjectURL(files.preview);
      }
    };
  }, [files]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, 
    accept: 'image/*',
    maxFiles: 1,
  });
  const handleRemove = () => {
    setFiles(null);
  };

  const {walletProvider} = useAppKitProvider("eip155"); // = window.ethereum
  const {address,isConnected} = useAppKitAccount();
  const router = useRouter();
  // Create VALIDATION 
  const [error,setErorr] = useState({});
  const validateInputs = () => {
    const newErrors={}
    if(!voteTitle) newErrors.voteTitle = "Vote Title is required";
    if(!expirationDate) {
      newErrors.expirationDate = "Expiration Date is required";
    } else {
      const selectedDate = new Date(expirationDate);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.expirationDate = "Expiration date must be in the future.";
      }
    }
    if(!voteDescription) newErrors.voteDescription = "Vote Description is required";
    if(!selectedImage) newErrors.selectedImage = "Image is required";
    setErorr(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const createPollByAdmin = async (e) => {
    e.preventDefault();
    if(!validateInputs()) return;
    setLoading(true);
    const hasImage = await IpfsFileUploader(selectedImage);
    
    // تحويل التاريخ بشكل صحيح
    const expirationDateTime = new Date(expirationDate);
    // نضيف الوقت إلى نهاية اليوم (23:59:59)
    expirationDateTime.setHours(23, 59, 59);
    const timeInSec = Math.floor(expirationDateTime.getTime() / 1000);

    if (walletProvider && address && isConnected) {

      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const {contract} = await getContract(signer);

      try {
        const tx = await contract.createPoll(
          voteTitle,
          timeInSec,
          hasImage.cid,
          voteDescription
        );
        const recipt =await tx.wait()
        if(recipt.status === 1) {
          setLoading(false);
          toast.success("Poll Created Successfully");
          router.push("/pollings");
        }else{
          toast.error("Transaction Failed");
        }
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred while creating the poll");
      }
    }
  }
  return (
    <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen'>
      {/* Start section title */}
      <div className="flex items-center space-x-2 text-gray-400 text-sm mt-6 mb-6 ">
        <UserIcon className="h-6 w-6 text-gray-400 cursor-pointer"></UserIcon>
        <p> Admin Pollings</p>
      </div>
      {/* End section title */}

      {/* Start create poll button */}
      <p className="text-white text-lg font-semibold px-6 ">Create Polling</p>
      <form className="bg-dark p-6 rounded-lg mt-4" onSubmit={createPollByAdmin}>
        {/* başlık */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-500 text-sm font-medium mb-2">
              Vote Title
            </label>
            <div className="flex flex-col w-full">
              <div className="relative">
                <ArchiveBoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 cursor-pointer pointer-events-none" />
                <input
                  id="vote-title"
                  type="text"
                  className={`text-white w-full p-3 pl-12 bg-inherit border ${
                    error.voteTitle ? "border-red-400" : "border-gray-600"
                  } focus:outline-none focus:border-gray-400 rounded-md`}
                  placeholder="Enter Vote Title"
                  onChange={(e) => setVoteTitle(e.target.value)}
                />
              </div>
              {error.voteTitle && (
                <p className="text-red-400 mt-1">{error.voteTitle}</p>
              )}
            </div>
          </div>
          {/* bitirme tarihi */}
          <div className="w-1/2">
            <label className="block text-gray-500 text-sm font-medium mb-2">
                Expire date
            </label>
            <div className="relative w-full">
                <input
                    id="vote-expiration"
                    type="date"
                    className={`text-white w-full p-3 bg-inherit border ${error.expirationDate ? "border-red-400": "border-gray-600"} focus:outline-none focus:border-gray-400 rounded-md`}
                    placeholder="Select The Expiration Date"
                    onChange={(e)=>setExpirationDate(e.target.value)} 
                />
                {error.expirationDate && (
                <p className="text-red-400 mt-1">{error.expirationDate}</p>
              )}
            </div>
          </div>
        </div>
        {/* start description */}
        <label className="block text-gray-500 text-sm font-medium mb-2 mt-4">
        Description</label>
        <textarea id="description" className={`text-white w-full p-3 bg-inherit border ${error.voteDescription ? "border-red-400": "border-gray-600"} focus:outline-none focus:border-gray-400 rounded-md`}
        rows="4" placeholder="Enter Vote Description" onChange={(e)=>setVoteDescription(e.target.value)} ></textarea>
        {error.voteDescription && (
          <p className="text-red-400 mt-1">{error.voteDescription}</p>
        )}
        {/* end description */}

        {/*dropzon to add photo*/}
        <label className="block text-gray-500 text-sm font-medium mb-2 mt-4">
        Upload Photo</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-12 rounded-lg cursor-pointer transition-all 
            ${isDragActive ? "border-primary bg-primary/10" : "border-gray-600"} ${error.selectedImage ? "border-red-400": "border-gray-600"}`} 
        >
          <input {...getInputProps()} />
          {files ? (
            <div className="relative w-full">
              <Image 
              src={files.preview} 
              className="w-full h-40 object-cover rounded-lg" 
              width={800}
              height={400}
              alt="Uploaded File" />
              {/* زر الحذف */}
              <button
                type="button"
                onClick={(e)=>{
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudArrowUpIcon
                className={`h-12 w-12 transition-colors ${isDragActive ? "text-primary" : "text-primary/40"}`}
              />
              <p className={`text-sm mt-2 transition-colors ${isDragActive ? "text-primary" : "text-gray-400"}`}>
                {isDragActive ? "Drop the file here..." : (
                  <>
                    <span className="text-primary">Click to upload</span>
                    {" or drag and drop"}
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                SVG, PNG or JPG (max. 800 x 400px)
              </p>
            </div>
          )}
          
        </div>
        {error.selectedImage && (
          <p className="text-red-400 mt-1">{error.selectedImage}</p>
          )}
        {/*end dropzon to add photo*/}
        {/*Publish Button*/}
        {loading ? (<div className="flex justify-center mt-6">
          <button 
            className="text-sm cursor-pointer text-primary bg-primary/20 py-2.5 px-4 rounded-full "
          >
            <Spiner/>
          </button>
        </div>):(<div className="flex justify-center mt-6">
          <button 
            type="submit" 
            className="text-sm cursor-pointer text-primary bg-primary/20 py-2.5 px-4 rounded-full hover:bg-primary/30 transition-colors"
          >
            Publish Poll
          </button>
        </div>)}
      </form>
    </div>
  );
}

export default CreatePoll;
