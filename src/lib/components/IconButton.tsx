import s from './IconButton.module.css';
import * as React from 'react';

export type IconButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
};

export function IconButton({ children, onClick }: IconButtonProps) {
  const internalOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    },
    [onClick],
  );

  return (
    <button className={s.iconBtn} onClick={internalOnClick}>
      {children}
    </button>
  );
}
