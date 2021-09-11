"use strict";

const routePlanner = require("./route/routePlanner");
const printer = require("./utils/print");
const fs = require("fs");

/*
Indici in cui si trovano i parametri passati da console
dopo la normalizzazione di argv
*/

const MAP_PATH_INDEX = 0;
const START_ROOM_INDEX = 1;
const OBJ_COLLECT_INDEX = 2;
const ERR_EXIT_CODE = 1;

//variabili per la struttura delle stanze
let roomsMap = [];
let adjacencyMap = [];
let objectsMap = [];

function isStartRoomNumber(startRoom) {
    let start = Number(startRoom);
    if (!Number.isInteger(start) || start < 1) {
      process.stderr.write("\nErrore | Stanza di partenza non valida\n");
      process.exitCode = ERR_EXIT_CODE;
      process.exit(ERR_EXIT_CODE);
    }
  }

function read() {
    // per avere i parametri di input
    let inputArgs = process.argv.slice(2);

    //check se ci sono almeno 2 input (mappa e stanza di partenza)
    if (inputArgs.length < 2) {
        process.stderr.write(
        "\nErrore | inserire almeno 2 input\n"
        );
        process.exitCode = ERR_EXIT_CODE;
        process.exit(ERR_EXIT_CODE);
    }

    isStartRoomNumber(inputArgs[1]);

    return inputArgs;
}

//creo la struttura della mappa delle stanze
function computeRoomNeighbors(room) {
    let neighbors = [];
    if (room.north) {
        neighbors[room.north] = 1;
    }
    if (room.south) {
        neighbors[room.south] = 1;
    }
    if (room.west) {
        neighbors[room.west] = 1;
    }
    if (room.east) {
        neighbors[room.east] = 1;
    }
    return neighbors;
}

//trovo le stanze con gli oggetti
function computeObjectsMap(room) {
    if (room.objects.length) {
        room.objects.forEach(object => {
            objectsMap[object.name] = room.id;
        });
    }
    return
}

// restituisco le stanze con gli oggetti
function getObjectsRooms(objects) {
    let nodes = [];
    objects.forEach(currentObject => {
        if (
            objectsMap[currentObject] &&
            !nodes.includes(objectsMap[currentObject])
        ) {
            nodes.push(objectsMap[currentObject]);
        }
    });
  
    return nodes;
}

// controllo validazione dei dati elaborati fin ora -------------------------------------------------------------------------
function startRoomIsValid(startRoom, roomsMap) {
    if (!roomsMap[startRoom]) {
        process.stderr.write("\nErrore | Stanza di partenza non valida\n");
        process.exitCode = ERR_EXIT_CODE;
        process.exit(ERR_EXIT_CODE);
    }
}

// controlo se gli oggetti inseriti in input sono contenuti nel labirinto
function isObjectValid(object, objectsMap) {
    if (!objectsMap[object]) {
        process.stderr.write("\nErrore | Impossibile trovare un percorso\n");
        process.exitCode = ERR_EXIT_CODE;
        process.exit(ERR_EXIT_CODE);
    }
}

function objectsToCollectAreValid(toCollect, objectsMap) {
    toCollect.forEach(object => {
        isObjectValid(object, objectsMap);
    });
}

//----------------------------------------------------------------------------------------------------------------------------
function computeRoomsData(map) {
    map.rooms.forEach(currentRoom => {
        // per ogni stanza faccio le seguente cose:
        // aggiungo alla lista roomsMap per creare una mappa
        roomsMap[currentRoom.id] = currentRoom;
        // trovo le stanze adiacenti
        adjacencyMap[currentRoom.id] = computeRoomNeighbors(currentRoom);
        // trovo le stanze con gli oggetti
        computeObjectsMap(currentRoom);
    });
    return;
}

const args = read();
const filePath = args[MAP_PATH_INDEX];
const toCollect = args.slice(OBJ_COLLECT_INDEX);
const startRoom = Number(args[START_ROOM_INDEX]);

//get json from Maps folder
const data = fs.readFileSync(filePath);
const map = JSON.parse(data);

computeRoomsData(map);
const targetRooms = getObjectsRooms(toCollect);

// controllo validità dei dati
startRoomIsValid(startRoom, roomsMap);
objectsToCollectAreValid(toCollect, objectsMap);

// eseguo l'algoritmo del labirinto con i dati elaborati
const route = routePlanner.getRoute(adjacencyMap, startRoom, targetRooms);

isRouteEmpty(route);
printer.printResult(route, roomsMap, toCollect);

// controlla se non è riuscito a trovare una route per tutti gli oggetti e nel caso ritorna un msg di errore 
function isRouteEmpty(route) {
  if (!route) {
    process.stderr.write("\nErrore | Impossibile trovare un percorso\n");
    process.exitCode = ERR_EXIT_CODE;
    process.exit(ERR_EXIT_CODE);
  }
}
