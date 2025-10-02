import { ReactNode, useState } from 'react';

interface Tab {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

interface Props {
  tabs: Tab[];
  defaultKey?: string;
}

export function Tabs({ tabs, defaultKey }: Props) {
  const [active, setActive] = useState(defaultKey || tabs[0]?.key);
  const current = tabs.find(t => t.key === active) || tabs[0];
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 -mb-px ${active === t.key ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{current?.content}</div>
    </div>
  );
}


