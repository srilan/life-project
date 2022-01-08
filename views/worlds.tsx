
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import RNGamePad from 'react-native-game-pad';
import { useEffect, useState } from 'react';

export function World({navigation}) {
  const [markers, setMarkers] = useState([]);
  useEffect(()=> {
    markers.push({
      latlng: {
        lat: 37.78825,
        long: -122.4324,
      },      
      title: "test",
      description: "test2"
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView  style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
      <View style={{ position: 'absolute', top: 0, left: 0 }}>
        <Text>Name</Text>
        <RNGamePad        
          options={{
            size: 400,
            color: "blue",
            lockX: true
          }}
        />
      </View>
    </View>
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