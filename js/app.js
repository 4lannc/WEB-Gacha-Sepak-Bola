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
    isRolling: false,
    currentMatch: null,
    coinWinnerSlot: null,
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

    // Cards
    DOM.cardTeam1 = document.getElementById('cardTeam1');
    DOM.cardTeam2 = document.getElementById('cardTeam2');
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    initAudioUI();
    calculatePresetCounts();
    renderCategoryGrid();
    updateActivePoolCounter();
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

  // --- GACHA ROULETTE ENGINE ---
  function rollGacha() {
    if (state.isRolling) return;
    if (window.matchAudio) window.matchAudio.ensureContext();

    // 1. Kumpulkan pool tim yang eligible
    let pool = [];

    if (state.matchMode === 'same_category') {
      // Ambil kategori-kategori terpilih yang memiliki minimal 2 tim
      const validCategories = Array.from(state.selectedCategories).filter(catId => {
        const cat = window.TEAMS_DATABASE[catId];
        return cat && cat.teams.length >= 2;
      });

      if (validCategories.length === 0) {
        showToast('Pilih kategori yang memiliki minimal 2 tim untuk mode ini!');
        return;
      }

      // Pilih 1 kategori secara acak untuk kedua tim
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

    if (pool.length < 2) {
      showToast('Pool tim terlalu sedikit untuk diundi (minimal 2 tim)!');
      return;
    }

    // 2. Memulai animasi putaran roulette
    state.isRolling = true;
    state.coinWinnerSlot = null; // reset pemenang lempar koin sebelumnya
    clearStikWinnerVisual();

    DOM.btnRollGacha.classList.add('loading');
    DOM.btnRollGacha.disabled = true;
    DOM.rollBtnLabel.textContent = 'MENGACAK ARENA...';

    DOM.cardTeam1.classList.add('card-rolling');
    DOM.cardTeam2.classList.add('card-rolling');
    DOM.cardTeam1.classList.remove('card-revealed');
    DOM.cardTeam2.classList.remove('card-revealed');

    let stepCount = 0;
    const totalSteps = 26; // Total lompatan acak
    let currentDelay = 45; // Delay awal sangat cepat (ms)

    function shuffleStep() {
      stepCount++;

      // Ambil 2 tim acak untuk preview putaran
      const idx1 = Math.floor(Math.random() * pool.length);
      let idx2 = Math.floor(Math.random() * pool.length);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * pool.length);
      }

      renderTeamCard(1, pool[idx1], true);
      renderTeamCard(2, pool[idx2], true);

      if (window.matchAudio) window.matchAudio.playTick();

      if (stepCount < totalSteps) {
        // Kurva deselerasi realistis (melambat di 8 putaran terakhir)
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

  // --- KUNCI HASIL & ANTI-BENTROK ---
  function finalizeMatch(pool) {
    let pick1 = Math.floor(Math.random() * pool.length);
    let pick2 = Math.floor(Math.random() * pool.length);

    // Algoritma ketat Anti-Bentrok: Nama dan ID tidak boleh sama
    let safetyCounter = 0;
    while (
      (pick2 === pick1 || pool[pick1].name.trim().toLowerCase() === pool[pick2].name.trim().toLowerCase()) &&
      safetyCounter < 500
    ) {
      pick2 = Math.floor(Math.random() * pool.length);
      safetyCounter++;
    }

    const team1 = pool[pick1];
    const team2 = pool[pick2];

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    state.currentMatch = {
      home: team1,
      away: team2,
      mode: state.matchMode === 'same_category' ? 'Satu Kategori' : 'Bebas / Campur',
      time: timeStr,
      date: dateStr,
      timestamp: Date.now()
    };

    // Bersihkan kelas putaran
    DOM.cardTeam1.classList.remove('card-rolling');
    DOM.cardTeam2.classList.remove('card-rolling');
    DOM.cardTeam1.classList.add('card-revealed');
    DOM.cardTeam2.classList.add('card-revealed');

    // Tampilkan data lengkap
    renderTeamCard(1, team1, false);
    renderTeamCard(2, team2, false);

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
  function renderTeamCard(slot, team, isShuffling) {
    const card = slot === 1 ? DOM.cardTeam1 : DOM.cardTeam2;
    if (!card) return;

    const nameEl = document.getElementById(`t${slot}Name`);
    const catBadge = document.getElementById(`t${slot}CategoryBadge`);
    const emblemWrapper = document.getElementById(`t${slot}EmblemWrapper`);
    const imgLogo = document.getElementById(`t${slot}Logo`);
    const textFallback = document.getElementById(`t${slot}TextFallback`);
    const subtext = document.getElementById(`t${slot}Subtext`);

    if (nameEl) nameEl.textContent = team.name;
    if (catBadge) catBadge.textContent = team.categoryName || 'Sepak Bola';

    const color1 = (team.colors && team.colors[0]) ? team.colors[0] : (slot === 1 ? '#00ff88' : '#00d2ff');
    const color2 = (team.colors && team.colors[1]) ? team.colors[1] : '#07152b';

    // Update styling background emblem dinamis sesuai warna klub
    if (emblemWrapper) {
      emblemWrapper.style.borderColor = color1;
      emblemWrapper.style.boxShadow = `0 4px 20px ${color1}44`;
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
      textFallback.style.color = color1;
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

    renderTeamCard(1, state.currentMatch.home, false);
    renderTeamCard(2, state.currentMatch.away, false);

    showToast('Posisi Home dan Away berhasil ditukar!');
  }

  // --- SALIN MATCHUP KE CLIPBOARD ---
  function copyMatchupDetails() {
    if (!state.currentMatch) {
      showToast('Silakan Roll Match terlebih dahulu!');
      return;
    }

    const { home, away, mode, time, date } = state.currentMatch;
    const textToCopy = `🔥 MATCHDAY ROULETTE ARENA 🔥
🎮 HOME (Stik 1): ${home.name} [${home.categoryName}]
⚔️ AWAY (Stik 2): ${away.name} [${away.categoryName}]
🏆 Mode: ${mode}
⏰ Jadwal Undian: ${date} pukul ${time} WIB
Siapkan stik, adu strategi, dan raih kemenangan! ⚽`;

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
      state.coinWinnerSlot = isHomeWinner ? 1 : 2;

      let resultText = '';
      if (state.currentMatch) {
        const winner = isHomeWinner ? state.currentMatch.home : state.currentMatch.away;
        const side = isHomeWinner ? 'HOME / STIK 1' : 'AWAY / STIK 2';
        resultText = `🎉 Pemenang: ${winner.name} (${side})`;
      } else {
        resultText = isHomeWinner ? '🎉 Pemenang: TIM 1 (HOME / STIK 1)' : '🎉 Pemenang: TIM 2 (AWAY / STIK 2)';
      }

      DOM.coinResultBanner.textContent = resultText;
      DOM.coin3D.style.transform = isHomeWinner ? 'rotateY(1440deg)' : 'rotateY(1620deg)';

      if (window.matchAudio) window.matchAudio.playCoinResult();

      // Tandai kartu tim yang menang lempar koin
      applyStikWinnerVisual(state.coinWinnerSlot);

      DOM.btnFlipCoin.disabled = false;
    }, 850);
  }

  function applyStikWinnerVisual(slot) {
    clearStikWinnerVisual();
    const card = slot === 1 ? DOM.cardTeam1 : DOM.cardTeam2;
    if (card) {
      card.classList.add('home-stik-winner');
      const sideBadge = card.querySelector('.side-badge');
      if (sideBadge) {
        sideBadge.innerHTML = `<span class="side-badge-dot"></span> 👑 STIK 1 (WINNER)`;
      }
    }
  }

  function clearStikWinnerVisual() {
    if (DOM.cardTeam1) {
      DOM.cardTeam1.classList.remove('home-stik-winner');
      const badge = DOM.cardTeam1.querySelector('.side-badge');
      if (badge) badge.innerHTML = `<span class="side-badge-dot"></span> HOME / STIK 1`;
    }
    if (DOM.cardTeam2) {
      DOM.cardTeam2.classList.remove('home-stik-winner');
      const badge = DOM.cardTeam2.querySelector('.side-badge');
      if (badge) badge.innerHTML = `<span class="side-badge-dot"></span> AWAY / STIK 2`;
    }
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

    DOM.historyList.innerHTML = state.history.map((item, idx) => `
      <div class="history-card">
        <div class="history-card-top">
          <span style="color: var(--neon-cyan); font-weight: 700;">${item.mode}</span>
          <span>${item.date} • ${item.time}</span>
        </div>
        <div class="history-match-teams">
          <div class="history-team-name" title="${item.home.name}">
            <span style="color: var(--neon-green); font-size: 0.75rem; margin-right: 3px;">H:</span>${item.home.name}
          </div>
          <span class="history-vs">VS</span>
          <div class="history-team-name" style="text-align: right;" title="${item.away.name}">
            <span style="color: var(--neon-cyan); font-size: 0.75rem; margin-right: 3px;">A:</span>${item.away.name}
          </div>
        </div>
        <div class="history-card-bottom">
          <span style="max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${item.home.categoryName} vs ${item.away.categoryName}
          </span>
          <button class="btn-apply-history" data-history-idx="${idx}">
            Pasang Lagi ↵
          </button>
        </div>
      </div>
    `).join('');

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

    state.currentMatch = item;
    clearStikWinnerVisual();

    renderTeamCard(1, item.home, false);
    renderTeamCard(2, item.away, false);

    toggleHistoryDrawer(false);
    showToast(`Matchup ${item.home.name} vs ${item.away.name} dipasang!`);
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
    } catch (e) {}
  }

  function loadHistoryFromStorage() {
    try {
      const stored = localStorage.getItem('gacha_match_history');
      if (stored) {
        state.history = JSON.parse(stored);
        updateHistoryBadge();
      }
    } catch (e) {}
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

    const colors = ['#00ff88', '#00d2ff', '#ffb703', '#ffffff', '#ef233c'];
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
