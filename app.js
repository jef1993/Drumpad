const controlsBtn = document.querySelectorAll(".controls__btn");
const btns = document.querySelector(".btns");
const btn = document.querySelectorAll(".btns__btn");
const btnType = document.querySelectorAll(".btns__type");
const btnKey = document.querySelectorAll(".btns__key");

const playAudio = (url) => {
  const audio = document.createElement("audio");
  audio.src = url;
  audio.preload = "auto";
  document.querySelector(".audio-area").appendChild(audio);
  audio.play();

  audio.onended = function () {
    this.parentNode.removeChild(this);
  };
};

let currentFile = 1;

let instruments = [
  ["crash", 1, 11],
  ["clap", 1, 12],
  ["perc", 1, 15],
  ["ride", 1, 3],
  ["hihat-closed", 1, 15],
  ["clap", 1, 12],
  ["tom-high", 1, 2],
  ["tom-mid", 1, 2],
  ["hihat-open", 1, 10],
  ["snare", 1, 10],
  ["kick", 1, 15],
  ["tom-low", 1, 2],
];

let keyMap = ["q", "w", "e", "r", "a", "s", "d", "f", "z", "x", "c", "v"];
let layout = instruments.map((el, i) => el.concat(keyMap[i]));

const playAudioTarget = function (i) {
  const audioNumber = layout[i][1].toString().padStart(2, "0");
  playAudio(`audio/${layout[i][0]}/${layout[i][0]}_${audioNumber}.wav`);
};

// Detect instrument selection
controlsBtn.forEach((el, index) => {
  el.value = 1;
  el.min = 1;
  el.max = layout[index][2];
  el.addEventListener(
    "change",
    (e) => {
      layout[index][1] = e.target.value;
      playAudioTarget(index);
    },
    true
  );
});

// Play selected audio on click
btn.forEach((el, index) => {
  el.addEventListener(
    "click",
    () => {
      playAudioTarget(index);
    },
    true
  );

  //Prevent double click selecting text
  el.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
});
// Label instruments' type on button
btnType.forEach((el, index) => {
  el.innerHTML = layout[index][0];
});

// Label input key on button
btnKey.forEach((el, index) => {
  el.innerHTML = layout[index][3];
});

// Play selected audio on keydown

document.addEventListener(
  "keydown",
  (e) => {
    const targetIndex = layout.findIndex((el) => el[3] === e.key.toLowerCase());

    if (targetIndex !== -1 && !e.repeat) {
      playAudioTarget(targetIndex);
      btn[targetIndex].classList.add("keyPress");
    }
  },
  true
);

document.addEventListener(
  "keyup",
  (e) => {
    const targetIndex = layout.findIndex((el) => el[3] === e.key.toLowerCase());
    if (targetIndex !== -1) {
      btn[targetIndex].classList.remove("keyPress");
    }
  },
  true
);
