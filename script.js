let games = [];
let selectedGame = null;
let searchQuery = '';
let isFullscreen = false;

const mainContent = document.getElementById('main-content');
const searchInput = document.getElementById('search-input');
const logo = document.getElementById('logo');

// Fetch games from JSON
async function init() {
    try {
        const response = await fetch('./games.json');
        games = await response.json();
        render();
    } catch (error) {
        console.error('Error loading games:', error);
        mainContent.innerHTML = `<p class="text-center py-20 text-white/40">Failed to load games library.</p>`;
    }
}

function render() {
    if (selectedGame) {
        renderPlayer();
    } else {
        renderGrid();
    }
}

function renderGrid() {
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let html = `
        <div class="space-y-8">
            <header class="space-y-2">
                <h1 class="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                    Play Anything. <br />
                    <span class="text-orange-500">Anywhere.</span>
                </h1>
                <p class="text-white/40 max-w-xl text-sm sm:text-base">
                    A curated collection of the best unblocked games. No downloads, no blocks, just pure fun directly in your browser.
                </p>
            </header>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filteredGames.map(game => `
                    <div 
                        onclick="selectGame('${game.id}')"
                        class="group relative aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <img
                            src="${game.thumbnail}"
                            alt="${game.title}"
                            class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                            referrerpolicy="no-referrer"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                        <div class="absolute bottom-0 left-0 p-6 w-full">
                            <div class="flex items-center justify-between gap-2">
                                <div>
                                    <h3 class="text-xl font-bold tracking-tight">${game.title}</h3>
                                    <p class="text-white/60 text-xs line-clamp-1">${game.description}</p>
                                </div>
                                <div class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${filteredGames.length === 0 ? `
                <div class="py-20 text-center space-y-4">
                    <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 text-white/20" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <p class="text-white/40">No games found matching "${searchQuery}"</p>
                </div>
            ` : ''}
        </div>
    `;
    mainContent.innerHTML = html;
}

function renderPlayer() {
    const game = selectedGame;
    mainContent.innerHTML = `
        <div class="flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-0' : ''}">
            <div class="flex items-center justify-between ${isFullscreen ? 'p-4 bg-black/80 backdrop-blur-md border-b border-white/10' : ''}">
                <button 
                    onclick="closeGame()"
                    class="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    <span class="text-sm font-bold uppercase tracking-widest">Back to Library</span>
                </button>

                <div class="flex items-center gap-2">
                    <button 
                        onclick="toggleFullscreen()"
                        class="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                        title="Toggle Fullscreen"
                    >
                        ${isFullscreen ? 
                            `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>` : 
                            `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`
                        }
                    </button>
                </div>
            </div>

            <div class="relative flex-1 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/10 ${isFullscreen ? 'rounded-none border-none h-full' : 'aspect-video'}">
                <iframe
                    src="${game.iframeUrl}"
                    class="w-full h-full border-none"
                    title="${game.title}"
                    allow="fullscreen"
                ></iframe>
            </div>

            ${!isFullscreen ? `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div class="space-y-1">
                        <h2 class="text-2xl font-bold tracking-tight">${game.title}</h2>
                        <p class="text-white/60 text-sm max-w-2xl">${game.description}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right hidden sm:block">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-white/40">Developer</p>
                            <p class="text-sm font-medium">Web Community</p>
                        </div>
                        <div class="w-px h-8 bg-white/10 hidden sm:block"></div>
                        <button class="px-6 py-3 bg-orange-500 text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform">
                            Favorite
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Global functions for HTML events
window.selectGame = (id) => {
    selectedGame = games.find(g => g.id === id);
    render();
    window.scrollTo(0, 0);
};

window.closeGame = () => {
    selectedGame = null;
    isFullscreen = false;
    render();
};

window.toggleFullscreen = () => {
    isFullscreen = !isFullscreen;
    render();
};

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (!selectedGame) renderGrid();
});

logo.addEventListener('click', () => {
    selectedGame = null;
    renderGrid();
});

// Start the app
init();
