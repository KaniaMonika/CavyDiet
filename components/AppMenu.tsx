import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { colors } from '../constants/styles';
import { usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type MenuIconName = keyof typeof Ionicons.glyphMap;

type MenuUser = {
  username: string;
  email: string;
} | null;

type MenuItem = {
  label: string;
  icon: MenuIconName;
  danger?: boolean;
  onPress: () => void;
};

type AppMenuProps = {
  items: MenuItem[];
  user: MenuUser;
};

export default function AppMenu({
  items,
  user,
}: AppMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menuAnimation = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
  setOpen(true);

  Animated.timing(menuAnimation, {
    toValue: 1,
    duration: 180,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

const closeMenu = () => {
  Animated.timing(menuAnimation, {
    toValue: 0,
    duration: 140,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  }).start(() => {
    setOpen(false);
  });
};

  useEffect(() => {
  closeMenu();
}, [pathname]);

const animatedMenuStyle = {
  transform: [
    {
      translateX: menuAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-320, 0],
      }),
    },
  ],
};

  return (
  <View style={styles.wrapper}>
    <Pressable
      style={styles.menuButton}
      onPress={() => {
        if (open) {
          closeMenu();
        } else {
          openMenu();
        }
      }}
    >
      <Text style={styles.menuIcon}>☰</Text>
    </Pressable>

    <Modal
          visible={open}
          transparent
          animationType="none"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={closeMenu}
        >
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.drawer,
                animatedMenuStyle,
              ]}
            >
              <View style={styles.drawerHeader}>
                <View style={styles.avatarContainer}>
                  {/* Future user avatar */}
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons
                      name="person"
                      size={30}
                      color={colors.orange}
                    />
                  </View>
                </View>

                <View style={styles.headerContent}>
                  <Text style={styles.drawerLogo}>CavyDiet</Text>

                  {user ? (
                    <>
                      <Text style={styles.drawerUsername}>
                        {user.username}
                      </Text>

                      <Text
                        style={styles.drawerEmail}
                        numberOfLines={1}
                      >
                        {user.email}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.drawerSubtitle}>
                      Better care for your piggies
                    </Text>
                  )}
                </View>

                <Pressable
                  style={styles.closeButton}
                  onPress={closeMenu}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.textDark}
                  />
                </Pressable>
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItems}>
                {items.map((item) => (
                  <Pressable
                    key={item.label}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && styles.menuItemPressed,
                      item.danger && styles.dangerItem,
                    ]}
                    onPress={() => {
                      closeMenu();

                      setTimeout(() => {
                        item.onPress();
                      }, 140);
                    }}
                  >
                    <View
                      style={[
                        styles.menuItemIcon,
                        item.danger && styles.dangerIcon,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={
                          item.danger
                            ? '#D9534F'
                            : colors.orange
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.menuItemText,
                        item.danger && styles.dangerText,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {!item.danger && (
                      <Ionicons
                        name="chevron-forward"
                        size={19}
                        color={colors.orange}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            <Pressable
              style={styles.backdrop}
              onPress={closeMenu}
            />
          </View>
        </Modal>
  </View>
);
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 20,
  },

  menuButton: {
    padding: 6,
  },

  menuIcon: {
    color: colors.orange,
    fontSize: 28,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backdrop: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },

  drawer: {
    width: '75%',
    height: '90%',
    backgroundColor: colors.white,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 12,
  },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    marginRight: 14,
  },

  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
    marginLeft: 13,
  },

  drawerLogo: {
    color: colors.orange,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  drawerUsername: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
  },

  drawerEmail: {
    color: colors.textDark,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.6,
  },

  drawerSubtitle: {
    color: colors.textDark,
    fontSize: 12,
    marginTop: 5,
    opacity: 0.65,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: 20,
  },

  menuItems: {
    flex: 1,
    gap: 8,
  },

  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 17,
    paddingHorizontal: 12,
  },

  menuItemPressed: {
    backgroundColor: colors.background,
  },

  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuItemText: {
    flex: 1,
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 13,
  },

  dangerItem: {
    marginTop: 'auto',
    backgroundColor: '#FDEDEC',
  },

  dangerIcon: {
    backgroundColor: '#FADBD8',
  },

  dangerText: {
    color: '#D9534F',
  },
});