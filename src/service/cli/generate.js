"use strict";

const fs = require(`fs`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInteger,
  shuffle,
  getPictureFileName
} = require(`./utils`);
const MAX_ELEMENTS = 1000;
const OVERFLOW_MESSAGE = `Не больше 1000 объявлений`;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
  `Продам коллекцию журналов «Огонёк»`,
  `Отдам в хорошие руки подшивку «Мурзилка»`,
  `Продам советскую посуду. Почти не разбита`,
  `Куплю детские санки`,
];

const SENTENCES = [
  `Товар в отличном состоянии`,
  `Пользовались бережно и только по большим праздникам`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары`,
  `Даю недельную гарантию`,
  `Если товар не понравится — верну всё до последней копейки`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `Две страницы заляпаны свежим кофе.`,
  `При покупке с меня бесплатная доставка в черте города.`,
  `Кажется, что это хрупкая вещь.`,
  `Мой дед не мог её сломать.`,
  `Кому нужен этот новый телефон, если тут такое...`,
  `Не пытайтесь торговаться. Цену вещам я знаю.`,
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};


const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const genereteMocks = (count) => {
  if (!count || Number.isNaN(count)) {
    count = DEFAULT_COUNT;
  }

  if (count > MAX_ELEMENTS) {
    console.info(OVERFLOW_MESSAGE);
    process.exit(1);
  }

  const result = [];

  for (let i = 0; i < count; i++) {
    result.push({
      title: TITLES[getRandomInteger(0, TITLES.length - 1)],
      picture: getPictureFileName(getRandomInteger(PictureRestrict.MIN, PictureRestrict.MAX)),
      type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
      description: shuffle(SENTENCES).slice(1, 5).join(` `),
      sum: getRandomInteger(SumRestrict.MIN, SumRestrict.MAX),
      category: shuffle(CATEGORIES).slice(0, getRandomInteger(0, CATEGORIES.length - 1)),
    });
  }

  return result;
};


module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = JSON.stringify(genereteMocks(countOffer));

    fs.writeFile(FILE_NAME, offers, (err) => {
      if (err) {
        console.error(`Error!`);
        process.exit(ExitCode.error);
      }

      console.info(`Operation success. File created.`);
      process.exit(ExitCode.success);
    });
  }
};
