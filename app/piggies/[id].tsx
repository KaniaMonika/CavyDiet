import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_URL } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type Piggy = {
  id: number;
  name: string;
  sex: string;
  weight_g: number;
  herd_id: number;
  herd_name: string;
};

type HealthCheck = {
  id: number;
  guinea_pig_id: number;
  check_date: string;
  weight_g: number;
  concerns: string | null;
  created_at: string;
};

export default function PiggyProfileScreen() {
  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const { token } = useAuthStore();

  const [piggy, setPiggy] = useState<Piggy | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [weight, setWeight] = useState('');
  const [concerns, setConcerns] = useState('');
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleAddPicture = () => {
  Alert.alert(
    'Add picture',
    'Choose picture source',
    [
      {
        text: 'Camera',
        onPress: openCamera,
      },
      {
        text: 'Gallery',
        onPress: openGallery,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]
  );
};

const openCamera = async () => {
  const permission =
    await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission required',
      'Camera permission is required to take a picture.'
    );
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
  const uri = result.assets[0].uri;

  setImageUri(uri);
  await uploadPiggyImage(uri);
}
};

const openGallery = async () => {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission required',
      'Gallery permission is required to choose a picture.'
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
  const uri = result.assets[0].uri;

  setImageUri(uri);
  await uploadPiggyImage(uri);
}
};

const uploadPiggyImage = async (uri: string) => {
  try {
    const formData = new FormData();

    const fileName = uri.split('/').pop() || `piggy-${id}.jpg`;
    const extension = fileName.split('.').pop()?.toLowerCase();

    const mimeType =
      extension === 'png'
        ? 'image/png'
        : extension === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

    formData.append(
      'image',
      {
        uri,
        name: fileName,
        type: mimeType,
      } as any
    );

    const response = await fetch(
      `${API_URL}/guinea-pigs/${id}/image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload image');
    }

    console.log('Uploaded image:', data);
    await fetchPiggy();
    alert('Image uploaded!');
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : 'Something went wrong'
    );
  }
};

  const fetchPiggy = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch(
        `${API_URL}/guinea-pigs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch piggy');
      }

      setPiggy(data);

if (data.photo_url) {
  const fullImageUrl = `${API_URL}${data.photo_url}`;

  console.log('PHOTO URL:', fullImageUrl);

  setImageUri(fullImageUrl);
} else {
  setImageUri(null);
}
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthChecks = async () => {
    try {
      const response = await fetch(
        `${API_URL}/guinea-pigs/${id}/health-checks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch health checks'
        );
      }

      setHealthChecks(data);
    } catch (error) {
      console.log('Health checks error:', error);
    }
  };

  const handleSaveHealthCheck = async () => {
    const parsedWeight = Number(weight);

    if (!weight.trim()) {
      alert('Please enter weight.');
      return;
    }

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      alert('Please enter a valid weight.');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/guinea-pigs/${id}/health-checks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            weight_g: parsedWeight,
            concerns,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save health check'
        );
      }

      setWeight('');
      setConcerns('');

      await Promise.all([
        fetchHealthChecks(),
        fetchPiggy(),
      ]);

      alert('Health check saved!');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      );
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchPiggy();
      fetchHealthChecks();
    }
  }, [id, token]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMessage || !piggy) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {errorMessage || 'Piggy not found'}
        </Text>
      </View>
    );
  }

  
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.pageTitle}>
        {piggy.name}
      </Text>

      <Pressable
        style={styles.picturePlaceholder}
        onPress={handleAddPicture}
        >
        {imageUri ? (
            <Image
            source={{ uri: imageUri }}
            style={styles.piggyImage}
            resizeMode="cover"
            onError={(event) => {
                console.log(
                'IMAGE ERROR:',
                event.nativeEvent.error
                );
            }}
            />
        ) : (
            <>
            <Text style={styles.pictureIcon}>🐹</Text>
            <Text style={styles.pictureText}>Add picture</Text>
            </>
        )}
        </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current weight</Text>

        <View style={styles.card}>
        <Text style={styles.weightValue}>
            {piggy.weight_g} g
        </Text>

        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Check</Text>

        <View style={styles.card}>
        <Text style={styles.label}>Weight</Text>

        <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight in grams"
            placeholderTextColor="#888"
            keyboardType="numeric"
        />

        <Text style={styles.label}>Concerns</Text>

        <TextInput
            style={[styles.input, styles.concernsInput]}
            value={concerns}
            onChangeText={setConcerns}
            placeholder="Optional health concerns"
            placeholderTextColor="#888"
            multiline
            textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSaveHealthCheck}
        >
          <Ionicons
            name="save-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            Save
          </Text>
        </Pressable>
        </View>
      </View>

      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Health History</Text>

  {healthChecks.length === 0 ? (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        No health checks yet.
      </Text>
    </View>
        ) : (
            healthChecks.map((check) => (
            <View
                key={check.id}
                style={[styles.card, styles.historyCard]}
            >
                <View style={styles.historyHeader}>
                <Text style={styles.historyWeight}>
                    {check.weight_g} g
                </Text>

                <Text style={styles.historyDate}>
                    {new Date(check.check_date).toLocaleDateString()}
                </Text>
                </View>

                <Text style={styles.historyConcern}>
                {check.concerns || 'No concerns'}
                </Text>
            </View>
            ))
        )}
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 40,
  },

  pageTitle: {
    color: colors.textDark,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  picturePlaceholder: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 65,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,

    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.orange,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  pictureIcon: {
    fontSize: 42,
    marginBottom: 4,
  },

  pictureText: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: 'bold',
  },

  section: {
    width: '100%',
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 12,
  },

  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  weightValue: {
    color: colors.textDark,
    fontSize: 22,
    fontWeight: 'bold',
  },

  cardText: {
    color: colors.textDark,
    fontSize: 15,
    lineHeight: 22,
  },

  debugText: {
    color: colors.textDark,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.5,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    },

    errorText: {
    color: '#D9534F',
    fontSize: 16,
    textAlign: 'center',
    },

    detailText: {
    color: colors.textDark,
    fontSize: 15,
    marginTop: 8,
    },
  label: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    },

    input: {
    width: '100%',
    backgroundColor: colors.background,
    color: colors.textDark,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
    },

    concernsInput: {
        minHeight: 110,
        },

        button: {
  marginTop: 25,
  minHeight: 56,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 9,
  borderRadius: 17,
  backgroundColor: colors.orange,
  shadowColor: colors.orange,
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 3,
},

buttonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.99 }],
},

buttonDisabled: {
  opacity: 0.6,
},

buttonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#FFFFFF',
},

        historyCard: {
    marginBottom: 14,
    },

    historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    },

    historyWeight: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
    },

    historyDate: {
    color: colors.textDark,
    fontSize: 14,
    opacity: 0.6,
    },

    historyConcern: {
    color: colors.textDark,
    fontSize: 15,
    lineHeight: 21,
    },
        
    piggyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 65,
        },
});