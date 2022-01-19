from sys import argv
from gremlin.db.lmdb import transact_update, open_db
import json

if not len(argv) > 1:
    print('Need file name.')
    exit

with open(argv[1], 'r') as file:
    data = json.load(file)

    db = open_db()
    
    with db.begin(write=True) as trn:
        for key, value in data.items():
            transact_update(
                trn,
                key,
                value
            )

    db.close()