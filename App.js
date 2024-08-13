import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, ActivityIndicator, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [carMake, setCarMake] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const unsplashAccessKey = 'KPjZbLm5WYrLVamOw5tT28ebOjgxgVjgGHQha4oMtos'; // Replace with your actual Unsplash Access Key

  const fetchCarModels = () => {
    setLoading(true);
    setError('');
    setVehicleTypes([]);
    setImageUrl('');

    const makesUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/${carMake}?format=json`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${carMake}&per_page=1&client_id=${unsplashAccessKey}`;

    // Fetch vehicle types for the car make
    axios.get(makesUrl)
      .then(response => {
        if (response.data.Results && response.data.Results.length > 0) {
          // Remove duplicates based on VehicleTypeName
          const uniqueTypes = response.data.Results.reduce((acc, curr) => {
            const x = acc.find(item => item.VehicleTypeName === curr.VehicleTypeName);
            if (!x) {
              return acc.concat([curr]);
            } else {
              return acc;
            }
          }, []);
          setVehicleTypes(uniqueTypes);
        } else {
          setError('No vehicle types found.');
        }
      })
      .catch(() => {
        setError('Failed to fetch vehicle types.');
      });

    // Fetch image from Unsplash
    axios.get(unsplashUrl)
      .then(response => {
        if (response.data.results.length > 0) {
          setImageUrl(response.data.results[0].urls.regular);
        } else {
          setError('No images found for this car make.');
        }
      })
      .catch(() => {
        setError('Failed to fetch image.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LinearGradient
      colors={['#FFD700', '#FF4500', '#800080']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Car Information Viewer</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a car make (e.g., Tesla, BMW)"
          value={carMake}
          onChangeText={setCarMake}
        />
        <Button title="View Car" onPress={fetchCarModels} />
        {loading && <ActivityIndicator size="large" color="#00ff00" />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
        {vehicleTypes.length > 0 && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Vehicle Types for {carMake}:</Text>
            {vehicleTypes.map((type, index) => (
              <Text key={index} style={styles.infoText}>{type.VehicleTypeName}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'web' ? '20vh' : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '40%',
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 600,
    height: 400,
    marginTop: 20,
    borderRadius: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 22,
    color: '#fff',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
  },
});
