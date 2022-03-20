import { useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { simpleRpcProvider } from '../utils/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { library, chainId, ...web3React } = useWeb3React();
  const refEth = useRef(library);
  const defaultChainId = chainId ?? parseInt('4', 10);
  const [provider, setProvider] = useState(library || simpleRpcProvider(defaultChainId));
  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || simpleRpcProvider(defaultChainId));
      refEth.current = library;
    }
  }, [library]);

  return { library: provider, chainId: defaultChainId, ...web3React };
};

export default useActiveWeb3React;
