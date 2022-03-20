import rinkeby from './rinkeby.json';
import kovan from './kovan.json';
import bscTestnet from './bsc-testnet.json';
import bsc from './bsc.json';
import { ChainId } from '../constants/chainId';
import { Token } from '@/config/constants/types';

type TokenList = { [chainId: number]: Token[] };

const TOKENLIST: TokenList = {
  [ChainId.BSC]: bsc,
  [ChainId.Rinkeby]: rinkeby,
  [ChainId.Kovan]: kovan,
  [ChainId.BSCTestnet]: bscTestnet,
};

export default TOKENLIST;
