import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Pedometer, Accelerometer } from 'expo-sensors';
import { LineChart } from 'react-native-chart-kit';

export default function AccelerometerComponent() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isMotionDetected, setIsMotionDetected] = useState(false);
  const [stepChartData, setStepChartData] = useState([]);
  const [motionChartData, setMotionChartData] = useState([]);
  const [motionCount, setMotionCount] = useState(0);
  const count = 0;
  const MAX_DATA_POINTS = 5;
  const MAX_DATA = 10;

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const sub = Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
        console.log(result.steps);
        setStepChartData(prevData => [...prevData.slice(-MAX_DATA + 1), result.steps]);
      });
      setSubscription(sub);
    }
  };

  const handleMotionDetection = ({ x, y, z }) => {
    const acceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    const threshold = 2;
    if (acceleration > threshold) {
      setIsMotionDetected(true);
      alert('Motion Detected');
      setTimeout(() => {
        setIsMotionDetected(false);
      }, 5000);
      setMotionChartData(prevData => [...prevData.slice(-MAX_DATA + 1), acceleration]);
    }
  };

  useEffect(() => {
    const setupSubscription = async () => {
      const sub = await subscribe();
      return sub;
    };

    const cleanup = () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };

    setupSubscription();

    return cleanup;
  }, []); // Removed the dependency array

  useEffect(() => {
    const accelerometerSubscription = Accelerometer.addListener(handleMotionDetection);
    return () => {
      accelerometerSubscription.remove();
    };
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#0000FF',
    backgroundGradientTo: '#0000FF',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pedometer: {isPedometerAvailable}</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Step Count Chart</Text>
        {stepChartData.length > 0 && (
          <LineChart
            data={{
              labels: Array.from({ length: stepChartData.length }, (_, i) => (i + 1).toString()),
              datasets: [{ data: stepChartData }]
            }}
            width={320}
            height={200}
            chartConfig={chartConfig}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  text: {
    fontSize: 20,
    lineHeight: 30,
  },
  image: {
    width: 80,
    height: 80,
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
