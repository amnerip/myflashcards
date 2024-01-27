# from datetime import datetime, timedelta
class LevelSpec:
    def __init__(self, interval: int, offset: int) -> None:
        self.interval = interval
        self.offset = offset

def calculate_leitner(numlevels: int):
    intervals: dict[int, LevelSpec] = {}
    multiplier = 1
    for i in range(1, numlevels+1):
        intervals[i] = LevelSpec(multiplier, multiplier//2)
        multiplier *= 2

    print([l.interval for l in intervals.values()])
    what_to_practice: list[list[int]] = []
    for days_since_start in range(65):
        levels: list[int] = []

        for level, spec in intervals.items():
            if days_since_start % spec.interval - spec.offset == 0:
                levels.append(level)
        what_to_practice.append(levels)
    return what_to_practice




for x in zip(calculate_leitner(4), calculate_leitner(7)):
    if x[0] != x[1]:
        print(x)
