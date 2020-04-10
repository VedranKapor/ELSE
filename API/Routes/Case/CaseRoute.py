from flask import Blueprint, jsonify, request, session
import os
from pathlib import Path
import shutil
from distutils.dir_util import copy_tree

from Classes.Base import Config
from Classes.Base.FileClass import File

case_api = Blueprint('CaseRoute', __name__)

@case_api.route("/getCases", methods=['GET'])
def getCases():
    try:
        cs = [ f.name for f in os.scandir(Config.DATA_STORAGE) if f.is_dir() ]
        return jsonify({'cases': cs}), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

@case_api.route("/getDesc", methods=['POST'])
def getDesc():
    try:
        casename = request.json['casename']
        genDataPath = Path(Config.DATA_STORAGE,casename,"genData.json")
        genData = File.readFile(genDataPath)

        response = {
             "message": "Get case description success",
             "desc": genData['else-desc']
        }
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

@case_api.route("/copyCase", methods=['POST'])
def copy():
    try:
        case = request.json['casename']
        src =  Path(Config.DATA_STORAGE, case)
        dest =  Path(Config.DATA_STORAGE, case + '_copy')
        case_copy = case + '_copy'
        if(os.path.isdir(dest)):
            response = {
                "message": 'Case <b>'+ case + '_copy</b> already exists, please rename existing case first!',
                "status_code": "warning"
            }
        else:
            shutil.copytree(str(src), str(dest) )
            #rename casename in genData
            casePath = Path(Config.DATA_STORAGE, case_copy, 'genData.json')
            genData = File.readFile(casePath)
            genData['else-casename'] = case_copy
            File.writeFile(genData, casePath)
            response = {
                "message": 'Case <b>'+ case + '</b> copied!',
                "status_code": "success"
            }
        return(response)
    except(IOError):
        raise IOError
    except OSError:
        raise OSError

@case_api.route("/deleteCase", methods=['POST'])
def deleteCase():
    try:        
        case = request.json['casename']
        casePath = Path(Config.DATA_STORAGE, case)
        shutil.rmtree(casePath)

        if case == session.get('elsecase'):
            session['elsecase'] = None
            response = {
                "message": 'Case <b>'+ case + '</b> deleted!',
                "status_code": "success_session"
            }
        else:
            response = {
                "message": 'Case <b>'+ case + '</b> deleted!',
                "status_code": "success"
            }
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404
    except OSError:
        raise OSError

@case_api.route("/gethData", methods=['POST'])
def gethData():
    try:
        casename = request.json['casename']
        if casename != None:
            genDataPath = Path(Config.DATA_STORAGE,casename,"hData.json")
            hData = File.readFile(genDataPath)
            response = hData    
        else:  
            response = None     
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

@case_api.route("/gettData", methods=['POST'])
def gettData():
    try:
        casename = request.json['casename']
        if casename != None:
            genDataPath = Path(Config.DATA_STORAGE,casename,"tData.json")
            hData = File.readFile(genDataPath)
            response = hData    
        else:  
            response = None     
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

@case_api.route("/genData", methods=['POST'])
def genData():
    try:
        case = request.json['casename']
        if case != None:
            genDataPath = Path(Config.DATA_STORAGE,case,"genData.json")
            genData = File.readFile(genDataPath)
            response = genData
        else:
            response = None    
        return jsonify(response), 200
    except(IOError):
        return jsonify('Case or case data not found!'), 404
    except(IndexError):
        return jsonify('File exist, data corrupt!'), 404

@case_api.route("/updatehData", methods=['POST'])
def updatehData():
    try:
        data = request.json['data']
        year = request.json['year']
        case = session.get('elsecase', None)
        hDataPath = Path(Config.DATA_STORAGE, case, "hData.json")
        if case != None:
            hData = File.readFile(hDataPath)
            hData[year] = data
            File.writeFile( hData, hDataPath)
            response = {
                "message": "You have update hourly data",
                "status_code": "success"
            }      
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

@case_api.route("/updatetData", methods=['POST'])
def updatetData():
    try:
        data = request.json['data']
        case = session.get('elsecase', None)
        tDataPath = Path(Config.DATA_STORAGE, case, "tData.json")
        if case != None:
            tData = File.readFile(tDataPath)
            tData = data
            File.writeFile( tData, tDataPath)
            response = {
                "message": "You have update hourly data",
                "status_code": "success"
            }      
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

def defaultHData(genData, hDataPath):
    try:
        years = genData['else-years']
        units = genData['else-units']
        hData = {}
        for year in years:
            hData[year] = []
            for i in range(1, Config.SIM_PERIOD):
                chunk = {}
                chunk['Hour'] = i 
                chunk['Demand'] = 1 
                for unit in units:
                    if unit['h']:
                        chunk[unit['UnitId']] = 0 
                hData[year].append(chunk)

        File.writeFile( hData, hDataPath)
    except(IOError):
        raise IOError

def defaultTData(genData, tDataPath):
    try:
        years = genData['else-years']
        units = genData['else-units']
        tData = []
        for year in years:
            for unit in units:
                chunk = {}
                chunk['Year'] = year
                chunk['UnitId'] = unit['UnitId']
                chunk['Unitname'] = unit['Unitname']
                chunk['Fuel'] = unit['Fuel']
                chunk['IC'] = unit['IC']
                chunk['CF'] = 0
                chunk['EF'] = 0
                chunk['INC'] = 0
                chunk['OCF'] = 0
                chunk['OCV'] = 0
                chunk['CO2'] = 0
                chunk['SO2'] = 0
                chunk['NOX'] = 0
                chunk['Other'] = 0
                tData.append(chunk)
        File.writeFile( tData, tDataPath)
    except(IOError):
        raise IOError

def updateHData(genData, hDataPath):

    hData = File.readFile(hDataPath)
    yearsExi = [ yr for yr in hData]
    yearsNew = genData['else-years']
    yearsAdd = set(yearsNew) - set(yearsExi)
    yearsRemove = set(yearsExi) - set(yearsNew)
    unitsExi = set()

    for h, obj in list(hData.items()):
        for d in obj:
            for k,v in d.items():
                if k!= 'Hour' and k!='Demand':
                    unitsExi.add(k)


    unitsNew = [ unit['UnitId'] for unit in genData['else-units']]

    yearChunk =[]
    for i in range(1, Config.SIM_PERIOD):
        chunk = {}
        chunk['Hour'] = i 
        chunk['Demand'] = 1 
        for unit in unitsNew:
            chunk[unit] = 0 
        yearChunk.append(chunk)

    unitsAdd = set(unitsNew) - unitsExi
    unitsRemove = unitsExi - set(unitsNew)

    for h, obj in list(hData.items()):
        if h in yearsRemove:
            del hData[h] 
        for d in obj:
            for k,v in list(d.items()):
                if k!= 'Hour' and k!='Demand':
                    if k in unitsRemove:
                        del d[k]
                    for ut in unitsAdd:
                        d[ut] = 0

    for yr in yearsAdd: 
        hData[yr] = yearChunk 

    File.writeFile( hData, hDataPath)

@case_api.route("/saveCase", methods=['POST'])
def saveCase():
    try:
        genData = request.json['data']
        casename = genData['else-casename']
        case = session.get('elsecase', None)

        if case != None:
            genDataPath = Path(Config.DATA_STORAGE, case, "genData.json")
            hDataPath = Path(Config.DATA_STORAGE, case, "hData.json")
            tDataPath = Path(Config.DATA_STORAGE, case, "tData.json")
            #edit case sa istim imenom
            if case == casename:
                File.writeFile( genData, genDataPath)
                defaultTData(genData, tDataPath)
                updateHData(genData, hDataPath)
                response = {
                    "message": "You have change case general data!",
                    "status_code": "edited"
                }
            #edit case sa drugim imenom, mramo odma provjeriit da li novo ime postoji u sistemu
            else:
                if not os.path.exists(Path(Config.DATA_STORAGE,casename)):
                    File.writeFile( genData, genDataPath)
                    defaultTData(genData, tDataPath)
                    updateHData(genData, hDataPath)
                    os.rename(Path(Config.DATA_STORAGE,case), Path(Config.DATA_STORAGE,casename ))
                    session['elsecase'] = casename
                    response = {
                        "message": "You have change case general data!",
                        "status_code": "edited"
                    }
                #ako vec postoji case sa istim imenom
                else:
                    response = {
                        "message": "Case with same name already exists!",
                        "status_code": "exist"
                    } 
        else:
            if not os.path.exists(Path(Config.DATA_STORAGE,casename)):
                session['elsecase'] = casename
                os.makedirs(Path(Config.DATA_STORAGE,casename))
                genDataPath = Path(Config.DATA_STORAGE, casename, "genData.json")
                hDataPath = Path(Config.DATA_STORAGE, casename, "hData.json")
                tDataPath = Path(Config.DATA_STORAGE, casename, "tData.json")
                File.writeFile( genData, genDataPath)
                defaultHData(genData, hDataPath)
                defaultTData(genData, tDataPath)
                response = {
                    "message": "You have created new case!",
                    "status_code": "created"
                }
            else:
                response = {
                    "message": "Case with same name already exists!",
                    "status_code": "exist"
                }        

        return jsonify(response), 200
    except(IOError):
        return jsonify('Error saving case IOError!'), 404






    ######################3citsti DICT
        # hData = {}
        # for year in years:
        #     hData[year] = {}
        #     for i in range(10):
        #         hData[year][i] = {}
        #         hData[year][i]['Hour'] = i 
        #         for unit in units:
        #             if unit['int']:
        #                 hData[year][i][unit['unitId']] = 0 
