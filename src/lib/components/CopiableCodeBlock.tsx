'use client';

import s from './CopiableCodeBlock.module.css';
import { CopyButton } from '@/lib/components/CopyButton';
import * as React from 'react';

export function CopiableCodeBlock({ cnt }: { cnt: string }) {
  return (
    <div className={s.CopiableExample}>
      <pre className={s.pre}>
        <code>{cnt}</code>
      </pre>
      <span className={s.copyBtn}>
        <CopyButton provideContent={() => cnt} />
      </span>
    </div>
  );
}
