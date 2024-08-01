import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {LightSensor} from'expo-sensors'
import * as Brightness from 'expo-brightness';
import {BarChart, LineChart} from 'react-native-chart-kit'

export default function Ambient() {
    const [light, setLight] = useState(0);
    const [data, setData] = useState({ labels: [], datasets: [{ data: [] }] });
    const MAX_DATA_POINTS = 4;

    useEffect(() => {
      const getLightData = async () => {
        try {
          LightSensor.setUpdateInterval(1000);
          LightSensor.addListener((data) => {
            setLight(data.illuminance);
            handleLightLevelChange(data.illuminance);
            updateChartData(data.illuminance);
          });
        } catch (error) {
          console.log('Light sensor is not available on this device');
        }
      };
  
      getLightData();
  
      return () => {
        LightSensor.removeAllListeners();
      };
    }, []);
    useEffect(() => {
      (async () => {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          Brightness.setSystemBrightnessAsync(1);
        }
      })();
    }, []);
      const handleLightLevelChange = (brightness) => {
        if (brightness < 100) {
          Brightness.setSystemBrightnessAsync(brightness/10);
          // Alert.alert('Low Light Detected', 'Consider turning on lights for better visibility');
        } else if (brightness > 1000) {
          Brightness.setSystemBrightnessAsync(1);
          // Alert.alert('High Light Detected', 'Consider adjusting lights for comfort');
        }
      };

      const updateChartData = (lightIntensity) => {
        const currentTime = new Date().toLocaleTimeString();
        setData((prevData) => {
          const newLabels = [...prevData.labels, currentTime].slice(-MAX_DATA_POINTS);
          const newData = [...prevData.datasets[0].data, lightIntensity].slice(-MAX_DATA_POINTS);
          return {
            labels: newLabels,
            datasets: [{ data: newData }],
          };
        });
      };




  return (
    <View style={styles.container}>
    {/* Display the current light intensity */}
    <Text style={styles.text}>Light Intensity: {light.toFixed(3)} lux</Text>

    {/* Conditionally render the LineChart if data is available */}
    {data && data.labels.length > 0 && (
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 50}
        height={250}
        yAxisSuffix=" lux"
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726'
          }
        }}
        bezier
        style={styles.chart}
        xLabelsOffset={-2}
      />
    )}

    {/* Conditionally render the BarChart if data is available */}
    {data && data.labels.length > 0 && (
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 50}
        height={250}
        yAxisSuffix="Nber"
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForBackgroundLines: {
            strokeDasharray: '', // solid background lines with no dashes
          },
        }}
        style={styles.chart}
      />
    )}
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});