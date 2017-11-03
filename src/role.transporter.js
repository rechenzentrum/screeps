module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.container = '';
            creep.memory.working = false;
            creep.say('load');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('store');
        }
        
        if (creep.memory.working) {
            
            var target;

            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            
            if (target) {
                
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            } else {
                
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_STORAGE }
                });
                
                if (targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                
            }
            
        } else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;
                }
            });
            
            if (containers.length > 0) {
                if (!creep.memory.container) {
                    creep.memory.container = containers[0].id;
                }
                
                var container = Game.getObjectById(creep.memory.container);
                var result = creep.withdraw(container, RESOURCE_ENERGY);
                
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                } else if (result == ERR_NOT_ENOUGH_RESOURCES && creep.carry.energy == 0) {
                    creep.memory.container = '';
                }
            }
            
            /*
                var storage = creep.room.storage;
                
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                } 
            */

        }
    }
};