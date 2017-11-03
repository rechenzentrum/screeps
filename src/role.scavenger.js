module.exports = {
    
    run: function(creep) {
        
        var storage = creep.room.storage;
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var droppedChemicals = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                return object.resourceType !== 'energy';
            }
        });
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                return object.resourceType === 'energy';
            }
        });
        
        var carryTotal = _.sum(creep.carry);
        
        /*
        hostile creep in room?
        yes:    drop all energy
                memory working = false
                move towards hostile
        */
        
        if(creep.memory.working && carryTotal == 0) {
            creep.memory.working = false;
            creep.say('pickup');
        }
        if(!creep.memory.working && carryTotal == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('store');
        }
        
        if (creep.memory.working) {
            
            for(var resourceType in creep.carry) {
                if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                };
            }
            
        } else {
            
            var target = creep.pos.findClosestByPath(droppedChemicals);
            
            if (!target) {
                target = creep.pos.findClosestByPath(droppedEnergy);
            }
            
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            
        }
        
    }
    
};