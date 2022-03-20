import { ChainId } from '@/config/constants/chainId';
const RPC = {
  [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/13ab66893f804b6684194366db26efc3',
  [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/13ab66893f804b6684194366db26efc3',
  [ChainId.Kovan]: 'https://kovan.infura.io/v3/13ab66893f804b6684194366db26efc3',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSCTestnet]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
};

export default RPC;
