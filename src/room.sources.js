var roomMemory = Game.spawns['Spawn1'].room.memory;

function addSources() {
    if (!roomMemory.sources) {
        roomMemory.sources = {};
        var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
        sources.forEach(function(source) {
            roomMemory.sources[source.id] = {};
        });
    }  
};

function addContainerPosition() {
    
    if (roomMemory.sources && _.size(roomMemory.sources)) {
        
        _.forEach(roomMemory.sources, function(src, srcId) {
            
            if (!src.container) {
                
                src.container = {};
                
                var x = Game.getObjectById(srcId).pos.x;
                var y = Game.getObjectById(srcId).pos.y;
                var terrainObjects = Game.spawns['Spawn1'].room.lookForAtArea(LOOK_TERRAIN, y-1, x-1, y+1, x+1, true);
                var plainTerrainObjects = [];
                var closestPlainTerrainObject;
                
                terrainObjects.forEach(function(obj) {
                    if (obj.terrain === 'plain') {
                        plainTerrainObjects.push( new RoomPosition(obj.x, obj.y, Game.spawns['Spawn1'].room.name) );
                    }
                })
                
                closestPlainTerrainObject = Game.spawns['Spawn1'].pos.findClosestByPath(plainTerrainObjects);
                src.container.x = closestPlainTerrainObject.x;
                src.container.y = closestPlainTerrainObject.y;
                
            }

        });
        
    }
    
};

function buildContainer(src) {
        
    var here = new RoomPosition(src.container.x, src.container.y, Game.spawns['Spawn1'].room.name);
    
    here.createConstructionSite(STRUCTURE_CONTAINER);
    
};

function getContainerId(src) {
        
        var here = new RoomPosition(src.container.x, src.container.y, Game.spawns['Spawn1'].room.name);
        var what;
        
        what = here.lookFor(LOOK_STRUCTURES);
        if (what.length) {
            var container = what.find(function(obj) {
                return obj.structureType === 'container';
            })
            if (container) {
                return container.id;
            }
        }
        
        what = here.lookFor(LOOK_CONSTRUCTION_SITES);
        if (what.length) {
            var container = what.find(function(obj) {
                return obj.structureType === 'container';
            })
            if (container) {
                return 'constructing';
            }
        }
        
        return false;
    
}

function addCreep() {
    
    if (roomMemory.sources && _.size(roomMemory.sources)) {
        
        var n = 0;
        
        _.forEach(roomMemory.sources, function(src, srcId) {
            
            n++;
            
            if (!src.creep) {
                
                var canSpawn = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Gatherer' + n, {
                    dryRun: true
                });
                
                //console.log('canSpawn: ' + canSpawn);
                
                if (canSpawn === 0) {
                    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Gatherer' + n, {
                        memory: {
                          role: 'gatherer',
                          source: srcId
                        }
                    });
                }
                
                if (Game.creeps['Gatherer' + n]) {
                    src.creep = Game.creeps['Gatherer' + n].name;
                }
                
            }
            
        });
    
    }
    
}

function cleanMemory() {
    
    if (roomMemory.sources && _.size(roomMemory.sources)) {
    
        _.forEach(roomMemory.sources, function(src, srcId) {
            
            if (src.creep) {
                if (!Game.creeps[src.creep]) {
                    delete src.creep;
                }
            }
            
        });
    
    }
    
}

module.exports = {
    
    run: function() {
        
        cleanMemory();
        addSources();
        addContainerPosition();
        
        
        addCreep();
        
        
        if (roomMemory.sources && _.size(roomMemory.sources)) {
    
            _.forEach(roomMemory.sources, function(src, srcId) {
                
                if (src.container) {
            
                    var containerId = getContainerId(src);
                    
                    if (containerId) {
                        
                        if (containerId !== 'constructing') {
                            
                            if (containerId !== src.container.id) {
                                
                                src.container.id = containerId;
                                
                            }
                            
                        } else {

                            src.container.id = '';
                            
                        }
                    
                    } else {
                        
                        src.container.id = '';
                        buildContainer(src);
                        
                    }
                
                }

            });
        
        }
        
    }

};