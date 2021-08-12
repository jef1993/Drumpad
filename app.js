const btn = document.querySelectorAll(".btns__btn");
const controlsBtn = document.querySelectorAll(".controls__btn");

const playAudio = (url) => {
  const audio = document.createElement("audio");
  audio.src = url;
  document.querySelector(".audio-area").appendChild(audio);
  audio.play();

  audio.onended = function () {
    this.parentNode.removeChild(this);
  };
};

let currentFile = 1;
let layout = [
  ["perc", 1],
  ["crash", 1],
  ["tom-high", 1],
  ["ride", 1],
  ["hihat-open", 1],
  ["snare", 1],
  ["tom-mid", 1],
  ["clap", 1],
  ["hihat-closed", 1],
  ["snare", 1],
  ["tom-low", 1],
  ["kick", 1],
];

const playAudioTarget = function (i) {
  playAudio(`audio/${layout[i][0]}/${layout[i][0]}_0${layout[i][1]}.wav`);
};

controlsBtn.forEach((el, index) => {
  el.addEventListener("change", (e) => {
    console.log(e.target.value);
    layout[index][1] = e.target.value;
    playAudioTarget(index);
  });
});

btn.forEach((el, index) =>
  el.addEventListener("click", () => {
    playAudioTarget(index);
  })
);

document
  .querySelector(`.controls__btn--1`)
  .addEventListener("click", function () {
    document.querySelector(`.controls__btn--1`).innerHTML = currentFile;
    currentFile = currentFile < 3 ? currentFile + 1 : 1;
  });
