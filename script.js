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

    // Featured games are the ones the user specifically asked for
    const featuredIds = ['basketball-stars', 'slope'];
    const featuredGames = games.filter(g => featuredIds.includes(g.id));

    let html = `
        <div class="space-y-12">
            <header class="space-y-4">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    Live Portal
                </div>
                <h1 class="text-5xl sm:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                    Play <span class="text-orange-500">Anything.</span> <br />
                    Anywhere.
                </h1>
                <p class="text-white/40 max-w-xl text-sm sm:text-lg font-medium leading-relaxed">
                    The ultimate collection for Math Revision. No downloads, no blocks, just pure performance directly in your browser.
                </p>
            </header>

            ${!searchQuery && featuredGames.length > 0 ? `
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xs font-black uppercase tracking-[0.3em] text-white/40">Featured Experience</h2>
                        <div class="h-px flex-1 bg-white/5 mx-6"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${featuredGames.map(game => `
                            <div 
                                onclick="selectGame('${game.id}')"
                                class="group relative aspect-[16/9] bg-[#0a0a0a] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500 transition-all duration-500 hover:scale-[1.01] shadow-2xl hover:shadow-orange-500/10"
                            >
                                <img
                                    src="${game.thumbnail}"
                                    alt="${game.title}"
                                    class="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                    referrerpolicy="no-referrer"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div class="absolute inset-0 p-8 flex flex-col justify-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-0.5 rounded bg-orange-500 text-[10px] font-black text-black uppercase tracking-widest">Featured</span>
                                        <span class="text-white/40 text-[10px] font-bold uppercase tracking-widest">${game.type === 'native' ? 'Native Code' : 'Cloud Stream'}</span>
                                    </div>
                                    <h3 class="text-3xl font-black tracking-tighter uppercase italic text-white group-hover:text-orange-500 transition-colors">${game.title}</h3>
                                    <p class="text-white/60 text-sm font-medium line-clamp-2 max-w-md">${game.description}</p>
                                    <div class="mt-4 flex items-center gap-4">
                                        <div class="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full group-hover:bg-orange-500 transition-colors">Play Now</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            ` : ''}

            <section class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xs font-black uppercase tracking-[0.3em] text-white/40">${searchQuery ? 'Search Results' : 'All Games'}</h2>
                    <div class="h-px flex-1 bg-white/5 mx-6"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                        <p class="text-white/60 text-[10px] font-medium line-clamp-1 uppercase tracking-widest">${game.description}</p>
                                    </div>
                                    <div class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-colors shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            ${filteredGames.length === 0 ? `
                <div class="py-20 text-center space-y-4">
                    <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 text-white/20" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <p class="text-white/40 font-medium">No games found matching "${searchQuery}"</p>
                </div>
            ` : ''}
        </div>
    `;
    mainContent.innerHTML = html;
}

function renderPlayer() {
    const game = selectedGame;
    
    if (game.type === 'native' && game.id === 'snake-native') {
        renderSnakeGame();
        return;
    }

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
                    class="game-iframe w-full h-full border-none"
                    title="${game.title}"
                    id="game-area"
                    name="gameFrame"
                    scrolling="no"
                    frameborder="0"
                    allow="autoplay; fullscreen; camera; microphone; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write; web-share; accelerometer; magnetometer; gyroscope; display-capture"
                    sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads"
                    allowfullscreen="true"
                    data-wg-content="true"
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

// Snake Game Logic
let snakeInterval = null;
let snakeKeyHandler = null;

function renderSnakeGame() {
    const game = selectedGame;
    mainContent.innerHTML = `
        <div class="flex flex-col gap-6 max-w-4xl mx-auto">
            <div class="flex items-center justify-between">
                <button onclick="closeGame()" class="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    <span class="text-sm font-bold uppercase tracking-widest">Exit to Library</span>
                </button>
                <div class="flex items-center gap-8">
                    <div class="text-white/40 font-bold tracking-tighter text-xs uppercase tracking-[0.2em]">High Score: <span id="snake-highscore" class="text-white">0</span></div>
                    <div class="text-orange-500 font-black tracking-tighter text-2xl" id="snake-score">SCORE: 0</div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-3 relative aspect-square bg-[#050505] rounded-3xl border-8 border-white/5 overflow-hidden shadow-2xl shadow-orange-500/10">
                    <canvas id="snakeCanvas" width="600" height="600" class="w-full h-full"></canvas>
                    <div id="snake-overlay" class="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6 transition-all duration-500">
                        <div class="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center rotate-12 shadow-2xl shadow-orange-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m19 8-4 4 4 4"/><path d="M15 12H5"/><path d="M13 18H3"/><path d="M13 6H3"/></svg>
                        </div>
                        <div class="text-center space-y-2">
                            <h2 class="text-6xl font-black italic uppercase tracking-tighter text-white">Neon <span class="text-orange-500">Snake</span></h2>
                            <p class="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">Master the Grid</p>
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            <p class="text-white/60 text-sm font-medium">Use Arrow Keys or WASD to Navigate</p>
                            <button onclick="startSnake()" class="px-12 py-4 bg-orange-500 text-black font-black rounded-2xl hover:scale-110 hover:rotate-2 transition-all uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20">
                                Launch Game
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                        <h3 class="text-xs font-black uppercase tracking-widest text-orange-500">How to Play</h3>
                        <ul class="space-y-3 text-sm text-white/60">
                            <li class="flex items-start gap-3">
                                <span class="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">01</span>
                                <span>Eat the <span class="text-orange-500 font-bold">Orange Orbs</span> to grow and score.</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">02</span>
                                <span>Avoid hitting the <span class="text-white font-bold">Walls</span> or yourself.</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">03</span>
                                <span>Speed increases as you score higher.</span>
                            </li>
                        </ul>
                    </div>

                    <div class="p-6 bg-orange-500/10 rounded-3xl border border-orange-500/20">
                        <p class="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">Status</p>
                        <p class="text-sm font-bold text-white">Native Performance</p>
                        <div class="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full w-full bg-orange-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load high score
    const highScore = localStorage.getItem('snake-highscore') || 0;
    document.getElementById('snake-highscore').innerText = highScore;
}

function startSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('snake-overlay');
    const scoreEl = document.getElementById('snake-score');
    const highScoreEl = document.getElementById('snake-highscore');
    
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transform = 'scale(1.1)';
    
    const gridSize = 30; // 600 / 20 = 30 for a 20x20 grid
    const tileCount = 20;
    
    let score = 0;
    let dx = 1;
    let dy = 0;
    let snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    let food = {x: 15, y: 15};
    let nextDx = 1;
    let nextDy = 0;
    let gameSpeed = 120; // Adjusted speed for 20x20 grid
    let lastTime = 0;

    if (snakeInterval) clearInterval(snakeInterval);

    function draw(timestamp) {
        if (timestamp - lastTime < gameSpeed) {
            snakeInterval = requestAnimationFrame(draw);
            return;
        }
        lastTime = timestamp;

        // Move snake
        dx = nextDx;
        dy = nextDy;
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return gameOver();
        
        // Self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) return gameOver();
        
        snake.unshift(head);
        
        // Food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.innerText = `SCORE: ${score}`;
            
            // Increase speed slightly
            if (gameSpeed > 70) gameSpeed -= 2;

            // Update high score
            const currentHighScore = parseInt(localStorage.getItem('snake-highscore') || 0);
            if (score > currentHighScore) {
                localStorage.setItem('snake-highscore', score);
                highScoreEl.innerText = score;
            }

            // Spawn new food not on snake
            let newFood;
            while (true) {
                newFood = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
                if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
            }
            food = newFood;
        } else {
            snake.pop();
        }
        
        // Clear canvas
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid (subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
        
        // Draw food - Classic square
        ctx.fillStyle = '#f97316';
        ctx.fillRect(food.x * gridSize + 4, food.y * gridSize + 4, gridSize - 8, gridSize - 8);
        
        // Draw snake - Solid white, square segments
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = '#fff';
            const x = segment.x * gridSize + 2;
            const y = segment.y * gridSize + 2;
            const size = gridSize - 4;
            
            ctx.fillRect(x, y, size, size);

            if (isHead) {
                // Simple Face (Eyes)
                ctx.fillStyle = '#000';
                const eyeSize = 4;
                const offset = 6;
                
                if (dx === 1) { // Right
                    ctx.fillRect(x + size - offset - eyeSize, y + offset, eyeSize, eyeSize);
                    ctx.fillRect(x + size - offset - eyeSize, y + size - offset - eyeSize, eyeSize, eyeSize);
                } else if (dx === -1) { // Left
                    ctx.fillRect(x + offset, y + offset, eyeSize, eyeSize);
                    ctx.fillRect(x + offset, y + size - offset - eyeSize, eyeSize, eyeSize);
                } else if (dy === 1) { // Down
                    ctx.fillRect(x + offset, y + size - offset - eyeSize, eyeSize, eyeSize);
                    ctx.fillRect(x + size - offset - eyeSize, y + size - offset - eyeSize, eyeSize, eyeSize);
                } else if (dy === -1) { // Up
                    ctx.fillRect(x + offset, y + offset, eyeSize, eyeSize);
                    ctx.fillRect(x + size - offset - eyeSize, y + offset, eyeSize, eyeSize);
                }
            }
        });

        snakeInterval = requestAnimationFrame(draw);
    }

    function gameOver() {
        cancelAnimationFrame(snakeInterval);
        snakeInterval = null;
        overlay.innerHTML = `
            <div class="text-center space-y-4">
                <h2 class="text-6xl font-black italic uppercase tracking-tighter text-red-500">Crashed</h2>
                <div class="space-y-1">
                    <p class="text-white/40 text-xs font-bold uppercase tracking-widest">Final Score</p>
                    <p class="text-4xl font-black text-white">${score}</p>
                </div>
                <button onclick="startSnake()" class="mt-4 px-12 py-4 bg-white text-black font-black rounded-2xl hover:scale-110 transition-all uppercase tracking-widest text-sm">
                    Reboot System
                </button>
            </div>
        `;
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        overlay.style.transform = 'scale(1)';
    }

    const handleKey = (e) => {
        const key = e.key.toLowerCase();
        if ((key === 'arrowup' || key === 'w') && dy === 0) { nextDx = 0; nextDy = -1; }
        if ((key === 'arrowdown' || key === 's') && dy === 0) { nextDx = 0; nextDy = 1; }
        if ((key === 'arrowleft' || key === 'a') && dx === 0) { nextDx = -1; nextDy = 0; }
        if ((key === 'arrowright' || key === 'd') && dx === 0) { nextDx = 1; nextDy = 0; }
        
        // Prevent scrolling with arrows
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            e.preventDefault();
        }
    };
    
    if (snakeKeyHandler) document.removeEventListener('keydown', snakeKeyHandler);
    snakeKeyHandler = handleKey;
    document.addEventListener('keydown', snakeKeyHandler);
    
    snakeInterval = requestAnimationFrame(draw);
}

// Global functions for HTML events
window.selectGame = (id) => {
    selectedGame = games.find(g => g.id === id);
    render();
    window.scrollTo(0, 0);
};

window.closeGame = () => {
    if (snakeInterval) {
        if (typeof snakeInterval === 'number') clearInterval(snakeInterval);
        else cancelAnimationFrame(snakeInterval);
        snakeInterval = null;
    }
    if (snakeKeyHandler) {
        document.removeEventListener('keydown', snakeKeyHandler);
        snakeKeyHandler = null;
    }
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
