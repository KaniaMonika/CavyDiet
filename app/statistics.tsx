import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { router } from 'expo-router';

import { API_URL } from '../constants/api';
import { colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { useHerdStore } from '../store/herdStore';
import { Statistics } from '../types/statistics';
import StatisticsOverview from '../components/StatisticsOverview';
import HerdSwitcher from '../components/HerdSwitcher';

export default function StatisticsScreen() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const currentHerdId = useHerdStore(
    (state) => state.currentHerdId
  );

  const resetHerd = useHerdStore(
    (state) => state.resetHerd
  );

  const [statistics, setStatistics] =
    useState<Statistics | null>(null);

  const [errorMessage, setErrorMessage] =
    useState('');

  const handleUnauthorized = () => {
    logout();
    resetHerd();
    router.replace('/');
  };

  const fetchStatistics = async () => {
    if (!token || !currentHerdId) {
      return;
    }

    setStatistics(null);
    setErrorMessage('');

    try {
      const response = await fetch(
        `${API_URL}/meals/statistics?herdId=${currentHerdId}&days=7`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            'Failed to fetch statistics'
        );
        return;
      }

      setStatistics(data);
    } catch (error) {
      setErrorMessage('Cannot connect to server');
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [token, currentHerdId]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Statistics
      </Text>

      <HerdSwitcher style={styles.herdSwitcher} />

      {errorMessage ? (
        <Text style={styles.message}>
          {errorMessage}
        </Text>
      ) : !statistics ? (
        <Text style={styles.message}>
          Loading statistics...
        </Text>
      ) : (
        <StatisticsOverview
          statistics={statistics}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  title: {
    color: colors.textDark,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  herdSwitcher: {
    marginBottom: 18,
  },

  message: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
});