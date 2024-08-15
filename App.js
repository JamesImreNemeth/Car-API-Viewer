import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  // Manage Applicaition State
  const [selectedCarMake, setSelectedCarMake] = useState(null);
  const [models, setModels] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false); 

  // API key
  const unsplashAccessKey = 'KPjZbLm5WYrLVamOw5tT28ebOjgxgVjgGHQha4oMtos';

  // List the car makes to be displayed
  const carMakes = ['Mercedes', 'Toyota', 'Ford', 'Honda', 'Lexus', 'Mazda', 'Kia', 'Hyundai', 'Mitsubishi', 'Tesla', 'Subaru', 'Isuzu'];

  // Setting the dimensions for a phone version of the app
  const isPhone = Platform.OS !== 'web' && Dimensions.get('window').width < 768;

  // Due to screen size, have reduced car makes to 8
  const displayCarMakes = isPhone ? carMakes.slice(0, 8) : carMakes.slice(0, 10); 

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
          const modelLimit = Platform.OS === 'web' ? 10 : 5;
          setModels(response.data.Results.slice(0, modelLimit));
        } else {
          setError('No models found.');
        }
      })
      .catch(() => {
        setError('Failed to fetch models.');
      });
    
    // Fetch Image API
    axios.get(unsplashUrl)
      .then(response => {
        if (response.data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.results.length);
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
        if (isPhone) {
          setShowDetails(true);
        }
      });
  };

  const goBack = () => {
    setShowDetails(false);
  };

  return (
    <LinearGradient colors={['blue', 'white']} style={styles.gradient}>
      <View style={styles.container}>
        {isPhone && showDetails ? (
          <ScrollView style={styles.rightPane} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style={[styles.backButton, isHovered && styles.backButtonHovered]} 
              onPress={goBack}
              onPressIn={() => setIsHovered(true)}  // Hover effect
              onPressOut={() => setIsHovered(false)} 
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#00ff00" />}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
            {models.length > 0 && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Models for {selectedCarMake}:</Text>
                {models.map((model, index) => (
                  <Text key={index} style={styles.infoText}>{model.Model_Name}</Text>
                ))}
              </View>
            )}
          </ScrollView>
        ) : (
          <ScrollView style={styles.leftPane} contentContainerStyle={{ flexGrow: 1 }}>
            <Text style={styles.title}>Car Information Viewer</Text>
            {displayCarMakes.map((make, index) => (
              <TouchableOpacity key={index} onPress={() => fetchCarDetails(make)}>
                <Text style={styles.carMake}>{make}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {!isPhone && (
          <ScrollView style={styles.rightPane} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            {loading && <ActivityIndicator size="large" color="#00ff00" />}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
            {models.length > 0 && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Models for {selectedCarMake}:</Text>
                {models.map((model, index) => (
                  <Text key={index} style={styles.infoText}>{model.Model_Name}</Text>
                ))}
              </View>
            )}
          </ScrollView>
        )}
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
    paddingBottom: Platform.OS === 'web' ? 50 : 5,
  },
  leftPane: {
    width: '35%',
    backgroundColor: '#fff',
    paddingVertical: 50,
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
    width: Platform.OS === 'web' ? 600 : 300,
    height: Platform.OS === 'web' ? 400 : 200,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 5,
    fontSize: 18,
  },
  backButtonHovered: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
});
