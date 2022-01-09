
import MapView, {Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import StatusGauge from '../components/StatusGauge';
import WorldMap from '../components/WorldMap';
import MovementHandler from '../connectivity/movements';
import io from 'socket.io-client';

export function World({navigation}) {
  const socket = io('https://port-3001-my-site-scatalinio233286.codeanyapp.com/', {jsonp: false});
  
  const mapRef =useRef();
  const [markers, setMarkers] = useState([]);
  const [stamina, setStamina] = useState(100);
  const [hasPath, setHasPath] = useState(false);
  const [path, setPath] = useState([]);
  const [moving, setMoving] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({latitude:0, longitude:0});
  
  const movementHandler = MovementHandler(socket, {
    setPlayerPosition:setPlayerPosition, 
    playerPosition:playerPosition,
    setHasPath:setHasPath, 
    setMoving:setMoving, 
    setPath:setPath,
    mapRef:mapRef,
    stamina: {
      value:stamina, 
      setStamina: setStamina
    }
  });
  useEffect(()=> {
    markers.push({
      latlng: {
        latitude: 37.78825,
        longitude: -122.4324,
      },      
      title: "test",
      description: "test2"
    });
    socket.emit("player position", 1);    
  }, []);
  return (<>
    <View style={StyleSheet.absoluteFillObject}>
      <WorldMap socket={socket} 
        hasPath={hasPath} playerPosition={playerPosition} 
        path={path} mapRef={mapRef}
        stamina={{stamina, setStamina}}
      />
    </View>
    <View style={{ top: 0, left: 0, padding: 10, position:"relative",backgroundColor: 'rgba(0,0,0,0.2)'}}>
      <Text>Name</Text>
      <StatusGauge value={stamina} max={100} />
      
    </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});