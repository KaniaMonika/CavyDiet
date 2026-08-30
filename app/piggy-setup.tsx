import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../constants/styles';
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

    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    if (!isEditMode) {
      if (!weight.trim()) {
        alert('Weight is required');
        return;
      }

      if (!Number.isInteger(Number(weight))) {
        alert('Weight must be a whole number');
        return;
      }

      if (Number(weight) < 1) {
        alert('Weight must be greater than 0');
        return;
      }
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

  const progressWidth = `${
  herdSize > 0
    ? Math.min(
        (currentPiggyNumber / herdSize) * 100,
        100
      )
    : 0
}%` as `${number}%`;

const headerLabel = isEditMode
  ? 'PIGGY PROFILE'
  : isAddMode
    ? 'ADD TO HERD'
    : 'HERD SETUP';

const headerBadge = isEditMode
  ? 'EDIT'
  : isAddMode
    ? `HERD ${herdNumber || '?'}`
    : 'STEP 2 OF 2';

const heroTitle = isEditMode
  ? 'Update piggy profile'
  : isAddMode
    ? 'Meet the newest member'
    : 'Introduce your piggies';

const heroDescription = isEditMode
  ? 'Update the details below and save your changes.'
  : isAddMode
    ? 'Add some basic information about your new herd member.'
    : 'Add the basics for each piggy. You can update their profiles later.';


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
          {headerLabel}
        </Text>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            {headerBadge}
          </Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons
            name={
              isEditMode
                ? 'create-outline'
                : isAddMode
                  ? 'person-add-outline'
                  : 'paw-outline'
            }
            size={30}
            color={colors.orange}
          />
        </View>

        <Text style={styles.heroTitle}>
          {heroTitle}
        </Text>

        <Text style={styles.heroDescription}>
          {heroDescription}
        </Text>
      </View>

      {!isEditMode && !isAddMode && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Herd progress
            </Text>

            <Text style={styles.progressValue}>
              Piggy {currentPiggyNumber} of {herdSize}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: progressWidth },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>
          PIGGY DETAILS
        </Text>

        <Text style={styles.cardTitle}>
          {isEditMode
            ? 'Edit details'
            : 'Tell us about this piggy'}
        </Text>

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
              placeholder="Enter piggy name"
              placeholderTextColor="#A4ACA6"
              value={name}
              onChangeText={setName}
              maxLength={30}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Current weight
          </Text>

          {isEditMode ? (
            <View
              style={[
                styles.inputContainer,
                styles.readOnlyContainer,
              ]}
            >
              <Ionicons
                name="scale-outline"
                size={20}
                color="#8A948D"
              />

              <View style={styles.readOnlyContent}>
                <Text style={styles.readOnlyValue}>
                  {weight || piggyWeight || '—'} g
                </Text>

                <Text style={styles.readOnlyHint}>
                  Update weight through Health Checks
                </Text>
              </View>

              <Ionicons
                name="lock-closed-outline"
                size={17}
                color="#A4ACA6"
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Ionicons
                name="scale-outline"
                size={20}
                color="#8A948D"
              />

              <TextInput
                style={styles.input}
                placeholder="Example: 900"
                placeholderTextColor="#A4ACA6"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />

              <Text style={styles.unitText}>
                g
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.inputLabel}>
          Sex
        </Text>

        <View style={styles.sexOptions}>
          <Pressable
            style={[
              styles.sexButton,
              sex === 'boar' &&
                styles.selectedSexButton,
            ]}
            onPress={() => setSex('boar')}
          >
            <Ionicons
              name="male-outline"
              size={18}
              color={
                sex === 'boar'
                  ? colors.orange
                  : '#8A948D'
              }
            />

            <Text
              style={[
                styles.sexButtonText,
                sex === 'boar' &&
                  styles.selectedSexButtonText,
              ]}
            >
              Boar
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sexButton,
              sex === 'sow' &&
                styles.selectedSexButton,
            ]}
            onPress={() => setSex('sow')}
          >
            <Ionicons
              name="female-outline"
              size={18}
              color={
                sex === 'sow'
                  ? colors.orange
                  : '#8A948D'
              }
            />

            <Text
              style={[
                styles.sexButtonText,
                sex === 'sow' &&
                  styles.selectedSexButtonText,
              ]}
            >
              Sow
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sexButton,
              sex === 'unknown' &&
                styles.selectedSexButton,
            ]}
            onPress={() => setSex('unknown')}
          >
            <Ionicons
              name="help-outline"
              size={18}
              color={
                sex === 'unknown'
                  ? colors.orange
                  : '#8A948D'
              }
            />

            <Text
              style={[
                styles.sexButtonText,
                sex === 'unknown' &&
                  styles.selectedSexButtonText,
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
            name={
              isEditMode
                ? 'save-outline'
                : 'add-circle-outline'
            }
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            {isEditMode
              ? 'Save changes'
              : 'Save Piggy'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.noteCard}>
        <View style={styles.noteIcon}>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={colors.orange}
          />
        </View>

        <View style={styles.noteContent}>
          <Text style={styles.noteTitle}>
            Profiles stay editable
          </Text>

          <Text style={styles.noteDescription}>
            You can update names, weight and other details
            later from Your Herds.
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
  flex: 1,
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
  backgroundColor: '#FBE9DC',
  borderColor: '#F3C9AA',
},

selectedSexButtonText: {
  color: colors.orange,
},

  sexButtonText: {
    color: '#7A857D',
    fontWeight: '600',
    fontSize: 13,
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

heroTitle: {
  color: colors.textDark,
  fontSize: 27,
  fontWeight: '800',
  textAlign: 'center',
},

heroDescription: {
  color: '#7A857D',
  fontSize: 15,
  lineHeight: 22,
  textAlign: 'center',
  marginTop: 9,
},

progressCard: {
  backgroundColor: '#EEF3EF',
  borderRadius: 18,
  padding: 16,
  marginBottom: 18,
},

progressHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 11,
},

progressLabel: {
  color: '#4E5B53',
  fontSize: 13,
  fontWeight: '600',
},

progressValue: {
  color: colors.orange,
  fontSize: 13,
  fontWeight: '800',
},

progressTrack: {
  height: 8,
  backgroundColor: '#DDE5DF',
  borderRadius: 4,
  overflow: 'hidden',
},

progressFill: {
  height: '100%',
  backgroundColor: colors.orange,
  borderRadius: 4,
},

cardEyebrow: {
  color: '#89928B',
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 1,
  marginBottom: 7,
},

cardTitle: {
  color: colors.textDark,
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 20,
},

unitText: {
  color: '#7A857D',
  fontSize: 15,
  fontWeight: '700',
  marginLeft: 8,
},

noteCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EEF3EF',
  borderRadius: 18,
  padding: 16,
  marginTop: 18,
},

noteIcon: {
  width: 42,
  height: 42,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.white,
  marginRight: 13,
},

noteContent: {
  flex: 1,
},

noteTitle: {
  color: colors.textDark,
  fontSize: 14,
  fontWeight: '700',
},

noteDescription: {
  color: '#738078',
  fontSize: 13,
  lineHeight: 18,
  marginTop: 3,
},

readOnlyContainer: {
  backgroundColor: '#F1F3F1',
},

readOnlyContent: {
  flex: 1,
  marginLeft: 11,
},

readOnlyValue: {
  color: '#4E5B53',
  fontSize: 15,
  fontWeight: '700',
},

readOnlyHint: {
  color: '#89928B',
  fontSize: 11,
  marginTop: 2,
},

});