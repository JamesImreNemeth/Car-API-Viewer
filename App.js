import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  // Manage Applicaition State
  const [selectedCarMake, setSelectedCarMake] = useState(null);
  const [models, setModels] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API access key
  const unsplashAccessKey = 'KPjZbLm5WYrLVamOw5tT28ebOjgxgVjgGHQha4oMtos';

  // List the car makes to be displayed
  const carMakes = ['Mercedes', 'Toyota', 'Ford', 'Honda', 'Lexus', 'Mazda', 'Kia', 'Hyundai', 'Mitsubishi', 'Tesla', 'Subaru', 'Isuzu'];

  // Fetch car details based on selected make
  const fetchCarDetails = (carMake) => {
    setLoading(true);
    setError('');
    setModels([]);
    setImageUrl('');
    setSelectedCarMake(carMake);

    // API URLs for Image and Car Models
    const makesUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${carMake}?format=json`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${carMake}&per_page=1&client_id=${unsplashAccessKey}`;

    // Fetch car models from API
    axios.get(makesUrl)
      .then(response => {

        if (response.data.Results && response.data.Results.length > 0) {
          // Limits model results to 10
          setModels(response.data.Results.slice(0, 10));
        } else {
          setError('No models found.');
        }
      })
      .catch(() => {
        setError('Failed to fetch models.');
      });

    // Fetch image from API
    axios.get(unsplashUrl)
      .then(response => {
        if (response.data.results.length > 0) {
          // Pick a random index from the results
          const randomIndex = Math.floor(Math.random() * response.data.results.length);
          // Set the image URL 
          setImageUrl(response.data.results[randomIndex].urls.regular);
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
    // Background Gradient colour to make site look more pleasing
      colors={['blue', 'white']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <ScrollView style={styles.leftPane} contentContainerStyle={{ flexGrow: 1 }}>
          {carMakes.map((make, index) => (
            <TouchableOpacity key={index} onPress={() => fetchCarDetails(make)}>
              <Text style={styles.carMake}>{make}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.rightPane} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Car Information Viewer</Text>
          {loading && <ActivityIndicator size="large" color="#00ff00" />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
          {models.length > 0 && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Models for {selectedCarMake}:</Text>
              {models.map((model, index) => (
                <Text key={index} style={styles.infoText}>{model.Model_Name}</Text> //List car Models
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

// Styling for the Application
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
  },
  leftPane: {
    width: '35%',
    backgroundColor: '#fff',
    paddingVertical: 100,
  },
  carMake: {
    fontSize: 20,
    padding: 15,
    color: 'black',
    textAlign: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
    width: '100%'
  },
  rightPane: {
    width: '75%',
    padding: 20,
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
    width: '100%',
  },
  infoTitle: {
    fontSize: 22,
    color: '#000',
    marginVertical: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#000',
    marginVertical: 5,
    textAlign: 'center',
  },
});
