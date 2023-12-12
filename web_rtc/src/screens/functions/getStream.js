import {mediaDevices } from 'react-native-webrtc'

const getStream = async (type) =>{

    console.log("type",type)

    // alert("type " + type)	

    let cameraCount = 0;

    try {
        const devices = await mediaDevices.enumerateDevices();
    
        devices.map( device => {
            if ( device.kind != 'videoinput' ) { return; };
    
            cameraCount = cameraCount + 1;
        } );
    } catch( err ) {
        // Handle Error
    };

    let mediaConstraints = {
        audio: true,
        video: {
            frameRate: 30,
            facingMode: 'user'
        }
    };
    
    let localMediaStream;
    // let isVoiceOnly =  true;
     
    try {
        const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );
    
        if ( type =='video' ) {
            let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
            videoTrack.enabled = false;
        };
    
        localMediaStream = mediaStream;
    
        if (typeof mediaStream != 'boolean') return mediaStream
                return null;
    } catch( err ) {
        // Handle Error
        return null;
    }
    

}

export default getStream;