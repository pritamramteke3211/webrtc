import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigaions/Navigation';

const App = () => {

  return (
    <SafeAreaProvider>
      <Navigation/>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({})