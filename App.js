import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import AccelerometerComponent from './src/component/AccelerometerComponent';
import Ambient from './src/component/Ambient';
import GeofencingComponent from './src/component/GeofencingComponent';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeGuard</Text>
      <Text style={styles.description}>
        Welcome to HomeGuard! This application includes the following features:
      </Text>
      <Text style={styles.feature}>1. Geofencing: Keep track of your locations and receive notifications when entering or exiting predefined areas.</Text>
      <Text style={styles.feature}>2. Ambient Light: Monitor ambient light levels and manage lighting conditions automatically.</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Ambient Light" component={Ambient} />
        <Tab.Screen name="Geofencing" component={GeofencingComponent} />
        <Tab.Screen name='Accelerometer' component={AccelerometerComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  feature: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});
