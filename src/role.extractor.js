module.exports = {
    run: function(creep) {
        
        var mineral = Game.getObjectById(creep.memory.mineral);
        var mineralType = mineral.mineralType;
        var storage = Game.spawns['Spawn1'].room.storage;
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if(!creep.memory.working && creep.carry[mineralType] == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('store');
        }
        
        if (creep.memory.working) {
            if(creep.transfer(storage, mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            } 
        } else {
            if(creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        
    }
};