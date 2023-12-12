import { ActivityIndicator, DevSettings, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React , { useState, useRef, useEffect } from 'react'
import VideoCall from './src/screens/Call'
import Video from './src/components/Video'
import Button from './src/components/Button'
import GettingCall from './src/components/GettingCall'
import {MediaStream, RTCPeerConnection, EventOnAddStream, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc'
import Utils from './src/Utils'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

const App = () => {

  const [localStream, setlocalStream] = useState()
  const [remoteStream, setRemoteStream] = useState()
  const [gettingCall, setGettingCall] = useState(false)

  const [loading, setloading] = useState(false)

  const pc = useRef();
  const connecting = useRef(false)

  const closePeer = useRef(false)

  const isEmu = Platform.constants.Brand == 'google'


  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');
   
      

      const subscribe = cRef.onSnapshot(snapshot =>  {
   
      
          // alert(`subscribe ${isEmu ? 'Emulator':'Device'}`)
        const data = snapshot.data();
  

        // On answer start the call
        if (pc.current && !pc.current.remoteDescription && data && data.answer
          
          ) {
         
            pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    
          
        }
  
        // If there is offer for chatId set the getting call flag
        if (data && data?.offer && !connecting.current) {
            setGettingCall(true);  
        }
  else
        if (!connecting.current && !data?.offer) {
          setGettingCall(false);
        }
  
      
      });  
    
    

    // On Delete of collection call hangup
    // The Other side has clicked on hangup
    const subscribeDelete = cRef.collection('callee').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        
        if (change.type == 'removed' && pc.current?.connectionState == 'connected' && !closePeer.current) {

          hangup();
        }
      });
    });


    return () => {
      subscribe()
      subscribeDelete()
    }
  }, [])
  

  const setupWebrtc = async() => {

    pc.current =  new RTCPeerConnection(configuration)

    // Get the audio and video stream for th call
    const stream = await Utils.getStream()
    if (stream) {

      setlocalStream(stream)
      
      stream.getTracks().forEach((track)  => pc.current?.addTrack(track, stream))
    }

    pc.current.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }     

  }

  const create = async() => {
    closePeer.current = false
    connecting.current = true;

    // setUp webrtc
    await setupWebrtc();

    // Document for the call
    const cRef = firestore().collection("meet").doc("chatId");
    collectIceCandidates(cRef, "caller", "callee");
    
    if (pc.current) {
      // Create the offer for the call
      // Store the offer under the document

      let sessionConstraints = {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
          VoiceActivityDetection: true
        }
      };

      const offer = await pc.current.createOffer(sessionConstraints);
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };


      cRef.set(cWithOffer);
    }

  };

  const join = async() => {


connecting.current = true;
setGettingCall(false)

const cRef = firestore().collection('meet').doc('chatId');
const offer = (await cRef.get()).data()?.offer;



if (offer) {

  
  // Setup Webrtc
  await setupWebrtc();

  // Exchange the ICE candidates
  // Check the parameters, Its reversed. Since the joining part is calle
   collectIceCandidates(cRef, "callee", "caller");

  if (pc.current) {

 
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));  
    
    

    // Create the answer for the call
    // Update the document with answer
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer)

    const cWithAnswer = {
      answer : {
        type: answer.type,
        sdp: answer.sdp,
      },
    }
    cRef.update(cWithAnswer)
  }
  }}

  /*
  * For disconnecting the call close the connection, release the stream 
  * And delete the document for the call 
  */

  const hangup = async() => {
    setloading(true)
    closePeer.current = true
    
    setGettingCall(false)
    connecting.current = false;
    await streamCleanUp();
    await firestoreCleanUp();


    try {
    // Remove event listeners before closing (recommended)
   await pc.current.removeEventListener('icecandidate', ()=>{});
    await pc.current.removeEventListener('iceconnectionstatechange', ()=>{});
  
    await  pc.current.close();  
    DevSettings.reload()
    } catch(err) {
      console.log("Closing perr conn err", err, isEmu)
    }
    // if (pc.current) {

    // }
  }

  // Helper function
  const streamCleanUp = async() => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream.release();
    }
    setlocalStream(null)
    setRemoteStream(null)


  }
  const firestoreCleanUp = async() => {
    const cRef = firestore().collection('meet').doc('chatId');

    if (cRef) {
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      })

      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      })

      cRef.delete();

    }
  }


  const collectIceCandidates = async(cRef,
    localName,
    remoteName) => {
     
      const candidateCollection = cRef.collection(localName);
  
      if (pc.current) {
      
        // On new ICE candidate add it to firestore
        try {

          pc.current.addEventListener( 'icecandidate', event => {
            if (event.candidate) {
              candidateCollection.add(event.candidate)
            }
          } );

          
        } catch (error) {
          console.log("H error",error) 

        }       
      }

      // Get the ICE candidate added to firestore and update the local PC
if (pc?.current?.connectionState != 'closed') {
  cRef.collection(remoteName).onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
     
      if (change.type == 'added') {
        const candidate = new RTCIceCandidate(change.doc.data())
        pc.current?.addIceCandidate(candidate)
      }
    })
  })

}
     
  }

  //Displays the gettingCall Component
  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />
  }

  if (localStream) {
    return (
      <Video
      hangup={hangup}
      localStream={localStream}
      remoteStream={remoteStream}
      />
    )
  }

  // Display th call button
  return (
    <SafeAreaView style={styles.container}>
      {
        loading ?

       <ActivityIndicator size={'large'} />

       :
      <Button iconName='video' backgroundColor='grey' onPress={create}/>
}  
  </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center',
  }
})