/* ================= CHỈNH NỘI DUNG Ở ĐÂY ================= */
const CONFIG = {
  page1Title:  "chào linh phan",
  page1Hint:   "CLICK THE ENVELOPE!",

  songs: [
    {
      title: "Take Care - Youz",
      audio: "NHAC/1.mp3", 
      cover: "ICON/cover1.jpg"
    },
    {
      title: "Don't do That - Leellamarz · TOIL",
      audio: "NHAC/2.mp3", 
      cover: "ICON/cover2.jpg" 
    },
    {
      title: "OMG - NewJeans",
      audio: "NHAC/3.mp3", 
      cover: "ICON/cover3.jpg"
    }
  ],

  page4Title:  "HAPPY BIRTHDAY",
  page4Msg:    "Tuoi moi vui ve.",
  p4Question:  "Huy Nguyễn có dzai không?",
  p4AnswerYes: "Yes",
  p4AnswerAbs: "Absolutely"
};
/* =========================================================== */

document.getElementById('p1Title').textContent    = CONFIG.page1Title;
document.getElementById('p1Hint').textContent     = CONFIG.page1Hint;
document.getElementById('p4Title').textContent    = CONFIG.page4Title;
document.getElementById('p4Msg').textContent      = CONFIG.page4Msg;
document.getElementById('p4Question').textContent   = CONFIG.p4Question;
document.getElementById('p4AnswerYes').textContent  = CONFIG.p4AnswerYes;
document.getElementById('p4AnswerAbs').textContent  = CONFIG.p4AnswerAbs;

// ---- page navigation ----
const p4Modal = document.getElementById('p4Modal');
const envBtnRef = document.getElementById('envelopeBtn');
const bgAudio   = document.getElementById('bgAudio');
const vinyl  = document.getElementById('vinyl');
const p2Play = document.getElementById('p2Play');

// CHỈNH VOLUME XUỐNG 30%
bgAudio.volume = 0.3;

function goTo(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if(id === 'page1'){
    envBtnRef.classList.remove('open');
  }
  
  // LOGIC: NẾU KHÔNG PHẢI TRANG 2 THÌ ÉP TẮT NHẠC VÀ DỪNG ĐĨA THAN
  if(id !== 'page2') {
    bgAudio.pause();
    vinyl.classList.add('paused');
    if(p2Play) p2Play.textContent = '▶';
  } else {
    // Nếu quay lại trang 2 thì phát tiếp
    bgAudio.play().catch(()=>{});
  }

  if(id === 'page4'){
    p4Modal.classList.remove('show');
    setTimeout(()=> p4Modal.classList.add('show'), 500);
  }
}

document.querySelectorAll('.p4-modal-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> p4Modal.classList.remove('show'));
});
document.querySelectorAll('[data-go]').forEach(btn=>{
  btn.addEventListener('click', ()=> goTo(btn.dataset.go));
});

// ---- MỞ PHONG BÌ & TỰ ĐỘNG PHÁT NHẠC ----
envBtnRef.addEventListener('click', ()=>{
  if(envBtnRef.classList.contains('open')) return;
  envBtnRef.classList.add('open');
  
  bgAudio.play().catch(e => console.log("Lỗi autoplay:", e));

  setTimeout(()=> {
    goTo('page2');
  }, 850);
});

// ---- vinyl + audio playback & PLAYLIST LOGIC ----
const p2BarFill = document.getElementById('p2BarFill');
const p2Time = document.getElementById('p2Time');
const p2Tags = document.getElementById('p2Tags');
const vinylCover = document.getElementById('vinylCover');
const songBtns = document.querySelectorAll('.song-btn');

function formatTime(sec){
  if(!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function loadSong(index) {
  const song = CONFIG.songs[index];
  
  vinylCover.style.opacity = 0;
  setTimeout(() => {
    vinylCover.src = song.cover;
    vinylCover.style.opacity = 1;
  }, 300);

  bgAudio.src = song.audio;
  p2Tags.textContent = song.title;
  
  p2BarFill.style.width = '0%';
  p2Time.textContent = '0:00 / 0:00';
  
  songBtns.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Khởi tạo bài hát đầu tiên
loadSong(0);

songBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    loadSong(index);
    bgAudio.play().catch(()=>{}); 
  });
});

p2Play.addEventListener('click', ()=>{
  if(!bgAudio.src || bgAudio.src.endsWith(window.location.pathname)){
    vinyl.classList.toggle('paused');
    p2Play.textContent = vinyl.classList.contains('paused') ? '▶' : '❚❚';
    return;
  }
  if(bgAudio.paused) bgAudio.play().catch(()=>{});
  else bgAudio.pause();
});

bgAudio.addEventListener('play',  ()=>{ vinyl.classList.remove('paused'); p2Play.textContent = '❚❚'; });
bgAudio.addEventListener('pause', ()=>{ vinyl.classList.add('paused');    p2Play.textContent = '▶'; });
bgAudio.addEventListener('ended', ()=>{ vinyl.classList.add('paused');    p2Play.textContent = '▶'; });
bgAudio.addEventListener('loadedmetadata', ()=>{
  p2Time.textContent = `${formatTime(0)} / ${formatTime(bgAudio.duration)}`;
});
bgAudio.addEventListener('timeupdate', ()=>{
  if(bgAudio.duration){
    p2BarFill.style.width = (bgAudio.currentTime / bgAudio.duration * 100) + '%';
    p2Time.textContent = `${formatTime(bgAudio.currentTime)} / ${formatTime(bgAudio.duration)}`;
  }
});

// ---- floating hearts on page 4 ----
const heartWrap = document.getElementById('heartWrap');
function spawnFloatingHeart(){
  const h = document.createElement('span');
  h.className = 'float-heart';
  h.textContent = '♥';
  h.style.left = (10 + Math.random()*80) + '%';
  h.style.animationDuration = (3.5 + Math.random()*2.5) + 's';
  h.style.fontSize = (10 + Math.random()*10) + 'px';
  heartWrap.appendChild(h);
  setTimeout(()=> h.remove(), 6000);
}
setInterval(()=>{
  if(document.getElementById('page4').classList.contains('active')) spawnFloatingHeart();
}, 450);