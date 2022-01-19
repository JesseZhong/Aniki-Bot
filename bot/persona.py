#!/bin/python

class Persona(object):

    def __init__(self, name: str, avatar: str):
        super().__init__()

        self.name = name
        self.avatar = avatar