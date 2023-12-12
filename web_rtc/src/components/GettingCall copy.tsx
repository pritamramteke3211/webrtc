import {  StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { ProfileImg } from '../assets'
import Button from './Button';

interface Props {
    hangup: () => void;
    join: () => void;
}

const GettingCall = (props : Props) => {
  return (
    <View style={styles.container}>
        <FastImage
        source={ProfileImg}
        style={styles.img}
        />

        <View style={styles.btnContainer}>
          <Button
          iconName='phone'
          backgroundColor='green'
          onPress={props.join}
          style={{marginRight : 30}}
          />  
          <Button
          iconName='phone'
          backgroundColor='red'
          onPress={props.hangup}
          style={{marginRight : 30}}
          />  
        </View>
    </View>
  )
}

export default GettingCall

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'flex-end',
        alignItems:'center',
    },
    img:{
      position : 'absolute',
      width: '100%',
      height: '100%',
    },
    btnContainer:{
        flexDirection:'row',
        bottom: 30,
    },
})