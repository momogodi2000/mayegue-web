import { useState, ReactNode } from 'react';

interface Props {
  label: ReactNode;
  children: ReactNode;
}

export function Dropdown({ label, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="btn-ghost" onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 card py-2 z-40">
          {children}
        </div>
      )}
    </div>
  );
}


