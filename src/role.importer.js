module.exports = {
    run: function(creep) {
        
        var sourcePosition = new RoomObject(creep.memory.source.x, creep.memory.source.y, creep.memory.colony);
        var storage = Game.spawns['Spawn1'].room.storage;
        var colony = Game.rooms[creep.memory.colony];
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('store');
        }

        if (creep.memory.working) {
            if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            } 
        } else {
            
            var hostiles = [];
            
            if (colony) {
                hostiles = colony.find(FIND_HOSTILE_CREEPS);
            }
            
            if (hostiles.length) {
                var dest = new RoomPosition(47, 33, Game.spawns['Spawn1'].room);
                creep.moveTo(dest);
            } else {
                if (creep.room.name !== creep.memory.colony) {
                    creep.moveTo(sourcePosition);
                } else {
                    var source = Game.getObjectById(creep.memory.source.id);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};