#!/bin/python

import os
from dotenv import load_dotenv
from bot.bot import Bot
from bot.filewatcher import FileWatcher
from pathlib import Path


load_dotenv()
API_TOKEN = os.getenv('DISCORD_TOKEN')
DATA_DIR = os.getenv('DATA_DIR')
LOG_DIR = os.getenv('LOG_DIR')

# Setup the bot.
bot = Bot(LOG_DIR)

# Load data.
for file in list(Path(DATA_DIR).rglob('*.json')):
    bot.load(file)

# Setup file watcher to reload data when it changes.
watcher = FileWatcher(DATA_DIR, bot.load)

# Do et.
bot.start(API_TOKEN)

# Kill the watcher when the bot is done.
watcher.stop()