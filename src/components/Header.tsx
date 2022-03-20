import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';

import { useEagerConnect, useInactiveListener } from '@/dapp/hooks';
import { injected, connectorLocalStorageKey } from '@/dapp/connectors';
import { SearchOutlined } from '@ant-design/icons';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';

export default function Header() {
  const { connector, account, chainId, activate, deactivate } = useActiveWeb3React();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  const getAccount = useMemo(() => {
    if (account) {
      return account.substring(0, 6) + '...' + account.substring(account.length - 12, account.length);
    }
    return '';
  }, [account]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <img src="/imgaes/logo.png" alt="" className="w-12 h-12" />
        </div>

        <div>
          {account ? (
            <Button
              onClick={() => {
                deactivate();
                localStorage.setItem(connectorLocalStorageKey, '');
              }}
              type="primary"
              icon={<SearchOutlined />}
            >
              {getAccount}
            </Button>
          ) : (
            <Button
              onClick={() => {
                activate(injected);
                localStorage.setItem(connectorLocalStorageKey, String(chainId));
              }}
              type="primary"
              icon={<SearchOutlined />}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
