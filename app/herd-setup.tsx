import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { API_URL } from '../constants/api';
import { useHerdStore } from '../store/herdStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';

export default function HerdSetupScreen() {
  

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [herdSize, setHerdSize] = useState('');
  const setHerd = useHerdStore((state) => state.setHerd);

  const handleCreateHerd = async () => {
    if (!user || !token) {
      alert('User is not logged in');
      return;
    }

    if (!Number.isInteger(Number(herdSize))) {
      alert('Herd size must be a whole number');
      return;
    }

    if (!herdSize || Number(herdSize) < 2) {
      alert('Herd size must be at least 2');
      return;
    }

    if (Number(herdSize) > 15) {
      alert('You can create up to 15 piggies in one herd only');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/herds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          herdSize: Number(herdSize),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to create herd');
        return;
      }
      setHerd(
        data.herdId,
        Number(herdSize)
      );
      router.push('/piggy-setup');
    } catch (error) {
      alert('Cannot connect to server');
    }
  };

  
    return (
  <KeyboardAwareScrollView
    style={{
      flex: 1,
      backgroundColor: colors.background,
    }}
    contentContainerStyle={styles.scrollContainer}
    enableOnAndroid
    extraScrollHeight={80}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.section}>
      <View style={styles.stepRow}>
        <Text style={styles.stepLabel}>
          HERD SETUP
        </Text>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            STEP 1 OF 2
          </Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons
            name="paw-outline"
            size={30}
            color={colors.orange}
          />
        </View>

        <Text style={styles.title}>
          Let&apos;s set up your herd
        </Text>

        <Text style={styles.subtitle}>
          Tell us how many guinea pigs live together.
          You&apos;ll introduce each one on the next screen.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>
          HERD SIZE
        </Text>

        <Text style={styles.label}>
          How many piggies are in your herd?
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="paw-outline"
            size={20}
            color="#8A948D"
          />

          <TextInput
            style={styles.input}
            placeholder="Example: 2"
            placeholderTextColor="#A4ACA6"
            keyboardType="numeric"
            value={herdSize}
            onChangeText={setHerdSize}
            maxLength={2}
          />
        </View>

        <View style={styles.hintRow}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#7A857D"
          />

          <Text style={styles.hintText}>
            A herd can have between 2 and 15 piggies.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreateHerd}
        >
          <Ionicons
            name="arrow-forward-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            Continue
          </Text>
        </Pressable>
      </View>

      <View style={styles.nextCard}>
        <View style={styles.nextIcon}>
          <Ionicons
            name="sparkles-outline"
            size={21}
            color={colors.orange}
          />
        </View>

        <View style={styles.nextContent}>
          <Text style={styles.nextTitle}>
            Next up
          </Text>

          <Text style={styles.nextDescription}>
            Add a name, sex and current weight for each piggy.
          </Text>
        </View>
      </View>
    </View>
  </KeyboardAwareScrollView>
);
}

const styles = StyleSheet.create({
  

  section: {
    width: '100%',
  },

  title: {
  color: colors.textDark,
  fontSize: 27,
  fontWeight: '800',
  textAlign: 'center',
},

subtitle: {
  color: '#7A857D',
  fontSize: 15,
  lineHeight: 22,
  textAlign: 'center',
  marginTop: 9,
},

label: {
  color: colors.textDark,
  fontSize: 17,
  fontWeight: '700',
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

  
  scrollContainer: {
     flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8F6',
    borderWidth: 1,
    borderColor: '#E4E9E5',
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    marginLeft: 11,
    fontSize: 15,
    color: '#29352D',
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

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  stepRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginHorizontal: 4,
  marginBottom: 22,
},

stepLabel: {
  color: '#89928B',
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 1,
},

stepBadge: {
  backgroundColor: '#FBE9DC',
  paddingHorizontal: 11,
  paddingVertical: 6,
  borderRadius: 20,
},

stepBadgeText: {
  color: colors.orange,
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 0.5,
},

hero: {
  alignItems: 'center',
  marginBottom: 24,
  paddingHorizontal: 12,
},

heroIcon: {
  width: 66,
  height: 66,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FBE9DC',
  marginBottom: 16,
},

cardEyebrow: {
  color: '#89928B',
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 1,
  marginBottom: 7,
},

hintRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 11,
  paddingHorizontal: 3,
},

hintText: {
  flex: 1,
  color: '#7A857D',
  fontSize: 13,
  lineHeight: 18,
  marginLeft: 7,
},

nextCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EEF3EF',
  borderRadius: 18,
  padding: 16,
  marginTop: 18,
},

nextIcon: {
  width: 42,
  height: 42,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.white,
  marginRight: 13,
},

nextContent: {
  flex: 1,
},

nextTitle: {
  color: colors.textDark,
  fontSize: 14,
  fontWeight: '700',
},

nextDescription: {
  color: '#738078',
  fontSize: 13,
  lineHeight: 18,
  marginTop: 3,
},
});