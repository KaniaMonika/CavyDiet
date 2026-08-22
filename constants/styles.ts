import { StyleSheet } from 'react-native';

export const colors = {
  background: '#E9EEF0',
  orange: '#F47C3C',
  card: '#F79C65',
  input: '#F6F8F6',
  textDark: '#333',
  white: '#fff',
  lightGreen: '#64846E'
};

export const commonStyles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: colors.background,
  alignItems: 'center',
  paddingTop: 20,
  paddingHorizontal: 20,
},

  card: {
    width: '85%',
    backgroundColor: colors.card,
    borderRadius: 25,
    padding: 20,
  },

  input: {
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#000',
  },

  button: {
    marginTop: 25,
    backgroundColor: colors.orange,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  label: {
    color: colors.textDark,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
  },

  header: {
  alignItems: 'center',
  marginBottom: 30,
},

logo: {
  fontSize: 38,
  fontWeight: '800',
  color: colors.orange,
  marginBottom: 5,
  letterSpacing: 1,
},

headerText: {
  fontSize: 16,
  color: colors.textDark,
},


});