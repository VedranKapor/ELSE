from pathlib import Path
import os
import shutil
from distutils.dir_util import copy_tree

from Classes.Base import Config
from Classes.Base.FileClass import File

class ElseCase:
    def __init__(self, case):
        self.case = case
        self.casePath = Path(Config.DATA_STORAGE,case)
        self.zipPath = Path(Config.DATA_STORAGE,case+'.zip')
        self.genData = Path(Config.DATA_STORAGE,case,'genData.json')
        self.hData = Path(Config.DATA_STORAGE,case,'hData.json')
        self.simPeriod = 13



