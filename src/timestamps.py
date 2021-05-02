#!/bin/python
import time

def from_seconds(seconds: int) -> time:
    return time.gmtime(seconds)

def parse_timestamp(timestamp: str) -> time:
    try:
        return time.strptime(timestamp, '%H:%M:%S')
    except ValueError:
        return time.strptime(timestamp, '%M:%S')

def stringify(timestamp: time) -> str:
    return time.strftime('%H:%M:%S', timestamp)