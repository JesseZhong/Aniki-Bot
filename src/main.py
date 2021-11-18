#!/bin/python

import os
from dotenv import load_dotenv
from .bot import Bot
from .filewatcher import FileWatcher
from pathlib import Path

class Main():
    def __init__(self):
        load_dotenv()
        self.API_TOKEN = os.getenv('DISCORD_TOKEN')
        self.DATA_DIR = os.getenv('DATA_DIR')
        self.LOG_DIR = os.getenv('LOG_DIR')

        # Setup the bot.
        self.bot = Bot(self.LOG_DIR)

        # Load data.
        for file in list(Path(self.DATA_DIR).rglob('*.json')):
            self.bot.load(file)


    def run(self):
        """
            Setup file watcher and run the bot.
        """

        # Setup file watcher to reload data when it changes.
        self.watcher = FileWatcher(self.DATA_DIR, self.bot.load)

        # Do et.
        self.bot.start(self.API_TOKEN)
        


    def stop(self):
        """
            Stop the bot and file watcher.
        """

        # Kill the watcher when the bot is done.
        self.watcher.stop()