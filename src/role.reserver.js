module.exports = {
    run: function(creep) {
        
        var controllerPosition = new RoomObject(creep.memory.controller.x, creep.memory.controller.y, creep.memory.colony);
            
        if (creep.room.name !== creep.memory.colony) {
            creep.moveTo(controllerPosition);
        } else {
            //var controller = Game.getObjectById(creep.memory.controller.id);
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        
    }
};