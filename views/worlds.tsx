
import MapView, {Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, Modal, Pressable } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import StatusGauge from '../components/StatusGauge';
import WorldMap from '../components/WorldMap';
import MovementHandler from '../connectivity/movements';
import PlacesHandler from '../connectivity/places';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({name:null, address:null,actions:[]});
  
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
  const placesHandler = PlacesHandler(socket, {
    setModalVisible:setModalVisible, 
    setModalData:setModalData
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
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalData.name}</Text>
            <Text style={styles.modalText}>{modalData.address}</Text>
            {modalData.actions.map(
              (action) => {
                return (<Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {action.action()}}
                >
                  <Text style={styles.textStyle}>{action.label}</Text>
                </Pressable>)
              }
            )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});