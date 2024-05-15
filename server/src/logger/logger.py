import logging
from logging.config import dictConfig
import os

import yaml

def setup_logger(default_path='src/logger/config.yaml', default_level=logging.INFO):
    path = default_path
    if os.path.exists(path):
        with open(path, 'rt') as file:
            config = yaml.safe_load(file.read())
        dictConfig(config)
    else:
        logging.basicConfig(level=default_level)