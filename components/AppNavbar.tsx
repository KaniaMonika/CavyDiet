import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/styles';
import { useAuthStore } from '../store/authStore';
import AppMenu from './AppMenu';
import { useHerdStore } from '../store/herdStore';
import { Ionicons } from '@expo/vector-icons';

type MenuIconName = keyof typeof Ionicons.glyphMap;

export default function AppNavbar() {
  const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const resetHerd = useHerdStore((state) => state.resetHerd);

    const handleLogout = () => {
    logout();
    resetHerd();
    router.replace('/');
    };

    const menuItems = user
  ? [
      {
        label: 'Home',
        icon: 'home-outline' as MenuIconName,
        onPress: () => router.push('/home'),
      },
      {
        label: "Today's Feeding",
        icon: 'nutrition-outline' as MenuIconName,
        onPress: () => router.push('/feeding'),
      },
      {
        label: 'Your Herds',
        icon: 'home-outline' as MenuIconName,
        onPress: () => router.push('/herds'),
      },
      {
        label: 'Piggies',
        icon: 'paw-outline' as MenuIconName,
        onPress: () => router.push('/piggies'),
      },
      {
        label: 'Statistics',
        icon: 'stats-chart-outline' as MenuIconName,
        onPress: () => router.push('/statistics'),
      },
      {
        label: 'Add New Herd',
        icon: 'add-circle-outline' as MenuIconName,
        onPress: () => router.push('/herd-setup'),
      },
      {
        label: 'Settings',
        icon: 'settings-outline' as MenuIconName,
        onPress: () => router.push('/settings'),
      },
      {
        label: 'Logout',
        icon: 'log-out-outline' as MenuIconName,
        danger: true,
        onPress: handleLogout,
      },
    ]
  : [
      {
        label: 'About app',
        icon: 'information-circle-outline' as MenuIconName,
        onPress: () => router.push('/about'),
      },
      {
        label: 'Help',
        icon: 'help-circle-outline' as MenuIconName,
        onPress: () => router.push('/info/help'),
      },
    ];

  return (
    <View style={styles.navbar}>
        <View style={styles.leftSide}>
        <AppMenu
        items={menuItems}
        user={user}
        />

        <Pressable
            onPress={() => {
                if (user) {
                router.push('/home');
                } else {
                router.push('/');
                }
            }}
            >
            <Text style={styles.logo}>CavyDiet</Text>
            </Pressable>
        </View>

        <View style={styles.rightSide}>
        {user ? (
            <Text style={styles.username}>Hi {user.username}</Text>
        ) : (
            <View style={styles.authLinks}>
            <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.authText}>Login</Text>
            </Pressable>

            <Text style={styles.separator}>|</Text>

            <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.authText}>Register</Text>
            </Pressable>
            </View>
        )}
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
    width: '100%',
    height: 90,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 20,
    },

    leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    },

    logo: {
    color: colors.orange,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    },

    rightSide: {
    alignItems: 'flex-end',
    },

    authLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    },

    authText: {
    color: colors.orange,
    fontWeight: 'bold',
    fontSize: 13,
    },

    separator: {
    color: colors.orange,
    fontSize: 13,
    },

    username: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 13,
    },
});