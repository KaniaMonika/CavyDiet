import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors } from '../../constants/styles';
import { API_URL } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

interface Piggy {
  id: number;
  name: string;
  sex: string;
  weight_g: number;
}

interface Herd {
  id: number;
  user_id: number;
  herd_size: number;
  piggies: Piggy[];
}

const MAX_PIGGIES_PER_HERD = 15;
const MIN_PIGGIES_PER_HERD = 2;

export default function HerdDetailsScreen() {
  const { id, herdNumber } = useLocalSearchParams();

  const [herd, setHerd] = useState<Herd | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchHerd = async () => {
      try {
        const response = await fetch(`${API_URL}/herds/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || 'Failed to fetch herd');
          return;
        }

        setHerd(data);
      } catch (error) {
        setErrorMessage('Cannot connect to server');
      }
    };

    fetchHerd();
  }, [id, token]);

  if (errorMessage) {
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.card}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.text}>{errorMessage}</Text>
        </View>
      </View>
    );
  }

  if (!herd) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.loadingText}>Loading herd...</Text>
      </View>
    );
  }

  const piggiesCount = herd.piggies.length;
  const isHerdFull = piggiesCount >= MAX_PIGGIES_PER_HERD;

  const isSetupIncomplete = piggiesCount < MIN_PIGGIES_PER_HERD;
  const missingPiggiesCount = MIN_PIGGIES_PER_HERD - piggiesCount;

  const handleDeletePiggy = (piggyId: number) => {
    Alert.alert(
      'Delete piggy',
      'Are you sure you want to delete this piggy?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePiggy(piggyId),
        },
      ]
    );
  };

 const deletePiggy = async (piggyId: number) => {

  if (!token) {
    alert('Authentication failed');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/guinea-pigs/${piggyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to delete piggy');
      return;
    }

    const updatedResponse = await fetch(`${API_URL}/herds/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedHerd = await updatedResponse.json();

      if (!updatedResponse.ok) {
        alert(updatedHerd.message || 'Failed to refresh herd');
        return;
      }

      setHerd(updatedHerd);
  } catch (error) {
    alert('Cannot connect to server');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.section}>
      <Text style={styles.pageTitle}>Herd Details</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Herd #{herdNumber}</Text>

        <Text style={styles.text}>
          Piggies in herd: {piggiesCount} / {MAX_PIGGIES_PER_HERD}
        </Text>

        {isSetupIncomplete && (
          <Text style={styles.warningText}>
            Setup incomplete: add {missingPiggiesCount} more piggies.
          </Text>
        )}

        <View style={styles.divider} />

        {herd.piggies.map((piggy) => (
          <View key={piggy.id} style={styles.piggyRow}>
            <View style={styles.piggyInfo}>
              <Text style={styles.piggyName} numberOfLines={1}>
                {piggy.name}
              </Text>

              <Text style={styles.piggyDetails}>
                {piggy.sex} • {piggy.weight_g} g
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: '/piggy-setup',
                    params: {
                      mode: 'edit',
                      piggyId: String(piggy.id),
                      herdId: String(herd.id),
                      herdNumber: String(herdNumber),
                      name: piggy.name,
                      sex: piggy.sex,
                      weight: String(piggy.weight_g),
                    },
                  })
                }
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDeletePiggy(piggy.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isHerdFull && styles.buttonDisabled,
          ]}
          disabled={isHerdFull}
          onPress={() =>
            router.replace({
              pathname: '/piggy-setup',
              params: {
                mode: 'add',
                herdId: String(herd.id),
                herdNumber: String(herdNumber),
              },
            })
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            {isHerdFull
              ? 'Herd is full'
              : isSetupIncomplete
                ? 'Continue setup'
                : 'Add Piggy'}
          </Text>
        </Pressable>
      </View>
      </View> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: colors.textDark,
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  title: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  text: {
    color: colors.textDark,
    fontSize: 15,
    marginBottom: 8,
  },

  helperText: {
    color: colors.textDark,
    fontSize: 13,
    opacity: 0.75,
    marginBottom: 8,
  },

  loadingText: {
    color: colors.textDark,
    fontSize: 16,
  },

  divider: {
    height: 1,
    backgroundColor: '#D9D1C7',
    marginVertical: 18,
  },

  piggyRow: {
    backgroundColor: '#F6F8F6',
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E4E9E5',
  },

  piggyName: {
    color: colors.textDark,
    fontSize: 17,
    fontWeight: 'bold',
  },

  piggyDetails: {
    color: colors.textDark,
    marginTop: 3,
  },

  piggyInfo: {
    flex: 1,
    marginRight: 12,
  },

  piggyIcon: {
    fontSize: 24,
    flexShrink: 0,
  },

  addButton: {
    backgroundColor: colors.orange,
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },

  warningText: {
    color: '#D9534F',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: 'bold',
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingVertical: 30,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deleteButton: {
    backgroundColor: '#D9534F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  deleteButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 13,
  },

  editButton: {
  backgroundColor: colors.orange,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  marginRight: 8,
},

editButtonText: {
  color: colors.white,
  fontWeight: 'bold',
  fontSize: 13,
},
section: {
  width: '85%',
},

card: {
  width: '100%',
  backgroundColor: colors.white,
  borderRadius: 25,
  padding: 22,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 4,

  elevation: 3,
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
});