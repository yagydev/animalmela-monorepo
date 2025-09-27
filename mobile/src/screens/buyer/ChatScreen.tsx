// src/screens/buyer/ChatScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ChatScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigation = useNavigation<ChatScreenNavigationProp>();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      participant: {
        name: 'Rajesh Kumar',
        avatar: 'person',
        isOnline: true,
      },
      lastMessage: 'The cattle is healthy and ready for sale',
      timestamp: '2 min ago',
      unreadCount: 2,
      listingTitle: 'High Quality Cattle #1',
    },
    {
      id: '2',
      participant: {
        name: 'Suresh Patel',
        avatar: 'person',
        isOnline: false,
      },
      lastMessage: 'Thank you for your interest',
      timestamp: '1 hour ago',
      unreadCount: 0,
      listingTitle: 'Premium Goat #2',
    },
    {
      id: '3',
      participant: {
        name: 'Amit Singh',
        avatar: 'person',
        isOnline: true,
      },
      lastMessage: 'Delivery will be arranged tomorrow',
      timestamp: '3 hours ago',
      unreadCount: 1,
      listingTitle: 'Healthy Sheep #3',
    },
  ];

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate('ChatDetail', { conversationId });
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Icon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationCard}
            onPress={() => handleConversationPress(conversation.id)}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name={conversation.participant.avatar} size={24} color="#9ca3af" />
              </View>
              {conversation.participant.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>

            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.participantName}>{conversation.participant.name}</Text>
                <Text style={styles.timestamp}>{conversation.timestamp}</Text>
              </View>
              
              <Text style={styles.listingTitle}>{conversation.listingTitle}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            </View>

            {conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredConversations.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="chat" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Conversations</Text>
            <Text style={styles.emptySubtitle}>
              Start chatting with sellers about livestock listings
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  newChatButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  listingTitle: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  unreadBadge: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatScreen;
