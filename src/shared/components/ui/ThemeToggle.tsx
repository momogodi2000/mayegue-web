import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme, Theme } from '@/shared/hooks/useTheme';
import { Menu } from '@headlessui/react';
import { Fragment } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: typeof SunIcon }[] = [
    { value: 'light', label: 'Clair', icon: SunIcon },
    { value: 'dark', label: 'Sombre', icon: MoonIcon },
    { value: 'system', label: 'Système', icon: ComputerDesktopIcon },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Changer le thème"
      >
        <CurrentIcon className="h-5 w-5" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="p-1">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <Menu.Item key={themeOption.value} as={Fragment}>
                {({ active }) => (
                  <button
                    onClick={() => setTheme(themeOption.value)}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } ${
                      theme === themeOption.value
                        ? 'text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-200'
                    } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors`}
                  >
                    <Icon className="h-5 w-5" />
                    {themeOption.label}
                    {theme === themeOption.value && (
                      <svg
                        className="ml-auto h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </div>
      </Menu.Items>
    </Menu>
  );
}
