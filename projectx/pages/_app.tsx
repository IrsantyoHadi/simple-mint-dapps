import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useState } from 'react';

import { activeChainId, activeChainName, activeRpcURL } from '../../config';

function MyApp({ Component, pageProps }: AppProps) {
  const [isConnect, setIsConnect] = useState(false);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);

  const onConnect = async () => {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    if (address) {
      setIsConnect(true);
      setSigner(signer);
    }

    const { chainId } = await provider.getNetwork();
    if (chainId != activeChainId) {
      const ethereum = window.ethereum;
      try {
        await ethereum.request({
          jsonrpc: '2.0',
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(activeChainId) }],
        });
      } catch (error) {
        console.log(error, 'ini ada error ga ke switch');
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ethers.utils.hexValue(activeChainId),
              chainName: activeChainName,
              rpcUrls: [activeRpcURL] /* ... */,
            },
          ],
        });
      }
    }
  };

  const renderHeader = () => (
    <nav className='absolute w-full flex flex-wrap items-center justify-between py-3 bg-gray-900 text-gray-200 shadow-lg navbar navbar-expand-lg navbar-light'>
      <div className='container-fluid w-full flex flex-wrap items-center justify-between px-6'>
        <div className='flex w-full justify-between'>
          <a className='text-xl text-white'>Project X</a>
          <button
            onClick={onConnect}
            type='button'
            className=' inline-block px-6 py-2.5 bg-sky-50 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-sky-100 hover:shadow-lg focus:bg-sky-100 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
          >
            {!isConnect ? 'Connect Wallet' : 'Connected'}
          </button>
        </div>
      </div>
    </nav>
  );
  return (
    <>
      {renderHeader()}
      <Component {...pageProps} isConnect={isConnect} signer={signer} />
    </>
  );
}

export default MyApp;
