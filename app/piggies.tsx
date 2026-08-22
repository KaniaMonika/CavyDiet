import { FlatList, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { colors } from '../constants/styles';
import { ActivityIndicator } from 'react-native';
import { API_URL } from '../constants/api';
import { useAuthStore } from '../store/authStore';
import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

type Piggy = {
  id: number;
  name: string;
  sex: string;
  weight_g: number;
  herd_id: number;
  herd_name: string;
  photo_url: string | null;
};



export default function PiggiesScreen() {
  const token = useAuthStore((state) => state.token);
  const pathname = usePathname();
  const [piggies, setPiggies] = useState<Piggy[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectPiggy = (piggy: Piggy) => {
    router.push({
      pathname: '/piggies/[id]',
      params: {
        id: piggy.id.toString(),
        name: piggy.name,
      },
    });
  };

  const fetchPiggies = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await fetch(`${API_URL}/guinea-pigs`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load piggies');
        }

        setPiggies(data);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load piggies'
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
  console.log('CURRENT PATH:', pathname);

  if (pathname === '/piggies' && token) {
    fetchPiggies();
  } else if (!token) {
    setLoading(false);
    setErrorMessage('You are not logged in');
  }
}, [pathname, token]);

  return (
    <FlatList
      data={piggies}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Your Piggies</Text>

          <Text style={styles.pageSubtitle}>
            Choose a piggy to view its profile
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.piggyCard,
            pressed && styles.piggyCardPressed,
          ]}
          onPress={() => handleSelectPiggy(item)}
        >
          {item.photo_url ? (
            <Image
              source={{ uri: `${API_URL}${item.photo_url}` }}
              style={styles.piggyImage}
            />
          ) : (
            <Text style={styles.piggyIcon}>🐹</Text>
          )}

          <Text style={styles.piggyName}>
            {item.name}
          </Text>

          <Text style={styles.herdName}>
            {item.herd_name}
          </Text>
          <Text style={styles.herdName}>
            {item.sex}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 18,
  },

  pageTitle: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 6,
  },

  pageSubtitle: {
    color: colors.textDark,
    fontSize: 14,
    marginLeft: 12,
  },

  row: {
    gap: 12,
    marginBottom: 12,
  },

  piggyCard: {
    flex: 1,
    minHeight: 130,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  piggyCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  piggyIcon: {
    fontSize: 38,
    marginBottom: 10,
  },

  piggyImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },

  piggyName: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  herdName: {
    color: colors.textDark,
    fontSize: 13,
    marginTop: 4,
    opacity: 0.7,
  },
});