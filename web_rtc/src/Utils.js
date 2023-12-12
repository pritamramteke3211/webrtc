import {mediaDevices } from 'react-native-webrtc'



export default class Utils {
	

    static async getStream(type){
			
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
let isVoiceOnly = false;

try {
	const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );

	if ( isVoiceOnly ) {
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
}