import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { commonStyles, colors } from '../constants/styles';
import { useHerdStore } from '../store/herdStore';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function PiggySetupScreen() {
  
  const logout = useAuthStore((state) => state.logout);
  const resetHerd = useHerdStore((state) => state.resetHerd);
  const token = useAuthStore((state) => state.token);
 

  const herdSize = useHerdStore((state) => state.herdSize);
  const createdPiggiesCount = useHerdStore((state) => state.createdPiggiesCount);
  const currentHerdId = useHerdStore((state) => state.currentHerdId);
  const incrementCreatedPiggiesCount = useHerdStore(
    (state) => state.incrementCreatedPiggiesCount
  );

  const currentPiggyNumber = createdPiggiesCount + 1;
  const [sex, setSex] = useState('unknown');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');

  const {
    mode,
    herdId,
    herdNumber,
    piggyId,
    name: piggyName,
    sex: piggySex,
    weight: piggyWeight,
  } = useLocalSearchParams<{
    mode?: string;
    herdId?: string;
    herdNumber?: string;
    piggyId?: string;
    name?: string;
    sex?: string;
    weight?: string;
  }>();

const isAddMode = mode === 'add';
const isEditMode = mode === 'edit';

useEffect(() => {
  if (!isEditMode) {
    return;
  }

  setName(piggyName || '');
  setSex(piggySex || 'unknown');
  setWeight(piggyWeight || '');
}, [isEditMode, piggyName, piggySex, piggyWeight]);

  const handleSavePiggy = async () => {
    const targetHerdId = isAddMode || isEditMode
      ? Number(herdId)
      : currentHerdId;

   if (!targetHerdId || !token) {
      alert('Authentication failed');
      return;
    }

    if (isEditMode && !piggyId) {
      alert('Piggy was not found');
      return;
    }

    if (!Number.isInteger(Number(weight))) {
      alert('Weight must be a whole number');
      return;
    }

    if (!name.trim() || !weight.trim()) {
      alert('Name and weight are required');
      return;
    }

    if (Number(weight) < 1) {
      alert('Weight must be greater than 0');
      return;
    }

     if (name.trim().length > 30) {
      alert('Name must be 30 characters or less');
      return;
    }

    if (isEditMode) {
      try {
        const response = await fetch(`${API_URL}/guinea-pigs/${piggyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            sex,
            weightG: Number(weight),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Failed to update piggy');
          return;
        }

        alert('Piggy updated');

        router.replace({
          pathname: '/herd-details/[id]',
          params: {
            id: String(herdId),
            herdNumber: String(herdNumber),
          },
        });

        return;
      } catch (error) {
        alert('Cannot connect to server');
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/guinea-pigs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          herdId: targetHerdId,
          name,
          sex,
          weightG: Number(weight),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to save piggy');
        return;
      }

      incrementCreatedPiggiesCount();

      const nextPiggyNumber = createdPiggiesCount + 1;

      if (isAddMode) {
        alert('Piggy added');
        router.replace({
        pathname: '/herd-details/[id]',
        params: {
          id: String(targetHerdId),
          herdNumber: String(herdNumber),
        },
      });
        return;
      }

      if (nextPiggyNumber >= herdSize) {
        alert('All piggies saved');

        router.replace('/home');

        return;
      }

      setName('');
      setWeight('');
      setSex('unknown');
    } catch (error) {
      alert('Cannot connect to server');
    }
  };


  return (
    <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid
            extraScrollHeight={80}
            keyboardShouldPersistTaps="handled"
          >
      

      <Text style={styles.pageSubtitle}>
           {isEditMode
            ? 'Edit piggy'
            : isAddMode
              ? 'Add new piggy'
              : `Piggy ${currentPiggyNumber} of ${herdSize}`}
      </Text>

      <View style={styles.section}>
      <Text style={styles.title}>Piggy Profile</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Name
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="paw-outline"
              size={20}
              color="#8A948D"
            />

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#A4ACA6"
              value={name}
              onChangeText={setName}
              maxLength={30}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Weight
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="scale-outline"
              size={20}
              color="#8A948D"
            />

            <TextInput
              style={styles.input}
              placeholder="900 g"
              placeholderTextColor="#A4ACA6"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>
          Sex
        </Text>

        <View style={styles.sexOptions}>
          <Pressable
            style={[
              styles.sexButton,
              sex === 'boar' && styles.selectedSexButton,
            ]}
            onPress={() => setSex('boar')}
          >
            <Ionicons
              name="male-outline"
              size={18}
              color={sex === 'boar' ? '#4E5B53' : '#8A948D'}
            />

            <Text
              style={[
                styles.sexButtonText,
                sex === 'boar' && styles.selectedSexButtonText,
              ]}
            >
              Boar
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sexButton,
              sex === 'sow' && styles.selectedSexButton,
            ]}
            onPress={() => setSex('sow')}
          >
            <Ionicons
              name="female-outline"
              size={18}
              color={sex === 'sow' ? '#4E5B53' : '#8A948D'}
            />

            <Text
              style={[
                styles.sexButtonText,
                sex === 'sow' && styles.selectedSexButtonText,
              ]}
            >
              Sow
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sexButton,
              sex === 'unknown' && styles.selectedSexButton,
            ]}
            onPress={() => setSex('unknown')}
          >
            <Ionicons
              name="help-outline"
              size={18}
              color={sex === 'unknown' ? '#4E5B53' : '#8A948D'}
            />

            <Text
              style={[
                styles.sexButtonText,
                sex === 'unknown' && styles.selectedSexButtonText,
              ]}
            >
              Unknown
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSavePiggy}
        >
          <Ionicons
            name={isEditMode ? 'save-outline' : 'add-circle-outline'}
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            {isEditMode ? 'Save changes' : 'Save Piggy'}
          </Text>
        </Pressable>
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
    fontSize: 24,
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

  sexOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  sexButton: {
    flexGrow: 1,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F6F8F6',
    borderWidth: 1,
    borderColor: '#E4E9E5',
    borderRadius: 15,
  },

  selectedSexButton: {
    backgroundColor: '#E7ECE8',
    borderColor: '#D5DDD7',
  },

  sexButtonText: {
    color: '#7A857D',
    fontWeight: '600',
    fontSize: 13,
  },

  selectedSexButtonText: {
    color: '#4E5B53',
  },

  pageSubtitle: {
    width: '100%',
    color: colors.textDark,
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '600',
    paddingLeft: 12,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#4E5B53',
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

});