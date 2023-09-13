import logging
import sys
from os import getenv
from random import choice
from aiohttp import web
from aiogram import Bot, Dispatcher, Router, types, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application


TOKEN = getenv("BOT_TOKEN")
WEB_SERVER_HOST = "::"
WEB_SERVER_PORT = 8350

WEBHOOK_PATH = "/bot/"
WEBHOOK_SECRET = "some-very-secret-text"
BASE_WEBHOOK_URL = "https://web-lab6.alwaysdata.net/"

router = Router()

@router.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    await message.answer(f"""Привіт, я звичайний телеграм бот! Мене створили у процесі роботи над шостою лабораторною роботою.\n\nМоя основна мета - дублювання повідомлень, але якщо спробуєте відправити мені фото, то я спробую дати якийсь коментар про нього!""")


@router.message(F.text)
async def echo_handler(message: types.Message) -> None:
    try:
        await message.send_copy(chat_id=message.chat.id)
    except TypeError:
        await message.answer("Nice try!")


@router.message(F.photo)
async def echo_handler(message: types.Message) -> None:
    await message.reply(choice(["Ого, гарна картинка!", "Я бачив різні картинки, але ця - найкраща!", "Цікавий знімок!", "Я навіть не знаю як це прокоментувати..."]))




async def on_startup(bot: Bot) -> None:
    await bot.set_webhook(f"{BASE_WEBHOOK_URL}{WEBHOOK_PATH}", secret_token=WEBHOOK_SECRET)


def main() -> None:
    dp = Dispatcher()
    dp.include_router(router)
    dp.startup.register(on_startup)
    bot = Bot(TOKEN, parse_mode=ParseMode.HTML)
    app = web.Application()
    webhook_requests_handler = SimpleRequestHandler(dispatcher=dp, bot=bot, secret_token=WEBHOOK_SECRET)
    webhook_requests_handler.register(app, path=WEBHOOK_PATH)
    setup_application(app, dp, bot=bot)
    web.run_app(app, host=WEB_SERVER_HOST, port=WEB_SERVER_PORT)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    main()