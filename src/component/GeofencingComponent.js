import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native'
import React,{useState,useEffect, useRef} from 'react'
import MapView, {Circle, Marker,Polyline} from 'react-native-maps'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});
export default function GeofencingComponent() {
  const [location, setLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [region, setRegion] = useState(null);
  useEffect(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      })();
    }, []);

  useEffect(() => {
    const homeCoordinates = { latitude: -1.9393200, longitude:30.0664620 }; // Example home coordinates
    const workCoordinates = { latitude: -1.955554, longitude: 30.104281 }; // Example work coordinates
    const geofenceRadius = 100; // Example geofence radius in meters

    const isInsideGeofence = (currentLocation, targetLocation, radius) => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );
      return distance <= radius;
    };

    const checkPredefinedAreas = (location) => {
      const isInHome = isInsideGeofence(location.coords, homeCoordinates, geofenceRadius);
      const isInWork = isInsideGeofence(location.coords, workCoordinates, geofenceRadius);

      if (isInHome) {
       sendNotification("Welcome Home","after long day finally you make it home!");
      }

      if (isInWork) {
          sendNotification("You alive at work",);
      }
    };

    const watchLocation = async () => {
      setLocationSubscription(await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
        (location) => {
          setLocation(location);
          checkPredefinedAreas(location);
          updateRegion(location.coords);
        }
      ));
    };

    const updateRegion = (coords) => {
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    watchLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);
  const sendNotification = async (titles,message) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titles,
          body: message,
        },
        trigger: null,
      });
    };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; 
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
      <View style={styles.container}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker coordinate={location.coords} title='You are here' />
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={200} // Change the radius as needed
              strokeWidth={1}
              strokeColor="rgba(158, 158, 255, 0.3)"
              fillColor="rgba(158, 158, 255, 0.3)"
            />
          </MapView>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});