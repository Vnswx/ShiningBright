const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const titleEl = document.getElementById("musicTitle");

const playlist = [
  { title: "Naff - Terendap Laraku", src: "Assets/music/music.mp3" },
  { title: "Lagu Kedua", src: "audio/lagu2.mp3" },
  { title: "Lagu Ketiga", src: "audio/lagu3.mp3" }
];

let index = parseInt(localStorage.getItem("musicIndex")) || 0;
let savedTime = parseFloat(localStorage.getItem("musicTime")) || 0;
let isPlaying = localStorage.getItem("musicPlaying") === "true";

function loadMusic(i, keepTime = false) {
  audio.src = playlist[i].src;
  titleEl.textContent = playlist[i].title;

  if (keepTime) {
    audio.currentTime = savedTime;
  }

  if (isPlaying) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    playBtn.textContent = "▶";
  }
}

audio.addEventListener("timeupdate", () => {
  localStorage.setItem("musicTime", audio.currentTime);
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
    localStorage.setItem("musicPlaying", true);
  } else {
    audio.pause();
    playBtn.textContent = "▶";
    localStorage.setItem("musicPlaying", false);
  }
});

nextBtn.addEventListener("click", () => {
  index = (index + 1) % playlist.length;
  localStorage.setItem("musicIndex", index);
  localStorage.setItem("musicTime", 0);
  loadMusic(index);
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + playlist.length) % playlist.length;
  localStorage.setItem("musicIndex", index);
  localStorage.setItem("musicTime", 0);
  loadMusic(index);
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("musicIndex", index);
  localStorage.setItem("musicTime", audio.currentTime);
  localStorage.setItem("musicPlaying", !audio.paused);
});

loadMusic(index, true);