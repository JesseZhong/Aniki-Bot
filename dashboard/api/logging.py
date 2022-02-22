import logging
from logging.handlers import RotatingFileHandler

class Logging:

    def __init__(self) -> None:

        self.logger = logging.getLogger('Error Log')
        self.logger.setLevel(logging.ERROR)

        handler = RotatingFileHandler(
            'server-error.log',
            maxBytes=20000,
            backupCount=1
        )

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)

        self.logger.addHandler(handler)

    @classmethod
    def get_logger(
        cls
    ):
        return cls().logger