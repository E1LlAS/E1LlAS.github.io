document.addEventListener('DOMContentLoaded', () => {
    const originalApps = [
        { id: 1, name: 'Twitch Recap 2025', time: '09.12', description: 'Этот значок был присуждён 2 декабря 2025 года самым активным пользователям Twitch', banner: '1.png', iconFile: '1.png', status: 'soon' },
        { id: 2, name: 'Jeff the Land Shark', time: '06.10 - 11.12', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'live' },
        { id: 3, name: 'DragonScimmy', time: 'До начала 14:28:00', description: 'Актуальный пример.', banner: '2.png', iconFile: '2.png', status: 'soon' },
        { id: 4, name: 'Twitch Intern 2022', time: 'До начала 14:48:00', description: 'Скоро будет доступно.', banner: '2.png', iconFile: '2.png', status: 'soon' },
        { id: 5, name: 'TwitchCon 2023 - Paris', time: 'Недоступно', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'unavailable' },
        { id: 6, name: 'Jeff the Land Shark', time: '06.10 - 11.12', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'live' },
        { id: 7, name: 'Jeff the Land Shark', time: '06.10 - 11.12', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'live' },
        { id: 8, name: 'Jeff the Land Shark', time: '06.10 - 11.12', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'live' },
        { id: 9, name: 'Jeff the Land Shark', time: '06.10 - 11.12', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'live' },
    ];
    
    const apps = originalApps; 

    const appsList = document.getElementById('desktopAppsList');
    const detailsPanel = document.getElementById('desktopDetailsPanel');
    const appNameEl = document.getElementById('desktopAppName');
    const appDescriptionEl = document.getElementById('desktopAppDescription');
    const appBannerImgEl = document.getElementById('desktopAppBannerImg');
    const timerButtonEl = document.getElementById('desktopTimerButton');
    const searchInput = document.getElementById('desktopSearchInput');
    const searchIcon = document.getElementById('desktopSearchIcon');
    
    const themeSwitchButtons = document.querySelectorAll('.desktop-theme-switch .color-palette-item');

    const searchWrapper = document.getElementById('desktopSearchWrapper');
    const searchTrigger = document.getElementById('desktopSearchTrigger');
    
    const body = document.body;
    const STORAGE_KEY = 'twitchAppTheme';
    const ANIMATION_DURATION = 300;

    let currentSelected = null;
    let currentFilter = 'live'; 

    function createAppComponent(app) {
        const appItem = document.createElement('div');
        appItem.className = 'app-item';
        appItem.setAttribute('data-status', app.status); 
        
        appItem.innerHTML = `
            <div class="app-icon">
                <img src="img/icon/${app.iconFile}" alt="${app.name}">
            </div>
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.time}</p>
            </div>
        `;
        
        appItem.addEventListener('click', (e) => showDetails(app, e.currentTarget)); 
        return appItem;
    }

    function renderApps() {
        appsList.innerHTML = '';
        apps.forEach(app => {
            appsList.appendChild(createAppComponent(app));
        });
        filterApps();
    }
    
    function showDetails(app, clickedItem) {
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        
        clickedItem.classList.add('selected');
        currentSelected = clickedItem;

        appBannerImgEl.src = `img/baner/${app.banner}`;
        appNameEl.textContent = app.name;
        appDescriptionEl.textContent = app.description;
        timerButtonEl.textContent = app.time;
        
        if (app.status === 'unavailable') {
            timerButtonEl.classList.add('unavailable');
            timerButtonEl.textContent = 'Недоступно';
        } else {
            timerButtonEl.classList.remove('unavailable');
        }

        detailsPanel.classList.add('active'); 
        appsList.classList.add('panel-open');
    }

    function closeDetailsPanel() {
        if (detailsPanel.classList.contains('active')) {
            appsList.classList.remove('panel-open'); 
            
            detailsPanel.classList.remove('active');
            if (currentSelected) {
                currentSelected.classList.remove('selected');
                currentSelected = null;
            }
            return true;
        }
        return false;
    }
        
    function filterApps() {
        const searchText = searchInput.value.toLowerCase();
        const appItems = document.querySelectorAll('.app-item');
        
        appItems.forEach(item => {
            const status = item.getAttribute('data-status');
            const name = item.querySelector('.app-info h3').textContent.toLowerCase();
            
            const matchesStatus = (currentFilter === 'all' || status === currentFilter);
            const matchesSearch = name.includes(searchText);
            
            if (matchesStatus && matchesSearch) {
                item.style.display = 'flex'; 
            } else {
                item.style.display = 'none'; 
            }
        });
    }

    function setupFilterListeners() {
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', (e) => {
                currentFilter = e.currentTarget.getAttribute('data-filter'); 

                document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                filterApps();
            });
        });
        
        searchInput.addEventListener('input', filterApps);
    }
    
    function setActiveFilterOnLoad() {
        const liveButton = document.querySelector('#desktopFilterBar .filter-button[data-filter="live"]');
        
        document.querySelectorAll('#desktopFilterBar .filter-button').forEach(btn => btn.classList.remove('active'));
        
        if (liveButton) {
            liveButton.classList.add('active');
        }
    }
    
    function setTheme(theme) {
        body.classList.remove('theme-grey', 'theme-white', 'theme-black');
        body.classList.add(`theme-${theme}`);

        if (theme === 'white') {
            searchIcon.src = 'img/search_n.png';
        } else {
            searchIcon.src = 'img/search.png';
        }
        
        themeSwitchButtons.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-color') === theme) {
                item.classList.add('active');
            }
        });
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: theme }));
        } catch (error) {
            console.error("Ошибка при сохранении темы в localStorage", error);
        }
    }
    
    function loadTheme() {
        try {
            const savedThemeData = localStorage.getItem(STORAGE_KEY);
            if (savedThemeData) {
                const data = JSON.parse(savedThemeData);
                const theme = data.theme;
                if (['grey', 'white', 'black'].includes(theme)) {
                    setTheme(theme);
                    return;
                }
            }
        } catch (error) {
            console.error("Ошибка при загрузке темы из localStorage", error);
        }
        
        setTheme('grey'); 
    }
    
    function setupThemeSwitchListeners() {
        themeSwitchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const color = e.currentTarget.getAttribute('data-color');
                setTheme(color);
            });
        });
    }

    function closeSearch() {
        if (searchWrapper.classList.contains('active') && searchInput.value.trim() === '') {
            searchWrapper.classList.remove('active');
            setTimeout(() => {
                searchInput.value = '';
                filterApps();
            }, ANIMATION_DURATION);
            return true;
        }
        return false;
    }

    function handleSearchToggle() {
        const isActive = searchWrapper.classList.contains('active');

        if (isActive) {
            searchWrapper.classList.remove('active');
            
            setTimeout(() => {
                searchInput.value = '';
                filterApps();
            }, ANIMATION_DURATION); 
            
            searchInput.blur(); 
            
        } else {
            searchWrapper.classList.add('active');
            searchInput.focus();
        }
    }
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
             if (searchInput.value.trim() === '' && document.activeElement !== searchTrigger) {
                closeSearch();
            }
        }, 100); 
    });
    searchTrigger.addEventListener('click', (event) => {
        event.preventDefault(); 
        handleSearchToggle();
    });
    
    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchWrapper.contains(event.target) || searchTrigger.contains(event.target);
        const isClickInsideAppList = appsList.contains(event.target);
        
        if (!isClickInsideSearch && !isClickInsideDetails) {
            
            if (closeDetailsPanel()) {
                return;
            }
        
            if (searchWrapper.classList.contains('active') && searchInput.value.trim() === '') {
                 closeSearch();
                 return;
            }
            
            if (!searchWrapper.classList.contains('active') && !isClickInsideAppList) {
                searchWrapper.classList.add('active');
                searchInput.focus();
            }
        }
    });


    // --- Инитилизейшон ---
    loadTheme();
    setActiveFilterOnLoad(); 
    renderApps();           
    setupFilterListeners();
    setupThemeSwitchListeners();
});