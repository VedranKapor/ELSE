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
        cases = [ f.name for f in os.scandir(Config.DATA_STORAGE) if f.is_dir() ]
        return jsonify(cases), 200
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

@case_api.route("/getcData", methods=['POST'])
def getcData():
    try:
        casename = request.json['casename']
        if casename != None:
            genDataPath = Path(Config.DATA_STORAGE,casename,"cData.json")
            hData = File.readFile(genDataPath)
            response = hData    
        else:  
            response = None     
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

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
            #tData = File.readFile(tDataPath)
            tData = data
            File.writeFile( tData, tDataPath)
            response = {
                "message": "You have update hourly data",
                "status_code": "success"
            }      
        return jsonify(response), 200
    except(IOError):
        return jsonify('No existing cases!'), 404

@case_api.route("/updatecData", methods=['POST'])
def updatecData():
    try:
        data = request.json['data']
        case = session.get('elsecase', None)
        cDataPath = Path(Config.DATA_STORAGE, case, "cData.json")
        if case != None:
            #cData = File.readFile(cDataPath)
            cData = data
            File.writeFile( cData, cDataPath)
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
                        chunk[unit['UnitId']] = 1
                hData[year].append(chunk)

        File.writeFile( hData, hDataPath)
    except(IOError):
        raise IOError

def defaultCData(genData, cDataPath):
    try:
        years = genData['else-years']
        units = genData['else-units']
        
        cData = []
        for unit in units:
            chunk = {}
            chunk['UnitId'] = unit['UnitId']
            for year in years:
                chunk[year] = True 
            cData.append(chunk)

        File.writeFile( cData, cDataPath)
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
                # chunk['Unitname'] = unit['Unitname']
                # chunk['Fuel'] = unit['Fuel']
                # chunk['IC'] = unit['IC']
                chunk['CF'] = 0
                chunk['EF'] = 0
                chunk['FUC'] = 0
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
            for k in d:
                if k!= 'Hour' and k!='Demand':
                    unitsExi.add(k)


    #unitsNew = [ unit['UnitId'] for unit in genData['else-units'] if unit['h']]
    unitsNew = [ unit['UnitId'] for unit in genData['else-units']]

    yearChunk =[]
    for i in range(1, Config.SIM_PERIOD):
        chunk = {}
        chunk['Hour'] = i 
        chunk['Demand'] = 1 
        for unit in unitsNew:
            chunk[unit] = 1
        yearChunk.append(chunk)

    unitsAdd = set(unitsNew) - unitsExi
    unitsRemove = unitsExi - set(unitsNew)

    for h, obj in list(hData.items()):
        if h in yearsRemove:
            del hData[h] 
        for d in obj:
            for k in list(d):
                if k!= 'Hour' and k!='Demand':
                    if k in unitsRemove:
                        del d[k]
                    for ut in unitsAdd:
                        d[ut] = 1

    for yr in yearsAdd: 
        hData[yr] = yearChunk 

    File.writeFile( hData, hDataPath)

def defaultTData_DF(genData, tDataPath):
    try:
       
        years = genData['else-years']
        units = [unit['UnitId'] for unit in genData['else-units'] ]

        tData = {}
        tData['CF'] = {}
        tData['EF'] = {}
        tData['FUC'] = {}
        tData['INC'] = {}
        tData['OCF'] = {}
        tData['OCV'] = {}
        tData['CO2'] = {}
        tData['SO2'] = {}
        tData['NOX'] = {}
        tData['Other'] = {}

        for year in years:
            tData['CF'][year] = {}
            tData['EF'][year] = {}
            tData['FUC'][year] = {}
            tData['INC'][year] = {}
            tData['OCF'][year] = {}
            tData['OCV'][year] = {}
            tData['CO2'][year] = {}
            tData['SO2'][year] = {}
            tData['NOX'][year] = {}
            tData['Other'][year] = {}
            for unit in units:
                tData['CF'][year][unit] = 0
                tData['EF'][year][unit] = 0
                tData['FUC'][year][unit] = 0
                tData['INC'][year][unit] = 0
                tData['OCF'][year][unit] = 0
                tData['OCV'][year][unit] = 0
                tData['CO2'][year][unit] = 0
                tData['SO2'][year][unit] = 0
                tData['NOX'][year][unit] = 0
                tData['Other'][year][unit] = 0

                #tData[year][unit] .append(chunk)

        File.writeFile( tData, tDataPath)
    except(IOError):
        raise IOError

def updateTData(genData, tDataPath):

    tData = File.readFile(tDataPath)

    #definisi godine yearsExi = godine koje postoje u tData existing years
    #yearsNew godine koje smo izabrali u editu case, nove godine yearsNew
    #yearsAdd godine koje trebamo dodati u tData i to je yearsExi-yearsNew sve one godine koje ne postoje u tData a dodali smo ihtj sada postoje u yearNew
    yearsExi = [ yr['Year'] for yr in tData]
    yearsNew = genData['else-years']

    yearsAdd = set(yearsNew) - set(yearsExi)
    yearsRemove = set(yearsExi) - set(yearsNew)

    #dio za unite, ista logika kao za godine
    unitsExi = [ unit['UnitId'] for unit in tData]
    unitsNew = [ unit['UnitId'] for unit in genData['else-units']]

    unitsAdd = set(unitsNew) - set(unitsExi)
    unitsRemove = set(unitsExi) - set(unitsNew)

    #iz posojeceg tData izbaciti sve one elemente koji su u unitRemove ili yearsRemove
    tData = [ unit for unit in tData if unit['UnitId'] not in unitsRemove and unit['Year'] not in yearsRemove]

    #napraviti dict da biunijeti imena i kapacitete prilikom kreiranje chunk
    #ne mozemo direktno citati dict jer je ulisti prilikom kreiranje chunk-a
    # unitData = {}
    # for obj in genData['else-units']:
    #     unitData[obj['UnitId']] = {}
        # unitData[obj['UnitId']]['Unitname'] = obj['Unitname']
        # unitData[obj['UnitId']]['Fuel'] = obj['Fuel']
        # unitData[obj['UnitId']]['IC'] = obj['IC']

    #za sve izabrane godine dodaj samo nove jedinice
    for yr in yearsNew:
        for ut in unitsAdd:
            chunk = {}
            chunk['Year'] = yr
            chunk['UnitId'] = ut 
            # chunk['Unitname'] = unitData[ut]['Unitname']
            # chunk['Fuel'] = unitData[ut]['Fuel']
            # chunk['IC'] = unitData[ut]['IC']
            chunk['CF'] = 0
            chunk['EF'] = 0
            chunk['FUC'] = 0
            chunk['INC'] = 0
            chunk['OCF'] = 0
            chunk['OCV'] = 0
            chunk['CO2'] = 0
            chunk['SO2'] = 0
            chunk['NOX'] = 0
            chunk['Other'] = 0
            tData.append(chunk)


    #updatUnits je sve postojece jednice minus one koje se remove, ovdje nisu ukljucene nove jednic jer smo njih dodali u prethodnom loop
    #za sve dodane godine u studiji dodaj samo postojece jednice bez onih koje se remove
    unitsExiUpdate = set(unitsExi) - set(unitsRemove)
    for yr in yearsAdd:
        for ut in unitsExiUpdate:
            chunk = {}
            chunk['Year'] = yr
            chunk['UnitId'] = ut 
            # chunk['Unitname'] = unitData[ut]['Unitname']
            # chunk['Fuel'] = unitData[ut]['Fuel']
            # chunk['IC'] = unitData[ut]['IC']
            chunk['CF'] = 0
            chunk['EF'] = 0
            chunk['FUC'] = 0
            chunk['INC'] = 0
            chunk['OCF'] = 0
            chunk['OCV'] = 0
            chunk['CO2'] = 0
            chunk['SO2'] = 0
            chunk['NOX'] = 0
            chunk['Other'] = 0
            tData.append(chunk)

    File.writeFile( tData, tDataPath)

def updateCData(genData, cDataPath):

    cData = File.readFile(cDataPath)
    #definisi godine yearsExi = godine koje postoje u cData existing years
    #yearsNew godine koje smo izabrali u editu case, nove godine yearsNew
    #yearsAdd godine koje trebamo dodati u cData i to je yearsExi-yearsNew sve one godine koje ne postoje u cData a dodali smo ihtj sada postoje u yearNew
    # yearsExi = [ {k for k in chunk if k != 'UnitId'}   for chunk in cData]
    yearsExi = set()
    for yr in cData[0]:
        if yr != 'UnitId':
            yearsExi.add(yr)

    yearsNew = genData['else-years']

    yearsAdd = set(yearsNew) - yearsExi
    yearsRemove = yearsExi - set(yearsNew)

    #dio za unite, ista logika kao za godine
    unitsExi = [ unit['UnitId'] for unit in cData]
    unitsNew = [ unit['UnitId'] for unit in genData['else-units']]

    unitsAdd = set(unitsNew) - set(unitsExi)
    unitsRemove = set(unitsExi) - set(unitsNew)

    #iz posojeceg cData izbaciti sve one elemente koji su u unitRemove ili yearsRemove
    cData = [ unit for unit in cData if unit['UnitId'] not in unitsRemove ]

    #dopuniti postojecke chunkove sa novim godinama za postojece Unite
    for d in cData:
        for k in list(d):
            if k!= 'UnitId':
                if k in yearsRemove:
                    del d[k]
                for ya in yearsAdd:
                    d[ya] = True

    #add new chunk of Unit configuration with all years True
    for unit in unitsAdd:
        chunk = {}
        chunk['UnitId'] = unit
        for year in yearsNew:
            chunk[year] = True
        cData.append(chunk)


    File.writeFile( cData, cDataPath)

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
            cDataPath = Path(Config.DATA_STORAGE, case, "cData.json")

            tDataPath_df = Path(Config.DATA_STORAGE, case, "tData_df.json")
            #edit case sa istim imenom
            if case == casename:
                File.writeFile( genData, genDataPath)
                updateTData(genData, tDataPath)
                updateHData(genData, hDataPath)
                updateCData(genData, cDataPath)

                defaultTData_DF(genData, tDataPath_df)
                response = {
                    "message": "You have change case general data!",
                    "status_code": "edited"
                }
            #edit case sa drugim imenom, mramo odma provjeriit da li novo ime postoji u sistemu
            else:
                if not os.path.exists(Path(Config.DATA_STORAGE,casename)):
                    File.writeFile( genData, genDataPath)
                    updateTData(genData, tDataPath)
                    updateHData(genData, hDataPath)
                    updateCData(genData, cDataPath)

                    defaultTData_DF(genData, tDataPath_df)
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
                cDataPath = Path(Config.DATA_STORAGE, casename, "cData.json")

                tDataPath_df = Path(Config.DATA_STORAGE, casename, "tData_df.json")

                File.writeFile( genData, genDataPath)
                defaultHData(genData, hDataPath)
                defaultTData(genData, tDataPath)
                defaultCData(genData, cDataPath)

                defaultTData_DF(genData, tDataPath_df)
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
