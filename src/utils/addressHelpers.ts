import addresses from '@/config/constants/contracts';
import defaultChainId from '@/config/constants/defaultChainId';
import { Address } from '@/config/constants/types';

export const getAddress = (address: Address, chainId: number): string => {
  return address[chainId] ? address[chainId] : address[defaultChainId];
};

export const getMultiTransferAddress = (chainId) => {
  return getAddress(addresses.multiTransfer, chainId);
};
