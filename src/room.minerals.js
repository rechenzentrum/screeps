var minerals = Game.spawns['Spawn1'].room.find(FIND_MINERALS);

function getExtractor(mineral) {
    var structures = mineral.pos.lookFor(LOOK_STRUCTURES);
    if (structures.length) {
        var extractor = structures.find(function(structure) {
            return structure.structureType === STRUCTURE_EXTRACTOR;
        })
        return extractor;
    }
    return false;
}

function spawnCreeps() {
    
    minerals.forEach(function(mineral) {
        
        var extractor = getExtractor(mineral);
        var extractorCreeps = _.filter(Game.creeps, function(creep) {
            return creep.memory.role === 'extractor' && creep.memory.mineral === mineral.id;
        });
        
        if (mineral.mineralAmount > 0 && extractor && extractorCreeps.length < 2) {
            var canSpawn = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Extractor_' + Game.time, {
                dryRun: true
            });
            
            if (canSpawn === 0) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Extractor_' + Game.time, {
                    memory: {
                      role: 'extractor',
                      mineral: mineral.id,
                      extractor: extractor.id
                    }
                });

            }
        }
        
    })
    
}

module.exports = {
    run: function() {
        //spawnCreeps();
    }
};