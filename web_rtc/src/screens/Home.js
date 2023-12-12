import { StyleSheet, Text, View,SafeAreaView, Dimensions } from 'react-native'
import React,{useState, useEffect} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { StackActions, useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';


const Home = ({navigation}) => {

    const [incoming_call, setincoming_call] = useState(false)
    const incoming_call_ref = React.useRef()

    useFocusEffect(
        React.useCallback(() => {
            setincoming_call(false)

            const cRef = firestore().collection('meet').doc('chatId');
            const subscribe = cRef.onSnapshot(snapshot =>  {
                const data = snapshot.data();
          
                // On answer start the call
                if (data && data?.offer) {
                    setincoming_call(true)   
                }
                else{
                    setincoming_call(false)   
                }
              })
         
        }, [])
      );
    
    

  

  return (
    <SafeAreaView style={styles.container}>   
       {
        incoming_call ?
        <View style={styles.incoming_call_cont}>
            <Text style={styles.incoming_call_txt}>
                Incoming Call ...
            </Text>
            <View style={styles.btnContainer}>
          <Button
          iconName='phone'
          backgroundColor='green'
        //   onPress={props.join}
        onPress={()=>{
            navigation.navigate('Call',{
                type : 'video',    
            })
        }}
          style={{marginRight : 30}}
          />  
          <Button
          iconName='phone'
          backgroundColor='red'
        //   onPress={props.hangup}
          style={{marginRight : 30}}
          />  
        </View>
            </View>   
            :
        <View style={{width: 140, 
        flexDirection:'row',
        justifyContent:'space-between'}}>
      
        <Button  iconName='video' backgroundColor='#0f53f3' onPress={()=>{
             navigation.navigate('Call',{
                type : 'audio' ,
                call_req: true,
                    
            })
        }}/>
     
        <Button  iconName='phone' backgroundColor='#36b49f' onPress={()=>{
            navigation.navigate('Call',{
                type : 'video'  ,
                call_req: true,  
            })
        }}/>

        </View>

}
      
  </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent:'center',
      },
    btn:{
        marginTop: 10,
        width: 200,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3155c0',
        alignItems:'center',
        justifyContent:'center',
    },
    btnTxt:{
        color: '#FFF',
        fontSize: 16,
        fontWeight:'700',
        textAlign:'center',
    },
    incoming_call_cont:{
        
        // position: 'absolute',
        // top: Dimensions.get('screen').height/3,
    },
    incoming_call_txt:{
        fontSize:20,
        color: '#000',
    },

    btnContainer:{
        flexDirection:'row',
        top: 30,
    },
})