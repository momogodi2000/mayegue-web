import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx('input', props.className)} />;
}


