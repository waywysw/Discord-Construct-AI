import json
import os
import discord
from discord.ext import commands
from discord.ext.commands import Bot
import asyncio
import sys
import logging
from flask import Flask, request
import threading

app = Flask(__name__)

stop_flag = threading.Event()

# Function to read and parse the bot configuration from a JSON file
def read_bot_config():
    with open('bot_config.json', 'r') as f:
        config = json.load(f)
    return config

# Function to update the bot configuration with values from a dictionary
def update_bot_config(config):
    bot.endpoint = config['endpoint']
    bot.chatlog_dir = config['chatlog_dir']
    bot.endpoint_connected = False
    bot.channel_id = config['channel_id']
    bot.guild_ids = [int(x) for x in config['guild_ids'].split(",")]
    bot.debug = config['debug']
    bot.char_name = config['char_name']

# Flask API endpoint to start the bot
@app.route('/start_bot', methods=['POST'])
def start_bot():
    global bot_thread, stop_flag
    if bot_thread is None or not bot_thread.is_alive():
        stop_flag = threading.Event()
        bot_thread = threading.Thread(target=run_bot, args=(stop_flag,))
        bot_thread.start()
        return "Bot started"
    else:
        return "Bot is already running"

# Flask API endpoint to stop the bot
@app.route('/stop_bot', methods=['POST'])
def stop_bot():
    global bot_thread, stop_flag
    if bot_thread is not None and bot_thread.is_alive():
        stop_flag.set()
        bot_thread.join()
        bot_thread = None
        return "Bot stopped"
    else:
        return "Bot is not running"


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python discordbot.py <CONFIG_FILE>')
        sys.exit(1)
    CONFIG_FILE = sys.argv[1]

    # Read and update bot configuration
    config = read_bot_config()

    intents = discord.Intents.all()
    bot = Bot(command_prefix="/", intents=intents, help_command=None)

    # Load the bot configuration from a JSON file
    update_bot_config(config)

    # COG LOADER
    async def load_cogs() -> None:
        for file in os.listdir(f"{os.path.realpath(os.path.dirname(__file__))}/cogs"):
            if file.endswith(".py"):
                extension = file[:-3]
                try:
                    await bot.load_extension(f"cogs.{extension}")
                    if extension == 'pygbot':
                        bot.endpoint_connected = True
                except commands.ExtensionError as e:
                    if extension == 'pygbot':
                        bot.endpoint_connected = False
                    if not bot.debug:
                        logging.error(f"\n\nIssue with ENDPOINT. Please check your ENDPOINT in the .env file")
                    else:
                        exception = f"{type(e).__name__}: {e}"
                        print(f"Failed to load extension {extension}\n{exception}")

    def run_flask():
        app.run()

    async def run_bot(stop_flag):
        while not stop_flag.is_set():
            await load_cogs()
            if bot.endpoint_connected:
                try:
                    await bot.start(config['discord_bot_token'])
                except discord.errors.LoginFailure:
                    print("\n\n\n\nThere is an error with the Discord Bot token. Please check your configured settings")


flask_thread = threading.Thread(target=run_flask)
flask_thread.start()
flask_thread.join()