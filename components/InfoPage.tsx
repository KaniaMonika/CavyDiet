import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../constants/styles';

interface InfoPageProps {
  title: string;
  content: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function InfoPage({
  title,
  content,
  icon = 'information-circle-outline',
}: InfoPageProps) {
  const lines = content
    .trim()
    .split('\n')
    .map((line) => line.trim());

  const isHeading = (line: string) => {
    if (!line) {
      return false;
    }

    // Numbered sections, e.g. "1. Introduction"
    if (/^\d+\.\s/.test(line)) {
      return true;
    }

    // FAQ questions
    if (line.endsWith('?')) {
      return true;
    }

    // Short standalone section names
    const sectionNames = [
      'Email',
      'Data Requests',
      'Response Time',
      'Still need help?',
    ];

    return sectionNames.includes(line);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={24}
            color={colors.orange}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            {title}
          </Text>

        </View>
      </View>

      <View style={styles.contentCard}>
        {lines.map((line, index) => {
          if (!line) {
            return (
              <View
                key={`space-${index}`}
                style={styles.spacing}
              />
            );
          }

          if (isHeading(line)) {
            return (
              <Text
                key={`${line}-${index}`}
                style={styles.sectionTitle}
              >
                {line}
              </Text>
            );
          }

          const isBullet = line.startsWith('•');

          return (
            <Text
              key={`${line}-${index}`}
              style={[
                styles.content,
                isBullet && styles.bullet,
              ]}
            >
              {line}
            </Text>
          );
        })}
      </View>

      <View style={styles.bottomMark}>
        <View style={styles.bottomLine} />

        <Ionicons
          name="leaf-outline"
          size={14}
          color={colors.orange}
        />

        <View style={styles.bottomLine} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 18,
    paddingBottom: 34,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(244, 124, 60, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: colors.textDark,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.4,
  },


  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitle: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 7,
  },

  content: {
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 22,
  },

  bullet: {
    paddingLeft: 4,
    lineHeight: 23,
  },

  spacing: {
    height: 9,
  },

  bottomMark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
    opacity: 0.6,
  },

  bottomLine: {
    width: 36,
    height: 1,
    backgroundColor: 'rgba(244, 124, 60, 0.35)',
  },
});