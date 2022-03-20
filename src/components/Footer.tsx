import React, { useEffect, useMemo, useState } from 'react';
import copy from 'copy-to-clipboard';
import { message } from 'antd';

export default function Footer() {
  return (
    <div className="text-center  pb-4 font-bold">
      <div className="break-all px-4">
        <span>捐赠地址:</span> <span className="text-red-500">0x742606C36817f6BeB1eD806838E57217260dF9F3</span>
        <span
          className="cursor-pointer"
          onClick={() => {
            copy('0x742606C36817f6BeB1eD806838E57217260dF9F3');
            message.success('复制成功，感谢老板');
          }}
        >
          复制
        </span>
      </div>
      <div className="text-2xl"> Make By Sexy-J</div>
    </div>
  );
}
