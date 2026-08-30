import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type PasswordInputProps = Omit<
  TextInputProps,
  'secureTextEntry'
> & {
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function PasswordInput({
  icon = 'lock-closed-outline',
  ...inputProps
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={20}
        color="#8A948D"
      />

      <TextInput
        {...inputProps}
        style={styles.input}
        secureTextEntry={!isVisible}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Pressable
        style={({ pressed }) => [
          styles.eyeButton,
          pressed && styles.eyeButtonPressed,
        ]}
        onPress={() => setIsVisible((current) => !current)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={
          isVisible ? 'Hide password' : 'Show password'
        }
      >
        <Ionicons
          name={
            isVisible
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          size={21}
          color="#8A948D"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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

  eyeButton: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  eyeButtonPressed: {
    opacity: 0.55,
  },
});