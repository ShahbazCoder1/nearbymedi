from random import randint


class random_number:
    def __init__(self, start: int, end: int):
        self.start = start
        self.end = end

    def get_start(self):
        return self.start

    def get_end(self):
        return self.end

    def set_start(self, start: int):
        self.start = start

    def set_end(self, end):
        self.end = end

    def get_random_number(self):
        return randint(self.start, self.end)
