"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInteger,
  shuffle,
  getPictureFileName
} = require(`./utils`);
const MAX_ELEMENTS = 1000;
const OVERFLOW_MESSAGE = `Не больше 1000 объявлений`;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

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

const genereteMocks = (count, titles, categories, sentences) => {
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
      title: titles[getRandomInteger(0, titles.length - 1)],
      picture: getPictureFileName(getRandomInteger(PictureRestrict.MIN, PictureRestrict.MAX)),
      type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
      description: shuffle(sentences).slice(1, 5).join(` `),
      sum: getRandomInteger(SumRestrict.MIN, SumRestrict.MAX),
      category: shuffle(categories).slice(0, getRandomInteger(0, categories.length - 1)),
    });
  }

  return result;
};


module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = JSON.stringify(genereteMocks(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, offers);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(err));
    }
  }
};
