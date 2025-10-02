import { useState } from 'react';

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-4">Dictionnaire Interactif</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recherchez parmi 10,000+ mots en 6 langues camerounaises
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un mot... (ex: bonjour, merci)"
              className="input pl-12 text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="badge-primary text-sm px-4 py-2">Toutes les langues</button>
            <button className="badge bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2">Ewondo</button>
            <button className="badge bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2">Duala</button>
            <button className="badge bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2">Fulfulde</button>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4">
          {/* Sample Word Card */}
          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Bonjour
                  </h3>
                  <span className="badge-secondary text-xs">Salutation</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20">Ewondo:</span>
                    <span className="text-lg font-medium text-primary-600">Mbolo</span>
                    <span className="text-sm text-gray-500 italic">mm-BOH-loh</span>
                    <button className="text-primary-600 hover:text-primary-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20">Duala:</span>
                    <span className="text-lg font-medium text-primary-600">Mwa boma</span>
                    <span className="text-sm text-gray-500 italic">mwah BOH-mah</span>
                    <button className="text-primary-600 hover:text-primary-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <button className="text-yellow-500 hover:text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>
          </div>

          {/* More sample cards */}
          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Merci
                  </h3>
                  <span className="badge-secondary text-xs">Salutation</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20">Ewondo:</span>
                    <span className="text-lg font-medium text-primary-600">Akiba</span>
                    <span className="text-sm text-gray-500 italic">ah-KEE-bah</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20">Duala:</span>
                    <span className="text-lg font-medium text-primary-600">Masa</span>
                    <span className="text-sm text-gray-500 italic">MAH-sah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State or Loading */}
          {searchTerm && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Recherche en cours... Fonctionnalité complète à venir
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
