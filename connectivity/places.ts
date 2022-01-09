import SpriteSheet from 'rn-sprite-sheet';
import {Socket} from 'socket.io-client';

let options = {
  setModalVisible: null,
  setModalData: null
};

const PlacesHandler = (socket: Socket, {
  setModalVisible, 
  setModalData
}) => {    
  options = {
    setModalVisible, 
    setModalData
  }
  socket.on("env place set", (res:any)=> {
    setModalVisible(true);
    const details = res.result;
    let actions: any = []
    if (details.types.includes('school')) {
      actions = [
        {name:'study', label: 'Study', action: ()=> {'study'}},
        {name:'enroll', label: 'Enroll', action: ()=> {'enroll'}},
        {name:'apply', label: 'Apply', action: ()=> {'apply'}},
      ]
    }
    const data = {
      name: details.name,
      address: details.formatted_address,
      openNow: details.opening_hours?.open_now,
      ratings: details.rating,
      actions: actions,
    }
    options.setModalData(data);
  });
}

export default PlacesHandler;