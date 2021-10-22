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
const controlsVolume = document.querySelectorAll(".controls__volume");

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

const playAudio = (url, overlap = true) => {
  if (overlap) {
    const audio = document.createElement("audio");
    audio.src = url;
    audio.preload = "auto";
    document.querySelector(".channel").appendChild(audio);
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

// Detect and change effects volume
controlsVolume.forEach((el, i) => {
  el.addEventListener("change", (e) => {
    e.target.parentNode.childNodes[1].volume = e.target.value / e.target.max;
  });
});

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

// Label instruments'buttons
const labelBtns = (types, keys, initalIndex = 0) => {
  types.forEach((el, index) => {
    el.innerHTML = layout[initalIndex + index][0];
  });

  keys.forEach((el, index) => {
    el.innerHTML = layout[initalIndex + index][3];
  });
};

labelBtns(btnType, btnKey);
labelBtns(controlsType, controlsKey, layout.length - 2);

// Play selected audio on keydown/keyup

const btnOnPress = (keyEvent) => {
  document.addEventListener(
    keyEvent,
    (e) => {
      const layoutIndex = layout.findIndex(
        (el) => el[3] === e.key.toLowerCase()
      );

      if (layoutIndex !== -1 && !e.repeat) {
        if (keyEvent === "keydown") playAudioTarget(layoutIndex);

        if (layoutIndex < layout.length - 2) {
          const btnClasses = btn[layoutIndex].classList;
          keyEvent === "keydown"
            ? btnClasses.add("keyPress")
            : btnClasses.remove("keyPress");
        } else {
          const ctrlClasses =
            controlsBigBtn[layoutIndex - layout.length + 2].classList;
          keyEvent === "keydown"
            ? ctrlClasses.add("controlsPress")
            : ctrlClasses.remove("controlsPress");
        }
      }
    },
    true
  );
};

btnOnPress("keydown");
btnOnPress("keyup");
