import { StaticJsonRpcProvider } from '@ethersproject/providers';
import RPC from './rpc';
import { useWeb3React } from '@web3-react/core';
import { ChainId } from '@/config/constants/chainId';
import { useEffect, useState, useRef } from 'react';

// import getRpcUrl from 'utils/getRpcUrl'

// const RPC_URL = getRpcUrl()
const RPC_URL = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

const getRpcUrl = (chainId) => {
  return new StaticJsonRpcProvider(RPC[chainId] ? RPC[chainId] : RPC[ChainId.Rinkeby]);
};
// export const simpleRpcProvider = useGetRpcUrl();
export const simpleRpcProvider = getRpcUrl;

export default null;
