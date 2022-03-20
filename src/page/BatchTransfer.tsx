import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Select, Input, Slider, Table, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useERC20, useBep20TransferContract } from '../hooks/useContract';
import { getBalanceNumber, getDecimalAmount, formatBigNumberToFixed } from '@/utils/formatBalance';
import BigNumber from 'bignumber.js';
import { BIG_ZERO } from '@/utils/bigNumber';
import { ethersToBigNumber } from '@/utils/bigNumber';
import { getMultiTransferAddress } from '@/utils/addressHelpers';
import { MaxUint256 } from '@ethersproject/constants';
import { utils } from 'ethers';
import DEFAULT_TOKEN_LIST from '@/config/tokens';
import { Token } from '@/config/constants/types';
import { isEth } from '@/utils/isEth';
import { NATIVE } from '@/config/constants/native';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { isAddress } from '@/utils/address';
import { Erc20 } from '@/config/abi/types';
const { Option } = Select;
const { TextArea } = Input;
interface ISetInfo {
  amount: string;
  token: Token;
  addressList: string[];
  addressInput: string;
  tokenList: Token[];
  setAmount: (amount: string) => void;
  setToken: (token: Token) => void;
  setAddressList: (addressList: string[]) => void;
  setStep: (step: number) => void;
  setTokenList: (tokenList: Token[]) => void;
  setAddressInput?: (addressInput: string) => void;
}
interface ITransferDetail {
  amount: string;
  token: Token;
  addressList: string[];
  setAddressList: (addressList: string[]) => void;
  setStep: (step: number) => void;
  setAddressInput?: (addressInput: string) => void;
}
function SetInfo(prop: ISetInfo) {
  const { account, chainId } = useActiveWeb3React();
  const { amount, addressList, token, setAmount, setToken, tokenList, addressInput, setAddressInput, setTokenList, setAddressList, setStep } = prop;

  const [searchValue, setSearchValue] = useState<string>('');

  const address = useMemo(() => {
    return isAddress(searchValue) ? searchValue : '';
  }, [searchValue]);

  const bep20Contract = useERC20(address, false);

  useEffect(() => {
    const getErc20Info = async () => {
      if (bep20Contract as Erc20) {
        try {
          const index = tokenList.findIndex((item) => item.address === isAddress(searchValue));
          if (index !== -1) {
            return;
          }
          const symbol = await bep20Contract.symbol();
          const name = await bep20Contract.name();
          const decimals = await bep20Contract.decimals();
          const token = { symbol, name, decimals: decimals.toString(), address, chainId };
          setTokenList([...tokenList, token]);
        } catch (e) {
          // setTokenList(tokenList);
        }
      }
    };
    getErc20Info();
  }, [bep20Contract]);

  const errAddressList = useMemo(() => {
    const err = [];
    addressList.forEach((item, index) => {
      if (isAddress(item) !== item && item !== '') {
        err.push({ address: item, index });
      }
    });
    return err.length ? (
      <div className="border rounded-md border-red-500 text-red-500 mt-4 px-4 py-2">
        {err.map((item) => {
          return (
            <div key={item.index} className="">
              <div>
                第{item.index + 1}行 {item.address} 不是一个有效的钱包地址
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      ''
    );
  }, [addressList]);

  return (
    <div>
      <div className="flex text-primary ">
        <div className="flex-1  overflow-hidden">
          <div className="text-primary font-bold py-4">选择代币</div>
          <Select
            bordered={false}
            size="large"
            showSearch
            optionLabelProp="children"
            dropdownClassName="flex-1 px-4"
            filterOption={(e, currentItem) => {
              const token = tokenList.find((item) => item.address === currentItem.value);
              const searchValue = e.toLocaleLowerCase();
              if (
                token.symbol.toLocaleLowerCase().includes(searchValue) ||
                token.name.toLocaleLowerCase().includes(searchValue) ||
                token.address.toLocaleLowerCase().includes(searchValue)
              ) {
                return true;
              }
              return false;
            }}
            onSearch={(e) => {
              //
              setSearchValue(e);
            }}
            placeholder="请选择"
            value={{ value: token.address }}
            className="bg-gray-100 w-full"
            onChange={(address: any) => {
              setToken(tokenList.find((item) => item.address === address));
            }}
          >
            {tokenList.length &&
              tokenList.map((item, index) => {
                return (
                  <Option key={item.address + item.name + item.symbol} value={item.address}>
                    <div className="">
                      <span className="token-symbol">{item.symbol}</span> <span className="char">-</span>
                      {item.address ? item.address : item.name}
                    </div>
                  </Option>
                );
              })}
          </Select>
        </div>
        <div className="w-16 ml-4">
          <div className="py-4 font-bold">位数</div>
          <div className="p-2 text-base bg-gray-100">{token.decimals}</div>
        </div>
      </div>
      <div>
        <div className="py-4 font-bold">收币地址</div>
        <div className="flex bg-gray-100 text-sm">
          <div className="py-1 px-4">
            {addressList.length
              ? addressList.map((item, index) => {
                  return <div key={index}>{index + 1}</div>;
                })
              : 1}
          </div>
          <TextArea
            className="text-sm"
            bordered={false}
            value={addressInput}
            onChange={(e) => {
              setAddressInput(e.target.value);
              if (e.target.value == '') {
                setAddressList([]);
                return;
              }
              const addressList = e.target.value.split('\n');
              setAddressList(addressList);
            }}
            rows={4}
          />
        </div>
      </div>
      {errAddressList}

      <div className="">
        <div className="my-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4  font-bold">每个地址发送</div>
            <Input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="bg-gray-100"
              style={{ width: '100px' }}
              bordered={false}
            />
            <div className="ml-2 font-bold">{token.symbol}</div>
          </div>
          <div
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              setAddressInput('0x742606C36817f6BeB1eD806838E57217260dF9F3');
              setAddressList(['0x742606C36817f6BeB1eD806838E57217260dF9F3']);
            }}
          >
            查看例子
          </div>
        </div>
      </div>

      <Button
        type="primary"
        onClick={() => {
          if (!account) {
            message.error('请先连接钱包');
            return;
          }
          setStep(1);
        }}
      >
        下一步
      </Button>
    </div>
  );
}

function TransferDetail(prop: ITransferDetail) {
  const { account, library, chainId } = useActiveWeb3React();
  const { amount, addressList, token, setAddressList, setAddressInput, setStep } = prop;

  const [gasFee, setGasFee] = useState<string>('0');
  const [isApproved, setIsApproved] = useState<boolean>(isEth(token, chainId) ? true : false);
  const [bnbBalance, setBalance] = useState<BigNumber>(BIG_ZERO);
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BIG_ZERO);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const bep20Contract = useERC20(token.address);
  const bep20TransferContract = useBep20TransferContract();

  useEffect(() => {
    const estimateGas = async () => {
      try {
        const tokenAmount = getDecimalAmount(new BigNumber(amount), token.decimals);
        const ethAmount = tokenAmount.times(filterAddress.length);
        if (isEth(token, chainId)) {
          const _gasFee = await bep20TransferContract.estimateGas.batch_transfer_bnb(filterAddress, tokenAmount.toString(), {
            value: ethAmount.toString(),
          });
          setGasFee(formatBigNumberToFixed(_gasFee, 6, 9));
        } else {
          if (isApproved) {
            const _gasFee = await bep20TransferContract.estimateGas.batch_transfer(token.address, filterAddress, tokenAmount.toString());
            setGasFee(formatBigNumberToFixed(_gasFee, 6, 9));
          }
        }
        setErrorMessage('');
      } catch (callError: any) {
        setErrorMessage(callError.error?.message || callError.reason || callError.data?.message || callError.message);
      }
    };
    estimateGas();
  }, [addressList, isApproved]);

  // 转账地址列表
  const filterAddress = useMemo(() => {
    return addressList.filter((item) => {
      return item !== '';
    });
  }, [addressList]);

  // 表格详情
  const getTransferList = useMemo(() => {
    return filterAddress.map((item, index) => {
      return { to: item, amount, ...token, key: index };
    });
  }, [filterAddress]);

  const columns = [
    {
      title: '钱包地址',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      render: (amount: any, record: any) => (
        <div>
          {amount} {record.symbol}
        </div>
      ),
    },
    {
      width: '20%',
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Button
          danger
          onClick={() => {
            const _addressList = [...addressList];
            _addressList.splice(record.key, 1);
            setAddressList(_addressList);
            setAddressInput(_addressList.join('\n'));
          }}
        >
          移除
        </Button>
      ),
    },
  ];
  const getBalance = async () => {
    const balance = await library.getBalance(account);

    setBalance(ethersToBigNumber(balance));
    if (isEth(token, chainId)) {
      const tokenBalance = balance;
      setTokenBalance(ethersToBigNumber(tokenBalance));
    } else {
      const tokenBalance = await bep20Contract.balanceOf(account);
      setTokenBalance(ethersToBigNumber(tokenBalance));
    }
  };
  const getAllowance = async () => {
    if (isEth(token, chainId)) {
      return;
    }
    const response = await bep20Contract.allowance(account, getMultiTransferAddress(chainId));
    const currentAllowance = ethersToBigNumber(response);
    setIsApproved(currentAllowance.gt(0));
  };
  useEffect(() => {
    if (!account) {
      return;
    }

    getBalance();
    getAllowance();
  }, [token, account]);

  const getAllAmount = useMemo(() => {
    return new BigNumber(getTransferList.length).times(amount).toString();
  }, [getTransferList]);

  return (
    <div>
      <div className="overflow-x-hidden">
        <div className="py-4 font-bold">地址列表</div>
        <Table columns={columns} dataSource={getTransferList} pagination={false} scroll={{ y: 300 }} />
      </div>
      <div>
        <div className="py-4 font-bold">摘要</div>
        <div className="bg-gray-100 flex flex-wrap ">
          <div className="w-3/6 p-4">
            <div>{getTransferList.length}</div>
            <div>地址总数</div>
          </div>
          <div className="w-3/6 p-4">
            <div>
              {getAllAmount} {token.symbol}
            </div>
            <div>代币发送总数</div>
          </div>
          <div className="w-3/6 p-4">
            <div>{getTransferList.length}</div>
            <div>交易总数</div>
          </div>
          <div className="w-3/6 p-4">
            <div>
              {getBalanceNumber(tokenBalance, token.decimals).toFixed(6)} {token.symbol}
            </div>
            <div>代币余额</div>
          </div>
          <div className="w-3/6 p-4">
            <div>
              {gasFee} {NATIVE[chainId]?.symbol}
            </div>
            <div>预估手续费</div>
          </div>
          <div className="w-3/6 p-4">
            <div>
              {getBalanceNumber(bnbBalance).toFixed(6)} {NATIVE[chainId]?.symbol}
            </div>
            <div>您的余额</div>
          </div>
        </div>
      </div>
      <div className="text-red-400">{errorMessage}</div>
      <div className="flex mt-4">
        <Button
          type="primary"
          onClick={() => {
            setStep(0);
          }}
          className="mr-4"
          icon={<ArrowLeftOutlined />}
        />

        {isApproved ? (
          <Button
            type="primary"
            loading={loading}
            onClick={async () => {
              try {
                let tx;
                setLoading(true);
                const tokenAmount = getDecimalAmount(new BigNumber(amount), token.decimals);
                const ethAmount = tokenAmount.times(filterAddress.length);
                if (isEth(token, chainId)) {
                  tx = await bep20TransferContract.batch_transfer_bnb(filterAddress, tokenAmount.toString(), {
                    value: ethAmount.toString(),
                  });
                } else {
                  tx = await bep20TransferContract.batch_transfer(token.address, filterAddress, tokenAmount.toString());
                }
                await tx.wait();
                setLoading(false);
                getBalance();
                message.success('转账成功');
              } catch (callError: any) {
                message.error(callError.reason || callError.data?.message || callError.message);
                setLoading(false);
              }
            }}
          >
            发送
          </Button>
        ) : (
          <Button
            type="primary"
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                const tx = await bep20Contract.approve(getMultiTransferAddress(chainId), MaxUint256);
                const receipt = await tx.wait();
                setLoading(false);
                getBalance();
                getAllowance();
                message.success('授权成功');
              } catch (callError: any) {
                message.error(callError.reason || callError.data?.message || callError.message);
                setLoading(false);
              }
            }}
          >
            授权
          </Button>
        )}
      </div>
    </div>
  );
}

export default function BatchTransfer() {
  const { chainId } = useActiveWeb3React();
  const [setp, setStep] = useState<number>(0);
  const [amount, setAmount] = useState<string>('1');
  const [addressList, setAddressList] = useState<string[]>([]);
  const [addressInput, setAddressInput] = useState<string>('');
  const [token, setToken] = useState<Token>({ address: '', name: '', symbol: '', decimals: 18, chainId });
  const [tokenList, setTokenList] = useState<Token[]>([]);

  const handleAmount = (amount: string) => {
    setAmount(amount);
  };
  const handleToken = (token: Token) => {
    setToken(token);
  };
  const handleAddressList = (addressList: string[]) => {
    setAddressList(addressList);
  };

  const handleTokenList = (tokenList: Token[]) => {
    setTokenList(tokenList);
  };
  const handleStep = (step: number) => {
    setStep(step);
  };
  const handleAddressInput = (addressInput: string) => {
    setAddressInput(addressInput);
  };

  useEffect(() => {
    setStep(0);
    if (DEFAULT_TOKEN_LIST[chainId]) {
      let _tokenList = [...DEFAULT_TOKEN_LIST[chainId]];
      _tokenList.sort((t1, t2) => {
        return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
      });
      _tokenList = [NATIVE[chainId], ..._tokenList];
      setTokenList(_tokenList);
      setToken(NATIVE[chainId]);
    } else {
      setTokenList([]);
      setToken({ address: '', name: '', symbol: '', decimals: 18, chainId: chainId });
    }
  }, [chainId]);
  return (
    <div className="text-primary bg-white mx-auto max-w-900  p-4 my-6" style={{ width: '90%' }}>
      <div className="text-red-500">本批量转账仅支持BSC,BSC-TEST,RINKEBY,KOVAN网络 前端 合约 代码都已开源</div>
      <div className="text-red-500 mb-4">转账不收取额外手续费 支持自定义币种转账 输入合约地址即可 </div>
      <div className="text-base text-primary font-bold">批量发送代币</div>
      {setp == 0 ? (
        <SetInfo
          amount={amount}
          token={token}
          tokenList={tokenList}
          addressList={addressList}
          addressInput={addressInput}
          setAddressInput={handleAddressInput}
          setAmount={handleAmount}
          setToken={handleToken}
          setAddressList={handleAddressList}
          setTokenList={handleTokenList}
          setStep={handleStep}
        />
      ) : (
        <TransferDetail
          amount={amount}
          token={token}
          addressList={addressList}
          setAddressInput={handleAddressInput}
          setAddressList={handleAddressList}
          setStep={handleStep}
        />
      )}
    </div>
  );
}
