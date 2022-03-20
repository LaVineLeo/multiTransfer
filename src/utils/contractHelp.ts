import type { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { simpleRpcProvider } from './providers';

// Addresses
import { getAddress, getMultiTransferAddress } from '@/utils/addressHelpers';

import bep20Abi from '@/config/abi/erc20.json';
import bep20TransferAbi from '@/config/abi/erc20Transfer.json';

// Types
import { Erc20, Erc20Transfer } from '@/config/abi/types';

const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
  // const defaultChainId = chainId ?? parseInt('4', 10);

  const signerOrProvider = signer ?? simpleRpcProvider(4);
  return new Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(bep20Abi, address, signer) as Erc20;
};

export const getBep20TransferContract = (chainId: number | undefined, signer?: Signer | Provider) => {
  return getContract(bep20TransferAbi, getMultiTransferAddress(chainId), signer) as Erc20Transfer;
};
