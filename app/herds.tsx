import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { commonStyles, colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { useHerdStore } from '../store/herdStore';
import { useCallback, useState } from 'react';
import { API_URL } from '../constants/api';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
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

export default function Herds() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setHerd = useHerdStore((state) => state.setHerd);
  const resetHerd = useHerdStore((state) => state.resetHerd);
  const currentHerdId = useHerdStore((state) => state.currentHerdId)
  const [activeHerdIndex, setActiveHerdIndex] = useState(0);
  const [herds, setHerds] = useState<Herd[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const logout = useAuthStore((state) => state.logout);


  const handleUnauthorized = () => {
    logout();
    resetHerd();
    router.replace('/');
  };

 


  useFocusEffect(
    useCallback(() => {
      const fetchHerds = async () => {
        if (!user) {
          return;
        }

        try {
          const response = await fetch(`${API_URL}/herds/my`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (response.status === 401) {
            handleUnauthorized();
            return;
          }

          if (!response.ok) {
            setErrorMessage(data.message || 'Failed to fetch herds');
            setHerds([]);
            return;
          }

          if (!Array.isArray(data)) {
            setErrorMessage('Invalid herds response');
            setHerds([]);
            return;
          }

          setHerds(data);

            if (data.length === 0) {
              resetHerd();
              setActiveHerdIndex(0);
              return;
            }

            const activeIndex = data.findIndex(
              (herd) => herd.id === currentHerdId
            );

            if (activeIndex !== -1) {
              setActiveHerdIndex(activeIndex);
              return;
            }

            setActiveHerdIndex(0);

            setHerd(
              data[0].id,
              data[0].herd_size,
              1
            );
        } catch (error) {
          setErrorMessage('Failed to fetch herds');
        }
      };

      fetchHerds();
    }, [user, token, setHerd, resetHerd, currentHerdId])
  );

  if (!user || !token) {
    return (
      <View style={commonStyles.container}>
        <Text>No user found</Text>
      </View>
    );
  }

  if (herds.length === 0) {
  return (
    <View style={commonStyles.container}>
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>No herds to display</Text>

        <Text style={styles.emptyText}>
          Create your first herd to start adding piggies.
        </Text>

        <Pressable
          style={styles.emptyButton}
          onPress={() => router.push('/herd-setup')}
        >
          <Text style={styles.emptyButtonText}>Create herd</Text>
        </Pressable>
      </View>
    </View>
  );
}

  if (activeHerdIndex >= herds.length) {
    setActiveHerdIndex(0);
    return null;
  }

  const activeHerd = herds[activeHerdIndex];

  const goPrevious = () => {
    const newIndex = activeHerdIndex === 0
      ? herds.length - 1
      : activeHerdIndex - 1;

    setActiveHerdIndex(newIndex);
    setHerd(
      herds[newIndex].id,
      herds[newIndex].herd_size,
      newIndex + 1
    );
  };

  const goNext = () => {
    const newIndex = activeHerdIndex === herds.length - 1
      ? 0
      : activeHerdIndex + 1;

    setActiveHerdIndex(newIndex);
    setHerd(
      herds[newIndex].id,
      herds[newIndex].herd_size,
      newIndex + 1
    );
  };

  const handleDeleteHerd = (herdId: number) => {
  Alert.alert(
    'Delete herd',
    'Are you sure you want to delete this herd? All piggies in this herd will be permanently deleted.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteHerd(herdId),
      },
    ]
  );
};

const deleteHerd = async (herdId: number) => {
  try {
    const response = await fetch(`${API_URL}/herds/${herdId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to delete herd');
      return;
    }

    const updatedHerds = herds.filter((herd) => herd.id !== herdId);

    setHerds(updatedHerds);

    if (updatedHerds.length === 0) {
      resetHerd();
      setActiveHerdIndex(0);
      alert('Herd deleted successfully');
      return;
    }

    const nextActiveIndex =
      activeHerdIndex >= updatedHerds.length
        ? updatedHerds.length - 1
        : activeHerdIndex;

    const nextActiveHerd = updatedHerds[nextActiveIndex];

    setActiveHerdIndex(nextActiveIndex);

    setHerd(
      nextActiveHerd.id,
      nextActiveHerd.herd_size,
      nextActiveIndex + 1
    );

    alert('Herd deleted successfully');
  } catch (error) {
    alert('Cannot connect to server');
  }
};

  return (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.switcher}>
      <Pressable style={styles.arrowButton} onPress={goPrevious}>
        <Text style={styles.arrowText}>‹</Text>
      </Pressable>

      <Text style={styles.herdName}>Herd {activeHerdIndex + 1}</Text>

      <Pressable style={styles.arrowButton} onPress={goNext}>
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>

    <View style={styles.herdCard}>
      <Text style={styles.cardTitle}>Herd information</Text>

      <Text style={styles.cardSubtitle}>
        {activeHerd.piggies.length} piggies in this herd
      </Text>

      <View style={styles.divider} />

      {activeHerd.piggies.map((piggy) => (
        <View key={piggy.id} style={styles.piggyRow}>
          <View style={styles.piggyInfo}>
            <Text style={styles.piggyName} numberOfLines={1}>
              {piggy.name}
            </Text>

            <Text style={styles.piggyDetails}>
              {piggy.sex} • {piggy.weight_g} g
            </Text>
          </View>

          <Ionicons
            name="paw-outline"
            size={22}
            color="#8A948D"
          />
        </View>
      ))}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() =>
          router.push({
            pathname: '/herd-details/[id]',
            params: {
              id: String(activeHerd.id),
              herdNumber: String(activeHerdIndex + 1),
            },
          })
        }
      >
        <View style={styles.herdButtonContent}>
        <Ionicons
          name="settings-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Manage herd
        </Text>
      </View>
    </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => handleDeleteHerd(activeHerd.id)}
      >
        <View style={styles.herdButtonContent}>
        <Ionicons
          name="trash-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Delete herd
        </Text>
      </View>
    </Pressable>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  switcher: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: 'bold',
  },

  herdName: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: 'bold',
  },

  herdCard: {
    width: '85%',
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

  cardTitle: {
    fontSize: 26,
    color: colors.textDark,
    fontWeight: 'bold',
  },

  cardSubtitle: {
    color: colors.textDark,
    marginTop: 6,
    fontSize: 15,
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

  hint: {
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
  },

  emptyCard: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  emptyTitle: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  emptyText: {
    color: colors.textDark,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: colors.orange,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },

  emptyButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  manageButton: {
    backgroundColor: colors.orange,
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },

  manageButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingVertical: 30,
  },

  deleteHerdButton: {
    backgroundColor: '#D9534F',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',
  },

  deleteHerdButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
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

  deleteButton: {
    marginTop: 10,
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    borderRadius: 17,
    backgroundColor: '#D9534F',
    shadowColor: '#D9534F',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },

  herdButtonContent: {
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
});