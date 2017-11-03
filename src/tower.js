module.exports = {
    
    run: function() {
        var towers = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        if (towers.length) {
            towers.forEach(function(tower) {
                var target;
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var ramparts = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
                    filter: function (structure) {
                        return structure.structureType == STRUCTURE_RAMPART && structure.hits < 1000000;
                    }
                });
                        
                if (closestHostile) {
                    if (closestHostile.pos.x > 1 && closestHostile.pos.x < 48 && closestHostile.pos.y > 1 && closestHostile.pos.y < 48) {
                        target = closestHostile;
                    }
                }
                
                if (target) {
                    tower.attack(target);
                } else if (ramparts.length) {
                    tower.repair(ramparts[0]);
                }
            })
        }
        
        //console.log('towers: ' + towers.length);
    }
    
};