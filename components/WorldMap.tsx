import MapView, {Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import SpriteSheet from 'rn-sprite-sheet';

const WorldMap = ({socket, setMap, hasPath, 
  playerPosition, path, mapRef,
  stamina}) => {
  const playerSprite = useRef<SpriteSheet>(null);   
  const gotoRegion = (cood: any) => {  
    socket.emit('walk to', cood);
  }
  const play = (type : string) => {
    if (playerSprite && playerSprite.current) {      
      playerSprite.current.play({
          type,
          fps: Number(10),
          loop: true,
          resetAfterFinish: true,
          onFinish: () => console.log('hi')
        });
    }
  };

  const stop = () => {
    if (playerSprite && playerSprite.current) {     
      playerSprite.current.stop(() => console.log('stopped'));
    }
  };    
  return (    
    <MapView  style={[StyleSheet.absoluteFillObject, {flex:1}]}  ref={mapRef}
      provider={PROVIDER_GOOGLE}
      onPress={
        (e) => gotoRegion(e.nativeEvent.coordinate)}>
      {hasPath && <Polyline
        coordinates={path}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          '#7F0000',
        ]}
        strokeWidth={6}
      />}
      
    <Marker
      coordinate={playerPosition}
      title='{marker.title}'
      description='{marker.description}'
    >
    <SpriteSheet
      ref={playerSprite}
      source={require('../assets/sprites/man1.png')}
      columns={12}
      rows={8}
      imageStyle={{ marginTop: -1 }}
      animations={{
        walk: Array.from({ length: 8 }, (v, i) => i + 37),
      }}
    />
    </Marker>
  </MapView>
  );
}


export default WorldMap;