"use strict";

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;
const {HttpCode} = require(`../../constants`);


module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = Number.parseInt(userPort, 10) || DEFAULT_PORT;
    const onClientConnect = async (req, res) => {
      const notFoundMessageText = `Not found`;

      const sendResponse = (response, httpCode, message) => {
        const template = `<!DOCTYPE html>
        <html lang="ru">
        <head>
        <title>Hello from node</title>
        </head>
        <body>
        ${message}
        </body></html>
        `.trim();

        response.writeHead(httpCode, {
          "Content-Type": `text/html; charset=UTF-8`
        });

        response.end(template);
      };

      switch (req.url) {
        case `/`:
          try {
            const fileContent = await fs.readFile(FILENAME);
            const mocks = JSON.parse(fileContent);
            const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
            sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
          } catch (err) {
            sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
          }
          break;
        default:
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
          break;
      }
    };

    const server = http.createServer(onClientConnect);
    server.listen(port)
    .on(`listening`, (err) => {
      if (err) {
        console.error(chalk.red(err));
      }
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    })
    .on(`error`, ({message}) => {
      console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
    });
  }
};
