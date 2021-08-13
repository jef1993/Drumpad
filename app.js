const btns = document.querySelector(".btns");
const btn = document.querySelectorAll(".btns__btn");
const btnType = document.querySelectorAll(".btns__type");
const btnKey = document.querySelectorAll(".btns__key");
const controlsBtn = document.querySelectorAll(".controls__btn");
const controlsBigBtn = document.querySelectorAll(".controls__big-btn");
const controlsAudio = document.querySelectorAll(".controls__audio");
const controlsSpinner = document.querySelectorAll(".controls__spinner");
const controlsType = document.querySelectorAll(".controls__type");
const controlsKey = document.querySelectorAll(".controls__key");

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
  ["loop", 1, 15],
  ["rise", 1, 10],
];

let keyMap = [
  "r",
  "t",
  "y",
  "u",
  "f",
  "g",
  "h",
  "j",
  "v",
  "b",
  "n",
  "m",
  "q",
  "a",
];
let layout = instruments.map((el, i) => el.concat(keyMap[i]));
// const targetAudio = document.querySelector(`[src='${url}']`);

const playAudio = (url, overlap = true) => {
  if (overlap) {
    const audio = document.createElement("audio");
    audio.src = url;
    audio.preload = "auto";
    document.querySelector(".audio-area").appendChild(audio);
    audio.play();
    audio.onended = function () {
      this.parentNode.removeChild(this);
    };
  } else {
    const targetAudio = document.querySelector(`[src='${url}']`);
    if (targetAudio.paused) {
      targetAudio.play();
    } else {
      targetAudio.pause();
      targetAudio.currentTime = 0;
    }
  }
};

const playAudioTarget = function (i) {
  const audioNumber = layout[i][1].toString().padStart(2, "0");
  playAudio(
    `audio/${layout[i][0]}/${layout[i][0]}_${audioNumber}.wav`,
    i < layout.length - 2 ? true : false
  );
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

// Detect effects selection
controlsSpinner.forEach((el, index) => {
  const controlsAudioIndex = layout.length - 2 + index;

  el.value = 1;
  el.min = 1;
  el.max = layout[controlsAudioIndex][2];
  el.addEventListener(
    "change",
    (e) => {
      const inputValue = e.target.value;
      layout[controlsAudioIndex][1] = inputValue;
      // if (inputValue >= el.min && inputValue <= el.max)
      el.parentNode.childNodes[1].src = `audio/${
        layout[controlsAudioIndex][0]
      }/${layout[controlsAudioIndex][0]}_${inputValue
        .toString()
        .padStart(2, "0")}.wav`;
    },
    true
  );
});

// Play selected audio on click
const playOnClick = function (group, initalIndex = 0) {
  group.forEach((el, index) => {
    el.addEventListener(
      "click",
      () => {
        playAudioTarget(index + initalIndex);
      },
      true
    );
    //Prevent double click selecting text
    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
  });
};

playOnClick(btn);
playOnClick(controlsBigBtn, layout.length - 2);

// Label instruments' type on button
btnType.forEach((el, index) => {
  el.innerHTML = layout[index][0];
});

controlsType.forEach((el, index) => {
  el.innerHTML = layout[layout.length - 2 + index][0];
});

// Label input key on button
btnKey.forEach((el, index) => {
  el.innerHTML = layout[index][3];
});

controlsKey.forEach((el, index) => {
  el.innerHTML = layout[layout.length - 2 + index][3];
});

// Play selected audio on keydown

document.addEventListener(
  "keydown",
  (e) => {
    const layoutIndex = layout.findIndex((el) => el[3] === e.key.toLowerCase());

    if (layoutIndex !== -1 && !e.repeat) {
      playAudioTarget(layoutIndex);

      if (layoutIndex < layout.length - 2) {
        btn[layoutIndex].classList.add("keyPress");
      } else {
        controlsBigBtn[layoutIndex - layout.length + 2].classList.add(
          "controlsPress"
        );
      }
    }
  },
  true
);

document.addEventListener(
  "keyup",
  (e) => {
    const layoutIndex = layout.findIndex((el) => el[3] === e.key.toLowerCase());

    if (layoutIndex !== -1) {
      if (layoutIndex < layout.length - 2) {
        btn[layoutIndex].classList.remove("keyPress");
      } else {
        controlsBigBtn[layoutIndex - layout.length + 2].classList.remove(
          "controlsPress"
        );
      }
    }
  },
  true
);
