#!/bin/python

import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class FileWatcher:
    def __init__(
        self,
        directory: str,
        callback
    ):
        super().__init__()
        self.directory = directory
        
        handler = FileHandler(callback)

        self.observer = Observer()
        self.observer.schedule(
            event_handler=handler,
            path=self.directory,
            recursive=False
        )
        self.observer.start()

    def stop(self):
        self.observer.stop()
        self.observer.join()



class FileHandler(FileSystemEventHandler):

    def __init__(self, callback):
        super().__init__()
        self.callback = callback

    def on_modified(self, event):
        self.callback()