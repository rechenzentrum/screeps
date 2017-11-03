module.exports = {
    
    run: function(creep) {

        var sourceId = creep.memory.source;
        
        if (creep.room.memory.sources[sourceId].container.id) {
            
            var containerId = creep.room.memory.sources[sourceId].container.id;
            
            var source = Game.getObjectById(sourceId);
            var container = Game.getObjectById(containerId);
            
            if(creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
                creep.say('gather');
    	    }
    	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.working = true;
    	        creep.say('store');
    	    }
    	    
    	    if (creep.memory.working) {
    	        if (container.hits < container.hitsMax) {
                	if (creep.repair(container) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
    	        } else {
                    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
    	        }
            } else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            
        }
        
    }

};