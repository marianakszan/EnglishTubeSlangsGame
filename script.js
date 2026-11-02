const ADMIN_USER = "admmariana2026";    
const ADMIN_PASS = "sepin2026"; 

const initialSlangs = [
  {
    id: 'slang-1',
    slang: 'Footy',
    meaning: 'Maria, vamos ver os meninos jogarem _________. (Tradução: Futebol australiano)',
    explanation: 'Na Austrália, "Footy" é a forma abreviada e carinhosa de chamar o futebol.',
    country: 'Austrália',
    flag: 'https://flagcdn.com/w40/au.png',
    img: 'footy1.jfif'
  },
  {
    id: 'slang-2',
    slang: 'Brekkie',
    meaning: 'Hey, want to get some _________? (Tradução: Café da manhã)',
    explanation: '"Brekkie" é a gíria australiana clássica para breakfast (café da manhã).',
    country: 'Austrália',
    flag: 'https://flagcdn.com/w40/au.png',
    img: 'brekkie1.jfif'
  },
  {
    id: 'slang-3',
    slang: 'Bloody',
    meaning: 'That is a _________ good movie! (Tradução: Palavra de ênfase / Muito bom)',
    explanation: '"Bloody" é uma palavra de ênfase muito comum no inglês britânico.',
    country: 'Reino Unido',
    flag: 'https://flagcdn.com/w40/gb.png',
    img: 'bloody1.jfif'
  }
];

const successPhrases = [
  "Acertou! Excelente raciocínio!",
  "Mandou muito bem! Boa dedução!",
  "Isso aí! Você tem ótimo instinto para gírias!",
  "Perfeito! Na mosca!",
  "Brilhante! Conexão feita com sucesso!"
];

let slangsData = initialSlangs;
try {
  const saved = localStorage.getItem('english_tube_slangs');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      slangsData = parsed;
    }
  }
} catch (e) {
  localStorage.removeItem('english_tube_slangs');
}

let completedIds = [];
let activeChallenge = null;
const balloonColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// Elementos DOM
const introScreen = document.getElementById('intro-screen');
const gameMainWrapper = document.getElementById('game-main-wrapper');
const startGameBtn = document.getElementById('start-game-btn');

const skyArea = document.getElementById('sky-area');
const challengeModal = document.getElementById('challenge-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCountry = document.getElementById('modal-country');
const modalFlagImg = document.getElementById('modal-flag-img');
const modalComicImg = document.getElementById('modal-comic-img');
const optionsList = document.getElementById('options-list');
const feedbackMsg = document.getElementById('feedback-msg');
const scoreText = document.getElementById('score-text');
const balloonsCount = document.getElementById('balloons-count');
const completedGallery = document.getElementById('completed-gallery');
const resetGameBtn = document.getElementById('reset-game-btn');

const adminToggleBtn = document.getElementById('admin-toggle-btn');
const adminModal = document.getElementById('admin-modal');
const adminCloseBtn = document.getElementById('admin-close-btn');
const adminLoginSec = document.getElementById('admin-login-sec');
const adminContentSec = document.getElementById('admin-content-sec');
const adminUserInput = document.getElementById('admin-user-input');
const adminPassInput = document.getElementById('admin-pass-input');
const adminLoginBtn = document.getElementById('admin-login-btn');
const addSlangForm = document.getElementById('add-slang-form');
const adminSlangList = document.getElementById('admin-slang-list');

const clearFlagBtn = document.getElementById('clear-flag-btn');
const clearImgBtn = document.getElementById('clear-img-btn');
const inputFlagFile = document.getElementById('input-flag-file');
const inputImgFile = document.getElementById('input-img-file');
const inputFlagUrl = document.getElementById('input-flag-url');
const inputImgUrl = document.getElementById('input-img-url');

document.addEventListener('DOMContentLoaded', () => {
  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      introScreen.classList.add('hidden');
      gameMainWrapper.classList.remove('hidden');
      updateStats();
      startBalloonSpawner();
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (resetGameBtn) resetGameBtn.addEventListener('click', resetGame);
  if (adminToggleBtn) adminToggleBtn.addEventListener('click', () => adminModal.classList.remove('hidden'));
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', () => adminModal.classList.add('hidden'));
  if (adminLoginBtn) adminLoginBtn.addEventListener('click', handleAdminLogin);
  if (addSlangForm) addSlangForm.addEventListener('submit', handleAddSlang);

  if (clearFlagBtn) {
    clearFlagBtn.addEventListener('click', () => {
      if (inputFlagFile) inputFlagFile.value = '';
      if (inputFlagUrl) inputFlagUrl.value = '';
    });
  }

  if (clearImgBtn) {
    clearImgBtn.addEventListener('click', () => {
      if (inputImgFile) inputImgFile.value = '';
      if (inputImgUrl) inputImgUrl.value = '';
    });
  }
});

function resetGame() {
  completedIds = [];
  spawnedIdsThisGame = []; // <--- ADICIONE ESTA LINHA NO SEU RESET
  skyArea.innerHTML = '';
  completedGallery.innerHTML = '<p class="empty-msg">Estoure os balões e acerte para colecionar as tirinhas aqui!</p>';
  updateStats();
  updateBalloonCount();
  closeModal();
  
  gameMainWrapper.classList.add('hidden');
  introScreen.classList.remove('hidden');
  
  const winScreen = document.getElementById('win-screen');
  if (winScreen) winScreen.remove();
}
  completedIds = [];
  skyArea.innerHTML = '';
  completedGallery.innerHTML = '<p class="empty-msg">Estoure os balões e acerte para colecionar as tirinhas aqui!</p>';
  updateStats();
  updateBalloonCount();
  closeModal();
  
  // Adicione estas duas linhas para voltar para a tela de introdução:
  gameMainWrapper.classList.add('hidden');
  introScreen.classList.remove('hidden');
  
  const winScreen = document.getElementById('win-screen');
  if (winScreen) winScreen.remove();
function updateStats() {
  scoreText.textContent = `${completedIds.length} / 3`;
}
let spawnedIdsThisGame = []; // Guarda todas as gírias que já ganharam um balão nesta rodada

function startBalloonSpawner() {
  setInterval(() => {
    // Para de criar balões se o jogador já atingiu 3 acertos
    if (completedIds.length >= 3) return;

    // Pega os IDs dos balões que estão subindo agora na tela
    const activeBalloons = document.querySelectorAll('.balloon');
    const activeBalloonIds = Array.from(activeBalloons).map(b => b.dataset.slangId);

    // FILTRO TOTAL: Não pode estar concluído, não pode estar ativo na tela E não pode já ter aparecido antes na partida
    const availableSlangs = slangsData.filter(item => 
      !completedIds.includes(item.id) && 
      !activeBalloonIds.includes(item.id) && 
      !spawnedIdsThisGame.includes(item.id)
    );

    // Se acabaram as gírias disponíveis e o céu estiver vazio, podemos resetar a lista de já tiradas para o jogo não travar
    if (availableSlangs.length === 0) {
      if (activeBalloons.length === 0 && completedIds.length < 3) {
        spawnedIdsThisGame = []; 
      }
      return;
    }

    // Mantém até 5 balões flutuando simultaneamente
    if (activeBalloons.length < 5) {
      const randomSlang = availableSlangs[Math.floor(Math.random() * availableSlangs.length)];
      
      // Registra que essa gíria já foi sorteada para o balão
      spawnedIdsThisGame.push(randomSlang.id);
      
      createBalloon(randomSlang);
    }
  }, 1000);
}
function createBalloon(slangItem) {
  if (completedIds.length >= 3) return;

  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.dataset.slangId = slangItem.id;
  
  const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.backgroundColor = color;

  const leftPos = Math.random() * Math.max(100, skyArea.clientWidth - 80);
  const duration = 5 + Math.random() * 4; 
  
  balloon.style.left = `${leftPos}px`;
  balloon.style.animationDuration = `${duration}s`;

  balloon.innerHTML = `<div class="balloon-string"></div>`;

  balloon.addEventListener('click', () => {
    if (completedIds.length >= 3) return;
    playPopSound();
    balloon.classList.add('popping');
    setTimeout(() => {
      balloon.remove();
      openChallenge(slangItem);
      updateBalloonCount();
    }, 200);
  });

  balloon.addEventListener('animationend', () => {
    balloon.remove();
    updateBalloonCount();
  });

  skyArea.appendChild(balloon);
  updateBalloonCount();
}

function updateBalloonCount() {
  balloonsCount.textContent = skyArea.querySelectorAll('.balloon').length;
}

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function openChallenge(slangItem) {
  activeChallenge = slangItem;
  modalCountry.textContent = slangItem.country;
  modalFlagImg.src = slangItem.flag || 'https://via.placeholder.com/20x14?text=🏳️';
  modalComicImg.src = slangItem.img;
  feedbackMsg.className = 'feedback-msg hidden';
  
  const expContainer = document.getElementById('explanation-container');
  if (expContainer) expContainer.classList.add('hidden');
  
  optionsList.innerHTML = '';
  const options = [...slangsData].sort(() => 0.5 - Math.random());

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<em>${opt.meaning}</em>`;
    btn.addEventListener('click', () => checkAnswer(opt.id));
    optionsList.appendChild(btn);
  });

  challengeModal.classList.remove('hidden');
}

function closeModal() {
  challengeModal.classList.add('hidden');
}

function checkAnswer(selectedId) {
  if (selectedId === activeChallenge.id) {
    const randomPhrase = successPhrases[Math.floor(Math.random() * successPhrases.length)];
    
    feedbackMsg.textContent = `✓ ${randomPhrase}`;
    feedbackMsg.className = 'feedback-msg correct';

    const expContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    if (activeChallenge.explanation) {
      explanationText.textContent = activeChallenge.explanation;
      expContainer.classList.remove('hidden');
    }

    if (!completedIds.includes(activeChallenge.id)) {
      completedIds.push(activeChallenge.id);
      addToGallery(activeChallenge);
      updateStats();
    }

    // ALTERADO AQUI: 18 segundos de exibição da explicação (18000 milissegundos) antes de fechar/concluir
    setTimeout(() => {
      closeModal();
      if (completedIds.length >= 3) {
        triggerWinScreen();
      }
    }, 18000); 
  } else {
    feedbackMsg.textContent = '✕ Opa! Essa não é a tradução desta tirinha. Tente novamente!';
    feedbackMsg.className = 'feedback-msg wrong';
  }
}

function triggerWinScreen() {
  skyArea.innerHTML = '';
  updateBalloonCount();

  const winDiv = document.createElement('div');
  winDiv.id = 'win-screen';
  winDiv.style.cssText = `
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255, 255, 255, 0.95); display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 15px; z-index: 50; text-align: center; padding: 20px;
  `;
  winDiv.innerHTML = `
    <h2 style="font-size: 2rem; color: #16a34a;">🎉 Parabéns! Desafio Concluído!</h2>
    <p style="font-size: 1.1rem; color: #475569;">Você acertou as gírias e desvendou todas as tirinhas com sucesso!</p>
    <button onclick="resetGame()" class="btn btn-primary" style="font-size: 1rem; padding: 10px 20px;">Jogar Novamente</button>
  `;
  skyArea.appendChild(winDiv);
}

function addToGallery(slangItem) {
  const emptyMsg = completedGallery.querySelector('.empty-msg');
  if (emptyMsg) emptyMsg.remove();

  const card = document.createElement('div');
  card.className = 'completed-card';
  card.innerHTML = `
    <img src="${slangItem.img}" alt="${slangItem.slang}">
    <div class="gallery-country-info">
      <img src="${slangItem.flag || ''}" class="gallery-flag-icon" alt="Bandeira">
      <span>${slangItem.country}</span>
    </div>
  `;
  completedGallery.appendChild(card);
}

function handleAdminLogin() {
  const userEntered = adminUserInput.value.trim();
  const passEntered = adminPassInput.value.trim();

  if (userEntered === ADMIN_USER && passEntered === ADMIN_PASS) {
    adminLoginSec.classList.add('hidden');
    adminContentSec.classList.remove('hidden');
    renderAdminList();
  } else {
    alert('Usuário ou senha incorretos!');
  }
}

function handleAddSlang(e) {
  e.preventDefault();
  
  const slang = document.getElementById('input-slang').value.trim();
  const meaning = document.getElementById('input-meaning').value.trim();
  const explanation = document.getElementById('input-explanation').value.trim();
  const country = document.getElementById('input-country').value.trim();
  
  const flagUrl = document.getElementById('input-flag-url').value.trim();
  const flagFile = document.getElementById('input-flag-file').files[0];
  
  const imgUrl = document.getElementById('input-img-url').value.trim();
  const imgFile = document.getElementById('input-img-file').files[0];

  let pendingFlag = flagUrl || 'https://via.placeholder.com/20x14?text=🏳️';
  let pendingImg = imgUrl || 'https://via.placeholder.com/400x220?text=Sem+Imagem';
  
  let filesToProcess = 0;
  if (flagFile) filesToProcess++;
  if (imgFile) filesToProcess++;

  const finalizeSave = () => {
    const newItem = {
      id: 'slang-' + Date.now(),
      slang,
      meaning,
      explanation,
      country,
      flag: pendingFlag,
      img: pendingImg
    };

    slangsData.push(newItem);
    
    try {
      localStorage.setItem('english_tube_slangs', JSON.stringify(slangsData));
      updateStats();
      renderAdminList();
      addSlangForm.reset();
      alert('Gíria adicionada com sucesso!');
    } catch (err) {
      alert('Aviso: Armazenamento cheio. Tente usar links (URLs) em vez de arquivos locais.');
      slangsData.pop();
    }
  };

  if (flagFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      pendingFlag = event.target.result;
      filesToProcess--;
      if (filesToProcess === 0) finalizeSave();
    };
    reader.readAsDataURL(flagFile);
  }

  if (imgFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      pendingImg = event.target.result;
      filesToProcess--;
      if (filesToProcess === 0) finalizeSave();
    };
    reader.readAsDataURL(imgFile);
  }

  if (filesToProcess === 0) {
    finalizeSave();
  }
}

function renderAdminList() {
  adminSlangList.innerHTML = '';
  
  if (slangsData.length === 0) {
    adminSlangList.innerHTML = '<p style="color:#64748b; font-size:0.85rem;">Nenhuma gíria cadastrada.</p>';
    return;
  }

  slangsData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'admin-slang-item';
    div.innerHTML = `
      <span><strong>${item.slang}</strong> (${item.country})</span>
      <button class="btn btn-outline" type="button" onclick="deleteSlang('${item.id}')">Excluir</button>
    `;
    adminSlangList.appendChild(div);
  });
}

function deleteSlang(id) {
  if (confirm('Tem certeza que deseja excluir esta gíria?')) {
    slangsData = slangsData.filter(item => item.id !== id);
    completedIds = completedIds.filter(completedId => completedId !== id);
    
    localStorage.setItem('english_tube_slangs', JSON.stringify(slangsData));
    
    updateStats();
    renderAdminList();
    
    const activeBalloons = skyArea.querySelectorAll('.balloon');
    activeBalloons.forEach(b => {
      if (b.dataset.slangId === id) {
        b.remove();
      }
    });
    updateBalloonCount();
    
    alert('Gíria excluída com sucesso!');
  }
}