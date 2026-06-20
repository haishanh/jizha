'use client';

import { IconButton } from '@/lib/components/IconButton';
import { CopyIcon, CheckIcon } from '@phosphor-icons/react';
import * as React from 'react';

const { useCallback, useState } = React;

type CopyButtonProps = {
  provideContent(): string;
};

export function CopyButton({ provideContent }: CopyButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isCopying) return;

      setIsCopying(true);
      e.preventDefault();

      import('copy-text-to-clipboard').then((mod) => {
        const copy = mod.default;
        copy(provideContent());
      });

      setTimeout(() => setIsCopying(false), 3000);
    },
    [provideContent, isCopying],
  );

  return (
    <IconButton onClick={onClick}>
      {isCopying ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      <span className="sr-only">Copy</span>
    </IconButton>
  );
}
