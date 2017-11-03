module.exports = {
  run: function(room, start, finish) {
        if (room.memory.buildRoads) {
          let sites = _.keys(Game.constructionSites).length;
          try {
              
            let res = PathFinder.search(start.pos, {
            	pos: finish.pos,
            	range: 1
            }, {
            	plainCost: 1,
            	swampCost: 1,
            	maxRooms: 4,
            	roomCallback: function(roomName) {
            	    let searchRoom = Game.rooms[roomName];
            	    console.log(roomName)
            		if (!searchRoom) return;
            		let costs = new PathFinder.CostMatrix;
            		searchRoom.find(FIND_STRUCTURES).forEach(function(structure) {
            			if (structure.structureType === STRUCTURE_ROAD) {
            				costs.set(structure.pos.x, structure.pos.y, 1);
            			} else {
            				costs.set(structure.pos.x, structure.pos.y, 0xff);
            			}
            		});
            		return costs;
            	}
            });
            
            console.log(JSON.stringify(res.path));
            
            /*
            for (let j = 0; j < res.path.length; j++) {
                console.log(res.path[j].roomName);
            	let look = res.path[j].look();
            	let canBuild = look.every(function(lookObject) {
            		return lookObject.type !== LOOK_STRUCTURES && lookObject.type !== LOOK_CONSTRUCTION_SITES;
            	});
            	if (canBuild && sites < 90) {
            	    let ret = Game.rooms[res.path[j].roomName].createFlag(res.path[j]);
            		//let ret = res.path[j].createConstructionSite(res.path[j], STRUCTURE_ROAD);
            		sites += 1;
            		if (ret < 0) {
            			throw ret;
            		};
            	}
            }
            */
            
            room.memory.buildRoads = false;
            
          } catch (err) {
            console.log('Constructing roads went wrong: ' + err);
          }
        }
	},
	alt: function(room, start, finish) {
	    
        if (room.memory.buildRoads) {
            
            let sites = _.keys(Game.constructionSites).length;
            
            try {
                
                var path = room.findPath(start.pos, finish.pos, {
        	        ignoreCreeps: true
                });
                
                console.log(JSON.stringify(path));
                
                /*
                for (let j = 0; j < path.length; j++) {
                    var roomPos = new roomPosition(path[j].x, path[j].y, );
                	let look = path[j].look();
                	let canBuild = look.every(function(lookObject) {
                		return lookObject.type !== LOOK_STRUCTURES && lookObject.type !== LOOK_CONSTRUCTION_SITES;
                	});
                	if (canBuild && sites < 90) {
                	    let ret = Game.rooms[path[j].roomName].createFlag(path[j]);
                		//let ret = path[j].createConstructionSite(path[j], STRUCTURE_ROAD);
                		sites += 1;
                		if (ret < 0) {
                			throw ret;
                		};
                	}
                }
                */
                
                room.memory.buildRoads = false;
            
            } catch (err) {
                
                console.log('Constructing roads went wrong: ' + err);
                
            }
            
        }
        
	}
};