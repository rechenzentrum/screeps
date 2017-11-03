var roomMemory = Game.spawns['Spawn1'].room.memory;

function spawnReserverCreeps() {
    
    if (roomMemory.colonies && _.size(roomMemory.colonies)) {
        
        _.forEach(roomMemory.colonies, function(colony, colonyName) {
            
            if (colony.controller) {
            
                var reservers = _.filter(Game.creeps, function(creep) {
                    return creep.memory.role === 'reserver' && creep.memory.controller.id === colony.controller.id && creep.memory.colony === colonyName;
                });
                
                console.log('reservers.length: ' + reservers.length);
                
                if (reservers.length < 2) {
                    
                    // controller not fully reserved
                    //if (Game.rooms[colonyName] && Game.rooms[colonyName].controller.reservation.ticksToEnd < 5000) {
                        
                        var canSpawn = Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE], 'Reserver_' + Game.time, {
                            dryRun: true
                        });
                        
                        if (canSpawn === 0) {
                            Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE], 'Reserver_' + Game.time, {
                                memory: {
                                  role: 'reserver',
                                  controller: {id: colony.controller.id, x: colony.controller.x, y: colony.controller.y},
                                  colony: colonyName
                                }
                            });

                        }
                        
                    //}
                    
                }
                
            }
            
        });
        
    }
    
}

function spawnImporterCreeps() {
    
    if (roomMemory.colonies && _.size(roomMemory.colonies)) {
        
        _.forEach(roomMemory.colonies, function(colony, colonyName) {
            
            if (colony.sources && colony.sources.length) {
                
                colony.sources.forEach(function(source) {
                    
                    var importers = _.filter(Game.creeps, function(creep) {
                        return creep.memory.role === 'importer' && creep.memory.source.id === source.id && creep.memory.colony === colonyName;
                    });
                    
                    console.log('importers.length (' + source.id + '): ' + importers.length);
                    
                    // room must be visible
                    if (Game.rooms[colonyName]) {
                        
                        var hostiles = Game.rooms[colonyName].find(FIND_HOSTILE_CREEPS);
                        
                        if (importers.length < 2 && hostiles.length < 1) {
                            
                            var canSpawn = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Importer_' + Game.time, {
                                dryRun: true
                            });
                            
                            if (canSpawn === 0) {
                                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Importer_' + Game.time, {
                                    memory: {
                                      role: 'importer',
                                      source: {id: source.id, x: source.x, y: source.y},
                                      colony: colonyName
                                    }
                                });
    
                            }
                            
                        }
                        
                    }

                });
                
            }
            
        });

    }
    
}

module.exports = {
    run: function() {
        //spawnReserverCreeps();
        //spawnImporterCreeps();
    }
};