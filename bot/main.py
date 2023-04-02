#!/bin/python

import os
from discord import Intents
from dotenv import load_dotenv
from bot.bot import Bot
from bot.filewatcher import FileWatcher


load_dotenv()
API_TOKEN = os.getenv('DISCORD_TOKEN')
DATA_DIR = os.getenv('DATA_DIR', './db')
LOG_DIR = os.getenv('LOG_DIR', './logs')

intents = Intents.default()
intents.members = True
intents.message_content = True

# Setup the bot.
bot = Bot(intents, LOG_DIR)

# Load data.
bot.load()

# Setup file watcher to reload data when it changes.
watcher = FileWatcher(DATA_DIR, bot.load)

# Do et.
bot.run(API_TOKEN)

# Kill the watcher when the bot is done.
watcher.stop()