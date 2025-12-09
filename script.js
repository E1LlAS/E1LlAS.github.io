document.addEventListener('DOMContentLoaded', () => {
    const originalApps = [
        { id: 1, name: 'Twitch Recap 2025', time: '09.12', description: 'Этот значок был присуждён 2 декабря 2025 года самым активным пользователям Twitch', banner: '1.png', iconFile: '1.png', status: 'soon' },
        { id: 2, name: 'Jeff the Land Shark', time: '06.10 - 11.12', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'live' },
        { id: 3, name: 'DragonScimmy', time: 'До начала 14:28:00', description: 'Актуальный пример.', banner: '2.png', iconFile: '2.png', status: 'soon' },
        { id: 4, name: 'Twitch Intern 2022', time: 'До начала 14:48:00', description: 'Скоро будет доступно.', banner: '2.png', iconFile: '2.png', status: 'soon' },
        { id: 5, name: 'TwitchCon 2023 - Paris', time: 'До начала 14:48:00', description: 'Можно получить, оформив или подарив платную подписку стримеру в категории.', banner: '2.png', iconFile: '2.png', status: 'soon' },
    ];
    
    const apps = originalApps; 


    // --- 2. ЭЛЕМЕНТЫ DOM ---
    const appsList = document.getElementById('appsList');
    const bottomSheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('overlay');
    const appName = document.getElementById('appName');
    const appDescription = document.getElementById('appDescription');
    const sheetHeader = document.getElementById('sheetHeader');
    const filterBar = document.getElementById('filterBar');
    const searchInput = document.getElementById('searchInput');
    const container = document.querySelector('.container');
    const stickyHeader = document.querySelector('.sticky-header');
    
    // НОВЫЕ ЭЛЕМЕНТЫ ДЛЯ ПЛАВАЮЩЕГО МЕНЮ
    const menuTrigger = document.getElementById('menuTrigger');
    const popupMenu = document.getElementById('popupMenu');
    // Добавление: Получаем все новые кнопки палитры
    const colorPaletteItems = document.querySelectorAll('.color-palette-item');
    
    // НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ТЕМЫ
    const body = document.body;
    const STORAGE_KEY = 'twitchAppTheme'; // Ключ для localStorage
    // НОВЫЕ ЭЛЕМЕНТЫ ДЛЯ ИКОНОК
    const searchIcon = document.getElementById('searchIcon');
    const settingsIcon = document.getElementById('settingsIcon');


    // --- 3. ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
    let startY = 0;
    let currentY = 0;
    let isDraggingSheet = false;
    let currentSelected = null;
    let currentFilter = 'live'; 
    let isDraggingFilter = false; 
    let startX = 0;
    let scrollLeft = 0;

    // ... (Функции 4, 5, 6, 7 остаются без изменений) ...

    function createAppComponent(app) {
        // ... (Без изменений) ...
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
        
        appItem.addEventListener('click', (e) => openBottomSheet(app, e.currentTarget)); 
        return appItem;
    }

    function renderApps() {
        // ... (Без изменений) ...
        appsList.innerHTML = '';
        apps.forEach(app => {
            appsList.appendChild(createAppComponent(app));
        });
        filterApps();
    }

    function openBottomSheet(app, clickedItem) {
        // ... (Без изменений) ...
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }

        clickedItem.classList.add('selected');
        currentSelected = clickedItem;

        document.getElementById('appBannerImg').src = `img/baner/${app.banner}`;
        appName.textContent = app.name;
        appDescription.textContent = app.description;
        document.getElementById('timerButton').textContent = app.time;

        // Активация рассеивания для списка
        container.classList.add('blur-active'); 
        // Активация рассеивания для шапки с поиском
        stickyHeader.classList.add('blur-active'); 

        bottomSheet.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBottomSheet() {
        // ... (Без изменений) ...
        // Деактивация рассеивания для списка
        container.classList.remove('blur-active');
        // Деактивация рассеивания для шапки с поиском
        stickyHeader.classList.remove('blur-active'); 

        bottomSheet.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';

        if (currentSelected) {
            currentSelected.classList.remove('selected');
            currentSelected = null;
        }
    }
    
    // --- 5. ОБНОВЛЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ ---
    function filterApps() {
        // ... (Без изменений) ...
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
        // ... (Без изменений) ...
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', (e) => {
                // Предотвращаем срабатывание, если это drag-событие
                if (isDraggingFilter) return; 

                currentFilter = e.currentTarget.getAttribute('data-filter'); 

                document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                
                e.currentTarget.classList.add('active');
                
                filterApps();
            });
        });
        
        searchInput.addEventListener('input', filterApps);
    }
    
    function setActiveFilterOnLoad() {
        // ... (Без изменений) ...
        const liveButton = document.querySelector('.filter-button[data-filter="live"]');
        
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        
        if (liveButton) {
            liveButton.classList.add('active');
        }
    }

    // --- 6. ЛОГИКА ПЕРЕТАСКИВАНИЯ КНОПОК (DRAG-TO-SCROLL) ---
    // ... (Без изменений) ...
    filterBar.addEventListener('mousedown', (e) => {
        isDraggingFilter = false; 
        startX = e.pageX - filterBar.offsetLeft;
        scrollLeft = filterBar.scrollLeft;
        e.preventDefault(); 
        
        document.addEventListener('mousemove', handleFilterMouseMove);
        document.addEventListener('mouseup', handleFilterMouseUp);
    });
    
    filterBar.addEventListener('touchstart', (e) => {
        isDraggingFilter = false; 
        startX = e.touches[0].pageX - filterBar.offsetLeft;
        scrollLeft = filterBar.scrollLeft;
        
        document.addEventListener('touchmove', handleFilterTouchMove, { passive: false });
        document.addEventListener('touchend', handleFilterTouchEnd);
    }, { passive: true });

    function handleFilterMouseMove(e) {
        // ... (Без изменений) ...
        if (!isDraggingFilter && Math.abs(e.pageX - (startX + filterBar.offsetLeft)) > 5) {
            isDraggingFilter = true;
            filterBar.classList.add('dragging');
        }
        
        if (!isDraggingFilter) return;
        
        const x = e.pageX - filterBar.offsetLeft;
        const walk = (x - startX) * 1.5; 
        filterBar.scrollLeft = scrollLeft - walk;
    }

    function handleFilterMouseUp() {
        // ... (Без изменений) ...
        filterBar.classList.remove('dragging');
        
        // Маленькая задержка, чтобы предотвратить клик после легкого драга
        setTimeout(() => {
            isDraggingFilter = false;
        }, 50);

        document.removeEventListener('mousemove', handleFilterMouseMove);
        document.removeEventListener('mouseup', handleFilterMouseUp);
    }
    
    function handleFilterTouchMove(e) {
        if (!isDraggingFilter && Math.abs(e.touches[0].pageX - (startX + filterBar.offsetLeft)) > 5) {
            isDraggingFilter = true;
            filterBar.classList.add('dragging');
        }
        
        if (!isDraggingFilter) return;

        const x = e.touches[0].pageX - filterBar.offsetLeft;
        const walk = (x - startX) * 1.5; 
        filterBar.scrollLeft = scrollLeft - walk;
    }

    function handleFilterTouchEnd() {
        filterBar.classList.remove('dragging');
        
        setTimeout(() => {
            isDraggingFilter = false;
        }, 50);

        document.removeEventListener('touchmove', handleFilterTouchMove);
        document.removeEventListener('touchend', handleFilterTouchEnd);
    }


    // --- 7. ЛОГИКА ПЕРЕТАСКИВАНИЯ BOTTOM SHEET (Mouse/Touch) ---
    // ... (Без изменений) ...
    overlay.addEventListener('click', closeBottomSheet);
    sheetHeader.addEventListener('touchstart', handleTouchStart, { passive: false });
    sheetHeader.addEventListener('touchmove', handleTouchMove, { passive: false });
    sheetHeader.addEventListener('touchend', handleTouchEnd);
    sheetHeader.addEventListener('mousedown', handleMouseDown);

    function handleMouseDown(e) {
        // ... (Без изменений) ...
        e.preventDefault();
        isDraggingSheet = true;
        startY = e.clientY;
        bottomSheet.style.transition = 'none';
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        // ... (Без изменений) ...
        if (!isDraggingSheet) return;
        
        e.preventDefault();
        currentY = e.clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 0) {
            bottomSheet.style.transform = `translateY(${deltaY}px)`;
        }
    }

    function handleMouseUp(e) {
        // ... (Без изменений) ...
        if (!isDraggingSheet) return;
        
        isDraggingSheet = false;
        bottomSheet.style.transition = 'transform 0.3s ease-out';
        
        const deltaY = currentY - startY;
        const sheetHeight = bottomSheet.offsetHeight;
        const threshold = sheetHeight * 0.3;
        
        if (deltaY > threshold) {
            closeBottomSheet();
        } else {
            bottomSheet.style.transform = 'translateY(0)';
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    function handleTouchStart(e) {
        // ... (Без изменений) ...
        isDraggingSheet = true;
        startY = e.touches[0].clientY;
        bottomSheet.style.transition = 'none';
    }

    function handleTouchMove(e) {
        // ... (Без изменений) ...
        if (!isDraggingSheet) return;
        
        e.preventDefault();
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 0) {
            bottomSheet.style.transform = `translateY(${deltaY}px)`;
        }
    }

    function handleTouchEnd(e) {
        // ... (Без изменений) ...
        if (!isDraggingSheet) return;
        
        isDraggingSheet = false;
        bottomSheet.style.transition = 'transform 0.3s ease-out';
        
        const deltaY = currentY - startY; 
        const sheetHeight = bottomSheet.offsetHeight;
        const threshold = sheetHeight * 0.3;
        
        if (deltaY > threshold) {
            closeBottomSheet();
        } else {
            bottomSheet.style.transform = 'translateY(0)';
        }
    }

    menuTrigger.addEventListener('click', toggleMenu);

    // Закрытие меню при клике в любом месте, кроме меню и кнопки
    document.addEventListener('click', (e) => {
        if (popupMenu.classList.contains('active') && !popupMenu.contains(e.target) && !menuTrigger.contains(e.target)) {
            closeMenu();
        }
    });

    function toggleMenu() {
        if (popupMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        popupMenu.classList.add('active');
        menuTrigger.classList.add('active'); // Можно использовать для изменения стиля кнопки
    }

    function closeMenu() {
        popupMenu.classList.remove('active');
        menuTrigger.classList.remove('active');
    }

    // --- 8. ЛОГИКА ТЕМЫ И ПАЛИТРЫ ---

    // Функция для установки темы
    function setTheme(theme) {
        // 1. Устанавливаем класс на body
        body.classList.remove('theme-grey', 'theme-white', 'theme-black');
        body.classList.add(`theme-${theme}`);

        // 2. Обновляем иконки в зависимости от темы
        if (theme === 'white') {
            searchIcon.src = 'img/search_n.png';
            settingsIcon.src = 'img/settings_n.png';
        } else {
            // Черная и Серая темы используют стандартные (белые) иконки
            searchIcon.src = 'img/search.png';
            settingsIcon.src = 'img/settings.png';
        }
        
        // 3. Обновляем активный элемент в палитре
        colorPaletteItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-color') === theme) {
                item.classList.add('active');
            }
        });
        
        // 4. Сохраняем в localStorage (аналог theme.json)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: theme }));
        } catch (error) {
            console.error("Ошибка при сохранении темы в localStorage", error);
        }
    }
    
    // Функция для загрузки темы
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
        
        // Если нет сохраненной темы или произошла ошибка, устанавливаем 'grey' по умолчанию
        setTheme('grey');
    }
    
    // Слушатели для кнопок палитры
    colorPaletteItems.forEach(button => {
        button.addEventListener('click', (e) => {
            const color = e.currentTarget.getAttribute('data-color');
            setTheme(color);
            closeMenu();
        });
    });


    // --- 9. ИНИЦИАЛИЗАЦИЯ (ОБНОВЛЕННАЯ) ---
    loadTheme(); // Сначала загружаем тему
    setActiveFilterOnLoad(); 
    renderApps();           
    setupFilterListeners();
});