/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tighter uppercase italic">Unblocked.</span>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm"
            />
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/60">
            <a href="#" className="hover:text-orange-500 transition-colors">Trending</a>
            <a href="#" className="hover:text-orange-500 transition-colors">New</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Categories</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                  Play Anything. <br />
                  <span className="text-orange-500">Anywhere.</span>
                </h1>
                <p className="text-white/40 max-w-xl text-sm sm:text-base">
                  A curated collection of the best unblocked games. No downloads, no blocks, just pure fun directly in your browser.
                </p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layoutId={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group relative aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">{game.title}</h3>
                          <p className="text-white/60 text-xs line-clamp-1">{game.description}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40">No games found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-0' : ''}`}
            >
              <div className={`flex items-center justify-between ${isFullscreen ? 'p-4 bg-black/80 backdrop-blur-md border-b border-white/10' : ''}`}>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-bold uppercase tracking-widest">Back to Library</span>
                </button>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className={`relative flex-1 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/10 ${isFullscreen ? 'rounded-none border-none' : 'aspect-video'}`}>
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="fullscreen"
                />
              </div>

              {!isFullscreen && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{selectedGame.title}</h2>
                    <p className="text-white/60 text-sm max-w-2xl">{selectedGame.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Developer</p>
                      <p className="text-sm font-medium">Web Community</p>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden sm:block" />
                    <button className="px-6 py-3 bg-orange-500 text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform">
                      Favorite
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-white/10 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <Gamepad2 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tighter uppercase italic">Unblocked.</span>
            </div>
            <p className="text-white/40 text-sm max-w-sm">
              The ultimate destination for unblocked web games. Play your favorite classics and discover new gems without any restrictions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500">Links</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">All Games</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DMCA</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          © 2026 Unblocked Games Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
