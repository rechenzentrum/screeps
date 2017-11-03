var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var tower = require('tower');
var roomSources = require('room.sources');
var roleGatherer = require('role.gatherer');
var roleTransporter = require('role.transporter');
var roleImporter = require('role.importer');
var roomColonies = require('room.colonies');
var roleTowerCharger = require('role.towerCharger');
var roomMinerals = require('room.minerals');
var roleExtractor = require('role.extractor');
var roleScavenger = require('role.scavenger');
var roomRoads = require('room.roads');
var roleReserver = require('role.reserver');

module.exports.loop = function () {
    
    //console.log('################# Tick #################');
    
    /*
    var test = Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE], 'Test');
    console.log('spawn result: ' + test);
    if (Game.spawns['Spawn1'].spawning) {
        var testName = Game.spawns['Spawn1'].spawning.name;
        console.log('Now spawning: ' + testName);
        console.log('Game creeps : ' + Game.creeps[testName]);
    }
    */
    for (var name in Game.flags) {
        //Game.flags[name].remove();
    }
    
    console.log(JSON.stringify(Game.rooms));
    //console.log(JSON.stringify(Game.getObjectById('59bbc5bd2052a716c3ce9f3e')));
    
    roomRoads.alt(Game.spawns['Spawn1'].room, Game.spawns['Spawn1'].room.storage, Game.getObjectById(''));
    
    for(var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Repair roads
    for(var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        
        var structuresAtPos = creep.pos.lookFor(LOOK_STRUCTURES);
        var road = structuresAtPos.find(function(structure) {
            return structure.structureType === 'road';
        })
        
        if (road && road.hits < road.hitsMax) {
           creep.repair(road);
        }
        
    }

    roomSources.run();
    roomColonies.run();
    //roomMinerals.run();
    
    //console.log(JSON.stringify(Game.spawns['Spawn1'].spawning)); extractor
    
    // Activate Safe Mode
    var myStructures = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: function(object) {
            return object.hits && object.structureType !== 'container' &&
            object.structureType !== 'controller' &&
            object.structureType !== 'rampart' &&
            object.structureType !== 'extractor';
        }
    });

    var underAttack = myStructures.find(function(obj) {
        return obj.hits < obj.hitsMax;
    })
    
    if (underAttack) {
        console.log('activate save mode');
        if (typeof Game.spawns['Spawn1'].room.controller.safeMode == 'undefined') {
            Game.spawns['Spawn1'].room.controller.activateSafeMode();
        }
    }
    
    //console.log(JSON.stringify(myStructures));
    
    //console.log(JSON.stringify(Memory));
    
    var eca = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var ea = Game.spawns.Spawn1.room.energyAvailable;
    console.log('energyCapacityAvailable: ' + eca);
    console.log('energyAvailable: ' + ea);
    
    var harvesters = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'harvester';
    });
    
    var upgraders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'upgrader';
    });
    
    var builders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'builder';
    });
    
    var gatherers = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'gatherer';
    });
    
    console.log('gatherers.length: ' + gatherers.length);
    
    var transporters = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'transporter';
    });
    
    var towerChargers = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'towerCharger';
    });
    
    var scavengers = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'scavenger';
    });
    
    if (harvesters.length < 2 && gatherers.length < 1) {
        //Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'harvester'});
    }
    
    var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
    
    console.log('sources.length: ' + sources.length);
    
    if (gatherers.length == sources.length) {
        
        if (transporters.length < 2) {
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK], null, {role: 'transporter'});
        }
        
        if (towerChargers.length < 2) {
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK], null, {role: 'towerCharger'});
        }
        
        if (upgraders.length < 2) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'upgrader'});
        }
        
        if (builders.length < 2) {
            Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'builder'});
        }
        
        var droppedResources = Game.spawns['Spawn1'].room.find(FIND_DROPPED_RESOURCES);
        
        //console.log(JSON.stringify(droppedResources));
        console.log('scavengers.length: ' + scavengers.length);
        if (scavengers.length < 1 && droppedResources.length) {
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK], null, {role: 'scavenger'});
        }
        
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'gatherer') {
            roleGatherer.run(creep);
        }
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        if(creep.memory.role == 'importer') {
            roleImporter.run(creep);
        }
        if(creep.memory.role == 'towerCharger') {
            roleTowerCharger.run(creep);
        }
        if(creep.memory.role == 'extractor') {
            roleExtractor.run(creep);
        }
        if(creep.memory.role == 'scavenger') {
            roleScavenger.run(creep);
        }
        if(creep.memory.role == 'reserver') {
            roleReserver.run(creep);
        }
    }
    
    tower.run();
}