#!/bin/python

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileModifiedEvent
from typing import Callable


class FileWatcher:
    def __init__(
        self,
        directory: str,
        callback
    ):
        self.directory = directory
        
        handler = FileHandler(callback)

        self.observer = Observer()
        self.observer.schedule(
            event_handler=handler,
            path=self.directory,
            recursive=True
        )
        self.observer.start()

    def stop(self):
        self.observer.stop()
        self.observer.join()



class FileHandler(FileSystemEventHandler):

    def __init__(self, callback: Callable[[str], None]):
        super().__init__()
        self.callback = callback

    def on_modified(self, event):
        if isinstance(event, FileModifiedEvent):
            self.callback(event.src_path)