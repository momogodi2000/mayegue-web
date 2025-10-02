import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

export function Button({ className, variant = 'primary', isLoading, children, ...rest }: Props) {
  const base = 'btn';
  const variants: Record<Variant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...rest}>
      {isLoading ? '...' : children}
    </button>
  );
}


