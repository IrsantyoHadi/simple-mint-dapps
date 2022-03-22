import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import NFT from '../../artifacts/contracts/ProjectXNFT.sol/ProjectX.json';
import { nftaddress } from '../../config';

interface App {
  isConnect: boolean;
  signer: ethers.providers.JsonRpcSigner;
}

const Home: NextPage<App> = (props) => {
  const { isConnect, signer } = props;
  const [mint, setMint] = useState(1);
  const totalCollection = 5000;

  useEffect(() => {
    if (isConnect && signer) {
      checkMinted();
    }
  }, [isConnect, signer]);

  const checkMinted = async () => {
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const totalSupply = await nftContract.totalSupply();
    setMint(totalSupply.toNumber());
  };

  const renderCard = () => (
    <div className='flex  flex-col block p-6 rounded-lg shadow-lg bg-white max-w-sm'>
      <h5 className='text-center text-gray-900 text-xl leading-tight font-medium mb-2'>Current Mint</h5>
      <h5 className='text-center text-gray-900 text-xl leading-tight font-medium mb-2'>
        {mint} / {totalCollection}{' '}
      </h5>
      <div className='flex self-center mb-2'>
        <button
          type='button'
          className='text-center w-12 mr-3 py-2.5 text-black border-slate-600 border-2 font-bold text-xl leading-tight uppercase rounded shadow-md hover:shadow-lg transition duration-150 ease-in-out'
        >
          -
        </button>
        <input
          type='text'
          className='
              form-control
              block
              w-12
              h-12
              px-4
              py-2
              text-xl
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            '
        />
        <button
          type='button'
          className='text-center w-12 ml-3 py-2.5 text-black border-slate-600 border-2 font-bold text-xl leading-tight uppercase rounded shadow-md hover:shadow-lg transition duration-150 ease-in-out'
        >
          +
        </button>
      </div>
      <button
        disabled={!isConnect}
        onClick={() => console.log('masuk')}
        type='button'
        className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
      >
        Mint
      </button>
    </div>
  );

  return (
    <div className='flex h-screen'>
      <div className='flex flex-col justify-center items-center mx-auto mt-24 w-96 h-96 rounded border-2'>
        {renderCard()}
      </div>
    </div>
  );
};

export default Home;
