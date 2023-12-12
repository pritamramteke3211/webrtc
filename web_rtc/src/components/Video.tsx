import { StyleSheet, Text, View,TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { MediaStream, RTCView } from 'react-native-webrtc';
import Button from './Button';

interface Props {
    hangup?: () => void;
    localStream?: MediaStream | null;
    remoteStream?: MediaStream | null;
}


function ButtomContainer( props : Props ) {
  return (
    <View style={styles.btnContainer}>
      <Button iconName='phone' backgroundColor='red'
      onPress={props.hangup}
      />
    </View>
  )
}

const Video = (props: Props) => {

    // console.log("props.localStream",props.localStream)
    


    // On call we will just display the local stream
    if (props.localStream && !props.remoteStream) {
        return <View style={styles.container}>
            <RTCView
                streamURL={props.localStream.toURL()}
                objectFit={'cover'}
                style={styles.video}
            />
            <ButtomContainer hangup={props.hangup} />
        </View>
    }

    // Once the call is connected we will display
    // local Stream on top of remote stream
    if (props.localStream && props.remoteStream) {
        return <View style={styles.container}>
            {
                props.remoteStream &&
                <RTCView
                streamURL={props.remoteStream.toURL()}
                objectFit={'cover'}
                style={styles.video}
            />}

            <RTCView
                streamURL={props.localStream.toURL()}
                objectFit={'cover'}
                style={styles.videoLocal}
            />

            <ButtomContainer hangup={props.hangup} />
        </View>
    }

  return (   
        <ButtomContainer hangup={props.hangup} />
  )
}

export default Video

const styles = StyleSheet.create({
    btnContainer:{
        flexDirection:'row',
        bottom:30,
    },
    container:{
        flex: 1,
        justifyContent:'flex-end',
        alignItems:'center',
    },
    video:{
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    videoLocal:{
        position: 'absolute',
        width: 100,
        height: 150,
        top: 0,
        left: 20,
        elevation: 10,
    },
})