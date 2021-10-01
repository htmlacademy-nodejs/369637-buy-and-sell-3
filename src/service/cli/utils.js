"use strict";

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * i);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }

  return arr;
};

const getPictureFileName = (num) => {
  if (num < 0 || num > 16) {
    num = 1;
  }

  return num < 10 ? `item0${num}.jpg` : `item${num}.jpg`;
};

module.exports = {
  getRandomInteger,
  shuffle,
  getPictureFileName
};
