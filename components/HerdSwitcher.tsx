import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { API_URL } from '../constants/api';
import { colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { useHerdStore } from '../store/herdStore';

type Herd = {
  id: number;
  herd_size: number;
};

type HerdSwitcherProps = {
  style?: StyleProp<ViewStyle>;
};

export default function HerdSwitcher({
  style,
}: HerdSwitcherProps) {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const currentHerdId = useHerdStore(
    (state) => state.currentHerdId
  );

  const currentHerdNumber = useHerdStore(
    (state) => state.currentHerdNumber
  );

  const setHerd = useHerdStore(
    (state) => state.setHerd
  );

  const resetHerd = useHerdStore(
    (state) => state.resetHerd
  );

  const [herds, setHerds] = useState<Herd[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchHerds = async () => {
        if (!token) {
          return;
        }

        try {
          const response = await fetch(
            `${API_URL}/herds/my`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.status === 401) {
            logout();
            resetHerd();
            router.replace('/');
            return;
          }

          if (
            response.ok &&
            Array.isArray(data) &&
            isActive
            ) {
            const loadedHerds = data as Herd[];

            setHerds(loadedHerds);

            const selectedHerdId =
                useHerdStore.getState().currentHerdId;

            const selectedHerdExists = loadedHerds.some(
                (herd) => herd.id === selectedHerdId
            );

            if (
                loadedHerds.length > 0 &&
                !selectedHerdExists
            ) {
                const firstHerd = loadedHerds[0];

                setHerd(
                firstHerd.id,
                firstHerd.herd_size,
                1
                );
            }
            }
        } catch (error) {
          console.log(
            'Failed to load herds for switcher:',
            error
          );
        }
      };

      fetchHerds();

      return () => {
        isActive = false;
      };
    }, [token, logout, resetHerd, setHerd])
  );

  const currentIndex = herds.findIndex(
    (herd) => herd.id === currentHerdId
  );

  const displayedHerdNumber =
    currentIndex >= 0
        ? currentIndex + 1
        : currentHerdNumber || 1;

  const handleSwitchHerd = () => {
    if (herds.length < 2) {
      return;
    }

    const nextIndex =
      currentIndex === -1 ||
      currentIndex === herds.length - 1
        ? 0
        : currentIndex + 1;

    const nextHerd = herds[nextIndex];

    setHerd(
      nextHerd.id,
      nextHerd.herd_size,
      nextIndex + 1
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.herdInformation}>
        <Text style={styles.label}>
          CURRENT HERD
        </Text>

        <Text style={styles.herdName}>
          Herd {displayedHerdNumber}
        </Text>
      </View>

      {herds.length > 1 && (
        <Pressable
          style={({ pressed }) => [
            styles.switchButton,
            pressed && styles.switchButtonPressed,
          ]}
          onPress={handleSwitchHerd}
          accessibilityRole="button"
          accessibilityLabel="Switch current herd"
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={19}
            color={colors.orange}
          />

          <Text style={styles.switchButtonText}>
            Switch
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF3EF',
    borderRadius: 17,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  herdInformation: {
    flex: 1,
    marginRight: 12,
  },

  label: {
    color: '#89928B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  herdName: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  switchButton: {
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBE9DC',
    borderRadius: 13,
    paddingHorizontal: 13,
  },

  switchButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  switchButtonText: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '700',
  },
});