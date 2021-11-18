from typing import OrderedDict
from sys import argv
from threading import Thread
from atexit import register, unregister

class Runner():
    def __init__(self):

        def bot():
            from src.main import Main
            return Main()

        def dash():
            from dashboard.server.main import Main
            return Main()

        # Available services.
        apps = OrderedDict([
            ('bot', bot),
            ('dash', dash)
        ])

        self.createApp = None

        # If user provides service name, look it up.
        # Otherwise prompt user to provide a service name.
        if not argv or (len(argv) > 1 and not argv[1]):
            print('Select a service:')
            for index, availableApp in enumerate(apps):
                print(f'    {index + 1}: {availableApp}')
            print('Any other input to quit.')

            choice = input()
            
            try:
                val = int(choice)
                if val > len(apps) or val < 1:
                    raise ValueError()

                self.createApp = list(apps.items())[val - 1][1]
            except ValueError:
                print('Exiting.')
                exit()
        else:
            chosenApp = argv[1]
            if chosenApp in apps:
                self.createApp = apps[chosenApp]
            else:
                print('Unknown app.')
                exit()


    def start(self):
        """
            Start service in separate thread so it can be monitored.
        """

        if not hasattr(self, 'thread') or not self.thread:
            # Re-import and create a new instance of the service.
            try:
                app = self.createApp()
            except ImportError:
                print('Failed to import service code. Exiting runner.')
                exit()

            # Track the current service instance's stop method.
            self.on_stop = app.stop 

            # In the event the script terminates (including ctrl+c),
            # make sure to close the background service.
            register(self.on_stop)

            # Setup the thread for the new service.
            self.thread = Thread(target=app.run)
            self.thread.daemon = True

        if not self.thread.is_alive():
            self.thread.start()


    def stop(self):
        """
            Terminates a currently running service.
        """
        if hasattr(self, 'on_stop') and self.on_stop:
            self.on_stop()
            unregister(self.on_stop)
            self.thread = None
        

if __name__ == '__main__':
    runner = Runner()
    runner.start()
    running = True
    while running:

        # Wait for any user input or intervention.
        userInput = input()

        if userInput in ['restart', 'refresh', 'reload']:
            runner.stop()
            runner.start()

        if userInput in ['stop', 'quit', 'exit']:
            running = False
