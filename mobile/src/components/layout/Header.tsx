import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'AnimalMela',
  showBackButton = false,
  showMenuButton = true,
  showNotifications = true,
  showProfile = true,
  onBackPress,
  onMenuPress,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: 'Home', icon: 'home', screen: 'Home' },
    { name: 'Services', icon: 'pets', screen: 'Services' },
    { name: 'Pets', icon: 'favorite', screen: 'Pets' },
    { name: 'Profile', icon: 'person', screen: 'Profile' },
    { name: 'About', icon: 'info', screen: 'About' },
    { name: 'Contact', icon: 'contact-support', screen: 'Contact' },
  ];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleNavigation = (screen: string) => {
    setIsMenuOpen(false);
    navigation.navigate(screen as never);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
              <Icon name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>A</Text>
              </View>
              <Text style={styles.logoTitle}>AnimalMela</Text>
            </View>
          )}
        </View>

        {/* Center Section */}
        {title && (
          <View style={styles.centerSection}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showNotifications && isAuthenticated && (
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications" size={24} color="#374151" />
            </TouchableOpacity>
          )}
          
          {showMenuButton && (
            <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
              <Icon name="menu" size={24} color="#374151" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={isMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Icon name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContent}>
              {/* User Info */}
              {isAuthenticated && user && (
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    {user.avatar ? (
                      <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                    ) : (
                      <Icon name="person" size={32} color="#9CA3AF" />
                    )}
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                </View>
              )}

              {/* Navigation Items */}
              <View style={styles.navigationSection}>
                {navigationItems.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.navigationItem}
                    onPress={() => handleNavigation(item.screen)}
                  >
                    <Icon name={item.icon} size={24} color="#374151" />
                    <Text style={styles.navigationText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* User Actions */}
              {isAuthenticated ? (
                <View style={styles.userActions}>
                  <TouchableOpacity style={styles.actionItem}>
                    <Icon name="favorite" size={24} color="#374151" />
                    <Text style={styles.actionText}>Favorites</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionItem}>
                    <Icon name="chat" size={24} color="#374151" />
                    <Text style={styles.actionText}>Messages</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionItem}>
                    <Icon name="settings" size={24} color="#374151" />
                    <Text style={styles.actionText}>Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                    <Icon name="logout" size={24} color="#EF4444" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.authActions}>
                  <TouchableOpacity
                    style={styles.authItem}
                    onPress={() => {
                      setIsMenuOpen(false);
                      navigation.navigate('Login' as never);
                    }}
                  >
                    <Text style={styles.authText}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.authItem, styles.signUpItem]}
                    onPress={() => {
                      setIsMenuOpen(false);
                      navigation.navigate('Register' as never);
                    }}
                  >
                    <Text style={styles.signUpText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  menuContent: {
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  navigationSection: {
    paddingVertical: 20,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navigationText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
  userActions: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 16,
  },
  authActions: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  authItem: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  signUpItem: {
    backgroundColor: '#3B82F6',
  },
  authText: {
    fontSize: 16,
    color: '#374151',
  },
  signUpText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Header;
