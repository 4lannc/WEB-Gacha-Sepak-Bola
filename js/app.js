/**
 * FOOTBALL MATCH ROULETTE - MAIN APPLICATION LOGIC (js/app.js)
 * Modul interaksi utama:
 * - Algoritma gacha anti-bentrok (Team 1 != Team 2)
 * - Animasi slot shuffle dengan kurva deselerasi
 * - Filter kategori & preset pilihan cepat
 * - Mode duel (Bebas / Campur vs Kategori Sama)
 * - Simulator Lempar Koin (Penentu Stik 1 / Home)
 * - Riwayat pertandingan dengan localStorage
 * - Renderer confetti kanvas mandiri (ringan & offline)
 */

(function () {
  'use strict';

  // --- STATE APLIKASI ---
  const state = {
    selectedCategories: new Set(Object.keys(window.TEAMS_DATABASE || {})),
    matchMode: 'any', // 'any' (Bebas/Campur) | 'same_category' (Satu Kategori Sama)
    teamsPerSide: 2, // 1 (1 vs 1 / 2 clubs) | 2 (2 vs 2 / 4 clubs)
    isRolling: false,
    currentMatch: null,
    coinWinnerSide: null, // 'A' | 'B'
    history: []
  };

  // --- ELEMEN DOM CACHE ---
  const DOM = {};

  function initDOM() {
    DOM.btnRollGacha = document.getElementById('btnRollGacha');
    DOM.rollBtnLabel = document.getElementById('rollBtnLabel');
    DOM.btnToggleMode = document.getElementById('btnToggleMode');
    DOM.modeDisplay = document.getElementById('modeDisplay');
    DOM.activePoolCount = document.getElementById('activePoolCount');
    DOM.btnFormat1 = document.getElementById('btnFormat1');
    DOM.btnFormat2 = document.getElementById('btnFormat2');
    DOM.duelGrid = document.getElementById('duelGrid');
    DOM.kubuA = document.getElementById('kubuA');
    DOM.kubuB = document.getElementById('kubuB');
    DOM.kubuABadgeLabel = document.getElementById('kubuABadgeLabel');
    DOM.kubuBBadgeLabel = document.getElementById('kubuBBadgeLabel');
    DOM.kubuAMeta = document.getElementById('kubuAMeta');
    DOM.kubuBMeta = document.getElementById('kubuBMeta');
    DOM.btnSoundToggle = document.getElementById('btnSoundToggle');
    DOM.soundIcon = document.getElementById('soundIcon');
    DOM.btnSwapHomeAway = document.getElementById('btnSwapHomeAway');
    DOM.btnCopyMatch = document.getElementById('btnCopyMatch');
    DOM.btnCoinTossModal = document.getElementById('btnCoinTossModal');
    DOM.btnOpenHistory = document.getElementById('btnOpenHistory');
    DOM.historyDrawer = document.getElementById('historyDrawer');
    DOM.btnCloseHistory = document.getElementById('btnCloseHistory');
    DOM.btnClearHistory = document.getElementById('btnClearHistory');
    DOM.historyList = document.getElementById('historyList');
    DOM.historyCountBadge = document.getElementById('historyCountBadge');
    DOM.coinModal = document.getElementById('coinModal');
    DOM.btnCloseCoin = document.getElementById('btnCloseCoin');
    DOM.btnFlipCoin = document.getElementById('btnFlipCoin');
    DOM.coin3D = document.getElementById('coin3D');
    DOM.coinResultBanner = document.getElementById('coinResultBanner');
    DOM.poolDrawer = document.getElementById('poolDrawer');
    DOM.btnCustomFilter = document.getElementById('btnCustomFilter');
    DOM.filterChevron = document.getElementById('filterChevron');
    DOM.categoryGrid = document.getElementById('categoryGrid');
    DOM.toast = document.getElementById('toastNotification');
    DOM.toastMsg = document.getElementById('toastMsg');
    DOM.confettiCanvas = document.getElementById('confettiCanvas');
    DOM.allCountBadge = document.getElementById('allCountBadge');
    DOM.clubsCountBadge = document.getElementById('clubsCountBadge');
    DOM.nationsCountBadge = document.getElementById('nationsCountBadge');
    DOM.top5CountBadge = document.getElementById('top5CountBadge');

    // Cards 4 Slots
    DOM.cardTeamA1 = document.getElementById('cardTeamA1');
    DOM.cardTeamA2 = document.getElementById('cardTeamA2');
    DOM.cardTeamB1 = document.getElementById('cardTeamB1');
    DOM.cardTeamB2 = document.getElementById('cardTeamB2');
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    initAudioUI();
    calculatePresetCounts();
    renderCategoryGrid();
    updateActivePoolCounter();
    setTeamsPerSide(2, false); // Default ke 2 vs 2 (4 tim)
    attachEventListeners();
    loadHistoryFromStorage();
  });

  // --- HITUNG JUMLAH PRESET ---
  function calculatePresetCounts() {
    let all = 0;
    let clubs = 0;
    let nations = 0;
    let top5 = 0;

    const top5Ids = ['premier_league', 'laliga', 'serie_a', 'ligue_1', 'blanda_jerman_portugal'];

    Object.values(window.TEAMS_DATABASE || {}).forEach(cat => {
      const len = cat.teams.length;
      all += len;
      if (cat.type === 'club') clubs += len;
      if (cat.type === 'nation') nations += len;
      if (top5Ids.includes(cat.id)) top5 += len;
    });

    if (DOM.allCountBadge) DOM.allCountBadge.textContent = all;
    if (DOM.clubsCountBadge) DOM.clubsCountBadge.textContent = clubs;
    if (DOM.nationsCountBadge) DOM.nationsCountBadge.textContent = nations;
    if (DOM.top5CountBadge) DOM.top5CountBadge.textContent = top5;
  }

  // --- RENDER KATEGORI GRID ---
  function renderCategoryGrid() {
    if (!DOM.categoryGrid || !window.TEAMS_DATABASE) return;
    DOM.categoryGrid.innerHTML = '';

    Object.values(window.TEAMS_DATABASE).forEach(cat => {
      const isChecked = state.selectedCategories.has(cat.id);
      const label = document.createElement('label');
      label.className = `category-chip-label ${isChecked ? 'active' : ''}`;
      label.id = `chip-${cat.id}`;

      label.innerHTML = `
        <div class="cat-chip-left">
          <input type="checkbox" value="${cat.id}" ${isChecked ? 'checked' : ''} data-cat-id="${cat.id}">
          <span class="cat-chip-name">${cat.name}</span>
        </div>
        <span class="cat-count-badge">${cat.teams.length}</span>
      `;

      label.querySelector('input').addEventListener('change', (e) => {
        toggleCategorySelection(cat.id, e.target.checked);
      });

      DOM.categoryGrid.appendChild(label);
    });
  }

  function toggleCategorySelection(catId, forceState) {
    if (typeof forceState === 'boolean') {
      if (forceState) {
        state.selectedCategories.add(catId);
      } else {
        if (state.selectedCategories.size <= 1) {
          showToast('Minimal 1 kategori harus aktif!');
          renderCategoryGrid();
          return;
        }
        state.selectedCategories.delete(catId);
      }
    } else {
      if (state.selectedCategories.has(catId)) {
        if (state.selectedCategories.size <= 1) {
          showToast('Minimal 1 kategori harus aktif!');
          return;
        }
        state.selectedCategories.delete(catId);
      } else {
        state.selectedCategories.add(catId);
      }
    }

    renderCategoryGrid();
    updateActivePoolCounter();
    updatePresetChipsActiveState();
  }

  function selectAllCategories(status) {
    if (status) {
      Object.keys(window.TEAMS_DATABASE).forEach(id => state.selectedCategories.add(id));
      showToast('Seluruh kategori diaktifkan!');
    } else {
      state.selectedCategories.clear();
      // Tetap sisakan 1 kategori default
      state.selectedCategories.add('premier_league');
      showToast('Kategori dikosongkan (Premier League aktif)');
    }
    renderCategoryGrid();
    updateActivePoolCounter();
    updatePresetChipsActiveState();
  }

  // --- PRESETS HANDLING ---
  function applyPreset(presetType) {
    state.selectedCategories.clear();

    const db = window.TEAMS_DATABASE;
    if (presetType === 'all') {
      Object.keys(db).forEach(id => state.selectedCategories.add(id));
      showToast('Preset: Semua Tim & Negara aktif!');
    } else if (presetType === 'clubs') {
      Object.values(db).forEach(c => {
        if (c.type === 'club') state.selectedCategories.add(c.id);
      });
      showToast('Preset: Hanya Klub Sepak Bola aktif!');
    } else if (presetType === 'nations') {
      Object.values(db).forEach(c => {
        if (c.type === 'nation') state.selectedCategories.add(c.id);
      });
      showToast('Preset: Hanya Tim Nasional aktif!');
    } else if (presetType === 'top5') {
      const top5Ids = ['premier_league', 'laliga', 'serie_a', 'ligue_1', 'blanda_jerman_portugal'];
      top5Ids.forEach(id => {
        if (db[id]) state.selectedCategories.add(id);
      });
      showToast('Preset: Top 5 Liga Eropa aktif!');
    }

    renderCategoryGrid();
    updateActivePoolCounter();
    updatePresetChipsActiveState(presetType);
  }

  function updatePresetChipsActiveState(activePreset) {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      const type = btn.getAttribute('data-preset');
      if (type === activePreset) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updateActivePoolCounter() {
    let count = 0;
    state.selectedCategories.forEach(id => {
      if (window.TEAMS_DATABASE[id]) {
        count += window.TEAMS_DATABASE[id].teams.length;
      }
    });
    if (DOM.activePoolCount) {
      DOM.activePoolCount.textContent = `${count} Tim`;
    }
  }

  function toggleFilterDrawer() {
    if (!DOM.poolDrawer) return;
    const isHidden = DOM.poolDrawer.classList.contains('hidden');
    if (isHidden) {
      DOM.poolDrawer.classList.remove('hidden');
      if (DOM.filterChevron) DOM.filterChevron.style.transform = 'rotate(180deg)';
    } else {
      DOM.poolDrawer.classList.add('hidden');
      if (DOM.filterChevron) DOM.filterChevron.style.transform = 'rotate(0deg)';
    }
  }

  // --- AUDIO UI ---
  function initAudioUI() {
    if (window.matchAudio && DOM.soundIcon) {
      DOM.soundIcon.textContent = window.matchAudio.getMuted() ? '🔇' : '🔊';
    }
  }

  function toggleAudio() {
    if (!window.matchAudio) return;
    const muted = window.matchAudio.toggleMute();
    if (DOM.soundIcon) {
      DOM.soundIcon.textContent = muted ? '🔇' : '🔊';
    }
    showToast(muted ? 'Suara dimatikan' : 'Suara diaktifkan');
  }

  // --- FORMAT TIM TOGGLE (1 vs 1 atau 2 vs 2) ---
  function setTeamsPerSide(count, notify = true) {
    state.teamsPerSide = count;

    if (DOM.btnFormat1 && DOM.btnFormat2) {
      if (count === 1) {
        DOM.btnFormat1.classList.add('active');
        DOM.btnFormat2.classList.remove('active');
      } else {
        DOM.btnFormat1.classList.remove('active');
        DOM.btnFormat2.classList.add('active');
      }
    }

    if (DOM.duelGrid) {
      DOM.duelGrid.className = count === 1 ? 'duel-grid format-1v1' : 'duel-grid format-2v2';
    }

    if (DOM.kubuAMeta) DOM.kubuAMeta.textContent = count === 2 ? '2 Pilihan Tim' : '1 Tim Utama';
    if (DOM.kubuBMeta) DOM.kubuBMeta.textContent = count === 2 ? '2 Pilihan Tim' : '1 Tim Utama';

    if (DOM.kubuABadgeLabel) DOM.kubuABadgeLabel.textContent = count === 2 ? 'KUBU A / STIK 1' : 'HOME / STIK 1';
    if (DOM.kubuBBadgeLabel) DOM.kubuBBadgeLabel.textContent = count === 2 ? 'KUBU B / STIK 2' : 'AWAY / STIK 2';

    clearStikWinnerVisual();

    if (notify) {
      showToast(count === 2 ? 'Format 2 vs 2 diaktifkan (4 Club Bertanding)!' : 'Format 1 vs 1 diaktifkan (2 Club Bertanding)!');
    }
  }

  // --- MODE DUEL TOGGLE ---
  function toggleMatchMode() {
    if (state.matchMode === 'any') {
      state.matchMode = 'same_category';
      DOM.modeDisplay.textContent = 'Satu Kategori Sama';
      DOM.modeDisplay.className = 'mode-info-value same-cat';
      showToast('Mode Duel: Kategori yang sama (Misal: Premier League vs Premier League)');
    } else {
      state.matchMode = 'any';
      DOM.modeDisplay.textContent = 'Bebas / Campur';
      DOM.modeDisplay.className = 'mode-info-value';
      showToast('Mode Duel: Bebas campur lintas liga & negara!');
    }
  }

  // --- GACHA ROULETTE ENGINE (1v1 & 2v2) ---
  function rollGacha() {
    if (state.isRolling) return;
    if (window.matchAudio) window.matchAudio.ensureContext();

    const requiredCount = state.teamsPerSide === 2 ? 4 : 2;

    // 1. Kumpulkan pool tim yang eligible
    let pool = [];

    if (state.matchMode === 'same_category') {
      // Ambil kategori-kategori terpilih yang memiliki minimal jumlah tim yang dibutuhkan
      const validCategories = Array.from(state.selectedCategories).filter(catId => {
        const cat = window.TEAMS_DATABASE[catId];
        return cat && cat.teams.length >= requiredCount;
      });

      if (validCategories.length === 0) {
        showToast(`Pilih kategori yang memiliki minimal ${requiredCount} tim untuk format ini!`);
        return;
      }

      // Pilih 1 kategori secara acak untuk seluruh tim
      const randomCatId = validCategories[Math.floor(Math.random() * validCategories.length)];
      const chosenCat = window.TEAMS_DATABASE[randomCatId];

      pool = chosenCat.teams.map(t => ({
        ...t,
        categoryId: chosenCat.id,
        categoryName: chosenCat.name,
        categoryType: chosenCat.type
      }));
    } else {
      // Mode Bebas / Campur
      state.selectedCategories.forEach(catId => {
        const cat = window.TEAMS_DATABASE[catId];
        if (cat) {
          cat.teams.forEach(t => {
            pool.push({
              ...t,
              categoryId: cat.id,
              categoryName: cat.name,
              categoryType: cat.type
            });
          });
        }
      });
    }

    if (pool.length < requiredCount) {
      showToast(`Pool tim terlalu sedikit untuk diundi (minimal ${requiredCount} tim unik)!`);
      return;
    }

    // 2. Memulai animasi putaran roulette
    state.isRolling = true;
    state.coinWinnerSide = null; // reset pemenang lempar koin sebelumnya
    clearStikWinnerVisual();

    DOM.btnRollGacha.classList.add('loading');
    DOM.btnRollGacha.disabled = true;
    DOM.rollBtnLabel.textContent = 'MENGACAK ARENA...';

    // Animasi putaran pada kartu-kartu yang aktif
    const activeCards = [DOM.cardTeamA1, DOM.cardTeamB1];
    if (state.teamsPerSide === 2) {
      activeCards.push(DOM.cardTeamA2, DOM.cardTeamB2);
    }

    activeCards.forEach(card => {
      if (card) {
        card.classList.add('card-rolling');
        card.classList.remove('card-revealed');
      }
    });

    let stepCount = 0;
    const totalSteps = 26; // Total lompatan acak
    let currentDelay = 45; // Delay awal sangat cepat (ms)

    function shuffleStep() {
      stepCount++;

      // Ambil sejumlah tim acak tanpa duplikasi untuk preview putaran
      const previewPicks = [];
      while (previewPicks.length < requiredCount) {
        const rIdx = Math.floor(Math.random() * pool.length);
        if (!previewPicks.includes(rIdx)) {
          previewPicks.push(rIdx);
        }
      }

      renderTeamCard('A1', pool[previewPicks[0]], true);

      if (state.teamsPerSide === 2) {
        renderTeamCard('A2', pool[previewPicks[1]], true);
        renderTeamCard('B1', pool[previewPicks[2]], true);
        renderTeamCard('B2', pool[previewPicks[3]], true);
      } else {
        renderTeamCard('B1', pool[previewPicks[1]], true);
      }

      if (window.matchAudio) window.matchAudio.playTick();

      if (stepCount < totalSteps) {
        // Kurva deselerasi realistis (melambat di putaran terakhir)
        if (stepCount > totalSteps - 10) {
          currentDelay += 28;
        } else if (stepCount > totalSteps - 4) {
          currentDelay += 60;
        }
        setTimeout(shuffleStep, currentDelay);
      } else {
        // Kunci hasil akhir anti-bentrok
        finalizeMatch(pool);
      }
    }

    shuffleStep();
  }

  // --- KUNCI HASIL & ANTI-BENTROK 100% ---
  function finalizeMatch(pool) {
    const requiredCount = state.teamsPerSide === 2 ? 4 : 2;
    const picks = [];
    const usedNames = new Set();

    // Algoritma ketat Anti-Bentrok: Seluruh slot tim wajib unik (tidak boleh ada nama yang sama)
    let safetyCounter = 0;
    while (picks.length < requiredCount && safetyCounter < 1500) {
      safetyCounter++;
      const randIdx = Math.floor(Math.random() * pool.length);
      const team = pool[randIdx];
      const cleanName = team.name.trim().toLowerCase();

      if (!picks.includes(randIdx) && !usedNames.has(cleanName)) {
        picks.push(randIdx);
        usedNames.add(cleanName);
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    let homeTeams = [];
    let awayTeams = [];

    if (state.teamsPerSide === 2) {
      homeTeams = [pool[picks[0]], pool[picks[1]]];
      awayTeams = [pool[picks[2]], pool[picks[3]]];
    } else {
      homeTeams = [pool[picks[0]]];
      awayTeams = [pool[picks[1]]];
    }

    state.currentMatch = {
      teamsPerSide: state.teamsPerSide,
      home: homeTeams,
      away: awayTeams,
      mode: state.matchMode === 'same_category' ? 'Satu Kategori' : 'Bebas / Campur',
      time: timeStr,
      date: dateStr,
      timestamp: Date.now()
    };

    // Bersihkan kelas putaran & tambahkan efek revealed
    const activeCards = [DOM.cardTeamA1, DOM.cardTeamB1];
    if (state.teamsPerSide === 2) {
      activeCards.push(DOM.cardTeamA2, DOM.cardTeamB2);
    }

    activeCards.forEach(card => {
      if (card) {
        card.classList.remove('card-rolling');
        card.classList.add('card-revealed');
      }
    });

    // Tampilkan data lengkap ke kartu
    renderTeamCard('A1', homeTeams[0], false);
    renderTeamCard('B1', awayTeams[0], false);

    if (state.teamsPerSide === 2) {
      renderTeamCard('A2', homeTeams[1], false);
      renderTeamCard('B2', awayTeams[1], false);
    }

    // Audio kemenangan & efek kembang api
    if (window.matchAudio) {
      window.matchAudio.playLock();
      setTimeout(() => {
        window.matchAudio.playVictory();
      }, 150);
    }

    launchConfetti();
    addMatchToHistory(state.currentMatch);

    // Kembalikan tombol gacha
    state.isRolling = false;
    DOM.btnRollGacha.classList.remove('loading');
    DOM.btnRollGacha.disabled = false;
    DOM.rollBtnLabel.textContent = 'ROLL MATCH (GACHA)';
  }

  // --- RENDER TEAM CARD KE LAYAR ---
  function renderTeamCard(slotKey, team, isShuffling) {
    if (!team) return;

    const nameEl = document.getElementById(`t${slotKey}Name`);
    const catBadge = document.getElementById(`t${slotKey}CategoryBadge`);
    const emblemWrapper = document.getElementById(`t${slotKey}EmblemWrapper`);
    const imgLogo = document.getElementById(`t${slotKey}Logo`);
    const textFallback = document.getElementById(`t${slotKey}TextFallback`);
    const subtext = document.getElementById(`t${slotKey}Subtext`);

    if (nameEl) nameEl.textContent = team.name;
    if (catBadge) catBadge.textContent = team.categoryName || 'Sepak Bola';

    const isKubuA = slotKey.startsWith('A');
    const sideColor = isKubuA ? '#FFBF00' : '#007EFF';
    const sideGlow = isKubuA ? 'rgba(255, 191, 0, 0.45)' : 'rgba(0, 126, 255, 0.45)';

    // Update styling border emblem sesuai sisi tim (Amber Kuning untuk Kubu A, Sky Blue untuk Kubu B)
    if (emblemWrapper) {
      emblemWrapper.style.borderColor = sideColor;
      emblemWrapper.style.boxShadow = `0 0 24px ${sideGlow}, inset 0 0 15px rgba(255, 255, 255, 0.05)`;
    }

    // Set logo gambar
    if (imgLogo) {
      imgLogo.style.display = 'block';
      if (textFallback) textFallback.style.display = 'none';

      imgLogo.alt = team.name;
      imgLogo.src = team.logo || window.DEFAULT_FALLBACK_LOGO;

      // Safe fallback handler jika URL logo rusak
      imgLogo.onerror = function () {
        this.onerror = null;
        this.src = window.DEFAULT_FALLBACK_LOGO;
        if (textFallback) {
          textFallback.textContent = team.short || team.name.substring(0, 3).toUpperCase();
        }
      };
    }

    if (textFallback) {
      textFallback.textContent = team.short || team.name.substring(0, 3).toUpperCase();
      textFallback.style.color = sideColor;
    }

    if (!isShuffling && subtext) {
      subtext.textContent = `Siap Bertanding! • ${team.region || team.categoryName}`;
    }
  }

  // --- TUKAR HOME & AWAY (SWAP) ---
  function swapHomeAway() {
    if (!state.currentMatch) {
      showToast('Undi pertandingan terlebih dahulu!');
      return;
    }

    if (window.matchAudio) window.matchAudio.playSwap();

    const temp = state.currentMatch.home;
    state.currentMatch.home = state.currentMatch.away;
    state.currentMatch.away = temp;

    // Bersihkan penanda stik jika ada
    clearStikWinnerVisual();

    const homeArr = Array.isArray(state.currentMatch.home) ? state.currentMatch.home : [state.currentMatch.home];
    const awayArr = Array.isArray(state.currentMatch.away) ? state.currentMatch.away : [state.currentMatch.away];

    if (homeArr[0]) renderTeamCard('A1', homeArr[0], false);
    if (awayArr[0]) renderTeamCard('B1', awayArr[0], false);

    if (state.teamsPerSide === 2 && homeArr[1] && awayArr[1]) {
      renderTeamCard('A2', homeArr[1], false);
      renderTeamCard('B2', awayArr[1], false);
    }

    showToast('Posisi Kubu A dan Kubu B berhasil ditukar!');
  }

  // --- SALIN MATCHUP KE CLIPBOARD (Format 2v2 atau 1v1) ---
  function copyMatchupDetails() {
    if (!state.currentMatch) {
      showToast('Silakan Roll Match terlebih dahulu!');
      return;
    }

    const { home, away, mode, time, date, teamsPerSide } = state.currentMatch;
    const is2v2 = teamsPerSide === 2 || (Array.isArray(home) && home.length === 2);
    let textToCopy = '';

    if (is2v2) {
      const h1 = home[0] ? home[0].name : '';
      const h2 = home[1] ? home[1].name : '';
      const a1 = away[0] ? away[0].name : '';
      const a2 = away[1] ? away[1].name : '';

      textToCopy = `🔥 MATCHDAY ARENA 🔥
[Kubu A / Stik 1]: ${h1} & ${h2}
VS
[Kubu B / Stik 2]: ${a1} & ${a2}
🏆 Mode: ${mode} (2 Tim vs 2 Tim)
⏰ Jadwal Undian: ${date} pukul ${time} WIB
Siapkan stik, adu strategi, dan raih kemenangan! ⚽`;
    } else {
      const h1 = Array.isArray(home) ? home[0].name : home.name;
      const a1 = Array.isArray(away) ? away[0].name : away.name;

      textToCopy = `🔥 MATCHDAY ARENA 🔥
[Kubu A / Stik 1]: ${h1}
VS
[Kubu B / Stik 2]: ${a1}
🏆 Mode: ${mode} (1 vs 1)
⏰ Jadwal Undian: ${date} pukul ${time} WIB
Siapkan stik, adu strategi, dan raih kemenangan! ⚽`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('Detail matchup berhasil disalin ke Clipboard! 📋'))
        .catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Detail matchup berhasil disalin! 📋');
    } catch (e) {
      showToast('Gagal menyalin matchup.');
    }
    document.body.removeChild(textarea);
  }

  // --- LEMPAR KOIN SIMULATOR (STIK 1 DECIDER) ---
  function openCoinModal() {
    if (DOM.coinModal) {
      DOM.coinModal.classList.remove('hidden');
      DOM.coinResultBanner.textContent = 'Siap Melempar...';
      if (DOM.coin3D) DOM.coin3D.style.transform = 'rotateY(0deg)';
    }
  }

  function closeCoinModal() {
    if (DOM.coinModal) DOM.coinModal.classList.add('hidden');
  }

  function flipCoin() {
    if (!DOM.btnFlipCoin || !DOM.coin3D) return;

    if (window.matchAudio) {
      window.matchAudio.ensureContext();
      window.matchAudio.playCoinToss();
    }

    DOM.btnFlipCoin.disabled = true;
    DOM.coinResultBanner.textContent = 'Koin sedang berputar...';
    DOM.coin3D.classList.add('flipping');

    setTimeout(() => {
      DOM.coin3D.classList.remove('flipping');

      // Random 50:50
      const isHomeWinner = Math.random() < 0.5;
      state.coinWinnerSide = isHomeWinner ? 'A' : 'B';

      let resultText = '';
      if (state.currentMatch) {
        const is2v2 = state.currentMatch.teamsPerSide === 2 || (Array.isArray(state.currentMatch.home) && state.currentMatch.home.length === 2);
        if (isHomeWinner) {
          const names = is2v2 ? `${state.currentMatch.home[0].name} & ${state.currentMatch.home[1].name}` : (Array.isArray(state.currentMatch.home) ? state.currentMatch.home[0].name : state.currentMatch.home.name);
          resultText = `🎉 Pemenang: KUBU A (HOME / STIK 1) — ${names}`;
        } else {
          const names = is2v2 ? `${state.currentMatch.away[0].name} & ${state.currentMatch.away[1].name}` : (Array.isArray(state.currentMatch.away) ? state.currentMatch.away[0].name : state.currentMatch.away.name);
          resultText = `🎉 Pemenang: KUBU B (AWAY / STIK 2) — ${names}`;
        }
      } else {
        resultText = isHomeWinner ? '🎉 Pemenang: KUBU A (HOME / STIK 1)' : '🎉 Pemenang: KUBU B (AWAY / STIK 2)';
      }

      DOM.coinResultBanner.textContent = resultText;
      DOM.coin3D.style.transform = isHomeWinner ? 'rotateY(1440deg)' : 'rotateY(1620deg)';

      if (window.matchAudio) window.matchAudio.playCoinResult();

      // Tandai kubu yang menang lempar koin
      applyStikWinnerVisual(state.coinWinnerSide);

      DOM.btnFlipCoin.disabled = false;
    }, 850);
  }

  function applyStikWinnerVisual(side) {
    clearStikWinnerVisual();
    if (side === 'A' && DOM.kubuA) {
      DOM.kubuA.classList.add('home-stik-winner');
      if (DOM.kubuABadgeLabel) DOM.kubuABadgeLabel.textContent = '👑 KUBU A (STIK 1 WINNER)';
    } else if (side === 'B' && DOM.kubuB) {
      DOM.kubuB.classList.add('away-stik-winner');
      if (DOM.kubuBBadgeLabel) DOM.kubuBBadgeLabel.textContent = '👑 KUBU B (STIK 2 WINNER)';
    }
  }

  function clearStikWinnerVisual() {
    if (DOM.kubuA) DOM.kubuA.classList.remove('home-stik-winner');
    if (DOM.kubuB) DOM.kubuB.classList.remove('away-stik-winner');

    const is2v2 = state.teamsPerSide === 2;
    if (DOM.kubuABadgeLabel) DOM.kubuABadgeLabel.textContent = is2v2 ? 'KUBU A / STIK 1' : 'HOME / STIK 1';
    if (DOM.kubuBBadgeLabel) DOM.kubuBBadgeLabel.textContent = is2v2 ? 'KUBU B / STIK 2' : 'AWAY / STIK 2';
  }

  // --- RIWAYAT PERTANDINGAN (MATCH HISTORY) ---
  function toggleHistoryDrawer(open) {
    if (!DOM.historyDrawer) return;
    const shouldOpen = typeof open === 'boolean' ? open : !DOM.historyDrawer.classList.contains('open');
    if (shouldOpen) {
      DOM.historyDrawer.classList.add('open');
      renderHistoryList();
    } else {
      DOM.historyDrawer.classList.remove('open');
    }
  }

  function addMatchToHistory(match) {
    state.history.unshift(match);
    if (state.history.length > 30) state.history.pop();
    saveHistoryToStorage();
    updateHistoryBadge();
  }

  function renderHistoryList() {
    if (!DOM.historyList) return;

    if (state.history.length === 0) {
      DOM.historyList.innerHTML = `
        <div style="text-align: center; color: var(--text-slate-500); padding: 3rem 1rem; font-size: 0.85rem;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">⚽</div>
          Belum ada riwayat hasil gacha.<br>Klik tombol <strong>Roll Match</strong> sekarang!
        </div>
      `;
      return;
    }

    DOM.historyList.innerHTML = state.history.map((item, idx) => {
      const homeArr = Array.isArray(item.home) ? item.home : (item.home ? [item.home] : []);
      const awayArr = Array.isArray(item.away) ? item.away : (item.away ? [item.away] : []);
      const is2v2 = item.teamsPerSide === 2 || homeArr.length > 1;

      const homeNames = homeArr.map(t => t.name).join(' & ') || 'Kubu A';
      const awayNames = awayArr.map(t => t.name).join(' & ') || 'Kubu B';

      const homeCats = [...new Set(homeArr.map(t => t.categoryName || 'Sepak Bola'))].join(', ');
      const awayCats = [...new Set(awayArr.map(t => t.categoryName || 'Sepak Bola'))].join(', ');
      const catText = homeCats === awayCats ? homeCats : `${homeCats} vs ${awayCats}`;

      return `
        <div class="history-card">
          <div class="history-card-top">
            <div style="display: flex; gap: 6px; align-items: center;">
              <span style="color: var(--sky-blue); font-weight: 700;">${item.mode || 'Duel'}</span>
              <span style="font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; background: rgba(255,255,255,0.08); color: var(--amber-yellow); font-weight: 600;">
                ${is2v2 ? '2 vs 2 (4 Tim)' : '1 vs 1 (2 Tim)'}
              </span>
            </div>
            <span>${item.date || ''} • ${item.time || ''}</span>
          </div>
          <div class="history-match-teams">
            <div class="history-team-name" title="${homeNames}">
              <span style="color: var(--amber-yellow); font-size: 0.75rem; margin-right: 3px;">H:</span>${homeNames}
            </div>
            <span class="history-vs">VS</span>
            <div class="history-team-name" style="text-align: right;" title="${awayNames}">
              <span style="color: var(--sky-blue); font-size: 0.75rem; margin-right: 3px;">A:</span>${awayNames}
            </div>
          </div>
          <div class="history-card-bottom">
            <span style="max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${catText}
            </span>
            <button class="btn-apply-history" data-history-idx="${idx}">
              Pasang Lagi ↵
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Tambahkan event listener untuk tombol Pasang Lagi
    DOM.historyList.querySelectorAll('.btn-apply-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-history-idx'), 10);
        applyMatchFromHistory(idx);
      });
    });
  }

  function applyMatchFromHistory(index) {
    const item = state.history[index];
    if (!item) return;

    const homeArr = Array.isArray(item.home) ? item.home : (item.home ? [item.home] : []);
    const awayArr = Array.isArray(item.away) ? item.away : (item.away ? [item.away] : []);
    const teamsCount = item.teamsPerSide || (homeArr.length >= 2 ? 2 : 1);

    setTeamsPerSide(teamsCount, false);

    state.currentMatch = {
      ...item,
      home: homeArr,
      away: awayArr,
      teamsPerSide: teamsCount
    };
    clearStikWinnerVisual();

    if (homeArr[0]) renderTeamCard('A1', homeArr[0], false);
    if (awayArr[0]) renderTeamCard('B1', awayArr[0], false);

    if (teamsCount === 2) {
      if (homeArr[1]) renderTeamCard('A2', homeArr[1], false);
      if (awayArr[1]) renderTeamCard('B2', awayArr[1], false);
    }

    toggleHistoryDrawer(false);
    showToast(`Matchup riwayat dipasang ke arena!`);
  }

  function clearHistory() {
    if (state.history.length === 0) return;
    state.history = [];
    saveHistoryToStorage();
    renderHistoryList();
    updateHistoryBadge();
    showToast('Seluruh riwayat pertandingan telah dihapus.');
  }

  function updateHistoryBadge() {
    if (!DOM.historyCountBadge) return;
    if (state.history.length > 0) {
      DOM.historyCountBadge.textContent = state.history.length;
      DOM.historyCountBadge.style.display = 'inline-block';
    } else {
      DOM.historyCountBadge.style.display = 'none';
    }
  }

  function saveHistoryToStorage() {
    try {
      localStorage.setItem('gacha_match_history', JSON.stringify(state.history));
    } catch (e) { }
  }

  function loadHistoryFromStorage() {
    try {
      const stored = localStorage.getItem('gacha_match_history');
      if (stored) {
        state.history = JSON.parse(stored);
        updateHistoryBadge();
      }
    } catch (e) { }
  }

  // --- TOAST NOTIFICATION ---
  let toastTimeout = null;
  function showToast(message) {
    if (!DOM.toast || !DOM.toastMsg) return;
    DOM.toastMsg.textContent = message;
    DOM.toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, 2800);
  }

  // --- CONFETTI PARTICLE SYSTEM (PURE LIGHTWEIGHT CANVAS) ---
  function launchConfetti() {
    const canvas = DOM.confettiCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors = ['#FFBF00', '#007EFF', '#807040', '#2400FF', '#ffffff'];
    const particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 160,
        y: height * 0.5 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame = null;
    function render() {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38; // gravitasi
        p.rotation += p.rotSpeed;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // --- EVENT LISTENERS REGISTRATION ---
  function attachEventListeners() {
    // Tombol Utama Gacha
    if (DOM.btnRollGacha) {
      DOM.btnRollGacha.addEventListener('click', rollGacha);
    }

    // Toggle Format Tim (1 vs 1 / 2 Tim atau 2 vs 2 / 4 Tim)
    if (DOM.btnFormat1) {
      DOM.btnFormat1.addEventListener('click', () => setTeamsPerSide(1));
    }
    if (DOM.btnFormat2) {
      DOM.btnFormat2.addEventListener('click', () => setTeamsPerSide(2));
    }

    // Toggle Mode
    if (DOM.btnToggleMode) {
      DOM.btnToggleMode.addEventListener('click', toggleMatchMode);
    }

    // Toggle Suara
    if (DOM.btnSoundToggle) {
      DOM.btnSoundToggle.addEventListener('click', toggleAudio);
    }

    // Tukar Home/Away
    if (DOM.btnSwapHomeAway) {
      DOM.btnSwapHomeAway.addEventListener('click', swapHomeAway);
    }

    // Salin Match
    if (DOM.btnCopyMatch) {
      DOM.btnCopyMatch.addEventListener('click', copyMatchupDetails);
    }

    // Drawer Filter Kustom
    if (DOM.btnCustomFilter) {
      DOM.btnCustomFilter.addEventListener('click', toggleFilterDrawer);
    }

    // Modal Lempar Koin
    if (DOM.btnCoinTossModal) {
      DOM.btnCoinTossModal.addEventListener('click', openCoinModal);
    }
    if (DOM.btnCloseCoin) {
      DOM.btnCloseCoin.addEventListener('click', closeCoinModal);
    }
    if (DOM.btnFlipCoin) {
      DOM.btnFlipCoin.addEventListener('click', flipCoin);
    }

    // Drawer Riwayat
    if (DOM.btnOpenHistory) {
      DOM.btnOpenHistory.addEventListener('click', () => toggleHistoryDrawer(true));
    }
    if (DOM.btnCloseHistory) {
      DOM.btnCloseHistory.addEventListener('click', () => toggleHistoryDrawer(false));
    }
    if (DOM.btnClearHistory) {
      DOM.btnClearHistory.addEventListener('click', clearHistory);
    }

    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.currentTarget.getAttribute('data-preset');
        if (preset) applyPreset(preset);
      });
    });

    // Pilih Semua / Kosongkan Kategori
    const btnSelectAll = document.getElementById('btnSelectAllCats');
    const btnClearAll = document.getElementById('btnClearAllCats');
    if (btnSelectAll) btnSelectAll.addEventListener('click', () => selectAllCategories(true));
    if (btnClearAll) btnClearAll.addEventListener('click', () => selectAllCategories(false));

    // Keyboard shortcut (Spacebar untuk Roll)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        rollGacha();
      }
    });

    // Menutup modal dengan tombol Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCoinModal();
        toggleHistoryDrawer(false);
      }
    });
  }

})();
