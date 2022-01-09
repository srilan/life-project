import SpriteSheet from 'rn-sprite-sheet';
import {Socket} from 'socket.io-client';

let options = {
  setPlayerPosition: null, 
  playerPosition: null,
  setHasPath: null, 
  setMoving: null, 
  setPath: null,
  mapRef: null,
  stamina: null,
};

const MovementHandler = (socket: Socket, {
  setPlayerPosition, 
  playerPosition,
  setHasPath, 
  setMoving, 
  setPath,
  mapRef,
  stamina
}) => {    
  options = {
    setPlayerPosition, 
    playerPosition,
    setHasPath, 
    setMoving, 
    setPath,
    mapRef,
    stamina
  }
  socket.on("player stamina set", (stamina:any)=> {
    options.stamina.setStamina(stamina.value);
  });
  socket.on("path show", (path:any)=> {
    try {
      if (!options || !options.setHasPath) {
        return;
      }
      const steps = [];
      options.setHasPath(true);
      for (const p of path) {
        steps.push({
          latitude: p.start_location.lat,
          longitude: p.start_location.lng,
        })
        steps.push({
          latitude: p.end_location.lat,
          longitude: p.end_location.lng,
        })
      }
      options.setPath(steps);
      /**move player here */
      const move = async () =>  {
        console.log("Waling")
        options.setMoving(true);
        //play('walk');
        let origin = options.playerPosition;
        let distanceTravelled = 0;
        for (const p of path) {
          let destination = p.end_location;
          const distance = p.distance.value; //distance in meters
          distanceTravelled += distance;
          const divisions = Math.ceil(distance / 10);
          const lngDelta = (destination.lng - origin.longitude)/divisions;
          const latDelta = (destination.lat - origin.latitude)/divisions;
          for (let i=1; i<=divisions; i++) {
            const lat = origin.latitude + (i*latDelta);
            const lng = origin.longitude + (i*lngDelta);
            const camera = {
              center: {
                latitude: lat,
                longitude: lng,
              },
              pitch: 50,
              altitude: 20,
              zoom: 20
            };
            if (mapRef.current) {
              mapRef.current.animateCamera(camera,{duration: 100});
            }
            options.setPlayerPosition({
              latitude: lat,
              longitude: lng,
            });
            
            socket.emit('player position save', {
              latitude: lat,
              longitude: lng,
              distance: distance/10,
            });
            await new Promise(f => setTimeout(f, 100));
          }
          origin = options.playerPosition;
        }
        options.setMoving(false);
      }
      setTimeout(move, 1);
    } catch(e) {
      console.log(e);
    }
  });

  socket.once("player position init", (cood:any)=> {    
    const camera = {
      center: cood,
      pitch: 50,
      altitude: 20,
      zoom: 20
    };
    console.log(cood);
    options.setPlayerPosition({
      latitude: cood.latitude,
      longitude: cood.longitude,
    });
    if (mapRef.current) {
      mapRef.current.setCamera(camera);
    }
  });
}

export default MovementHandler;