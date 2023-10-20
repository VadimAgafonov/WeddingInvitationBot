const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options');

const token = "6342867630:AAF2EYBYUMBBrN0LjRcS98_XKdj87iHZUDY";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
	await bot.sendMessage(
        chatId,
        "Сейчас я загадаю тебе число от 0 до 9, а ты попробуй угадать"
      );
      const random = Math.floor(Math.random() * 10);
      chats[chatId] = random;
      await bot.sendMessage(chatId, "Отгадывай", gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Узнать дату",
    },
    {
      command: "/game",
      description: "Игра",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    const date = msg.date;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в тг бота ${userName} :)`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `В мире сейчас: ${date}`);
    }

    if (text === "/game") {
		return startGame(chatId);
	}
  });

  bot.on('callback_query', async msg => {
	const data = msg.data;
	const chatId = msg.message.chat.id;
	if (data === "/again") {
		return startGame(chatId);
	}
	if(data === chats[chatId]) {
		return await bot.sendMessage(chatId, `Вы отгадали, это число - ${chats[chatId]}`, againOptions())
	} else {
		return await bot.sendMessage(chatId, `Вы не отгадали, бот загадал - ${chats[chatId]}`, againOptions)
	}
  })
};

start();
