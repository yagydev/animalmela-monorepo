import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FeaturesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const features: Feature[] = [
    {
      icon: 'favorite',
      title: 'Trusted Pet Care',
      description: 'Verified pet sitters and walkers with background checks and insurance coverage.',
      color: '#EF4444',
    },
    {
      icon: 'location-on',
      title: 'Local Services',
      description: 'Find pet care services in your neighborhood with real-time availability.',
      color: '#3B82F6',
    },
    {
      icon: 'schedule',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for peace of mind.',
      color: '#10B981',
    },
    {
      icon: 'star',
      title: 'Verified Reviews',
      description: 'Real reviews from real pet owners to help you make the best choice.',
      color: '#F59E0B',
    },
    {
      icon: 'security',
      title: 'Pet Insurance',
      description: 'Comprehensive insurance coverage for your pets during their care.',
      color: '#8B5CF6',
    },
    {
      icon: 'chat',
      title: 'Real-time Updates',
      description: 'Stay connected with photo updates and messages from your pet sitter.',
      color: '#6366F1',
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Why Choose Animall?</Text>
          <Text style={styles.subtitle}>
            We're committed to providing the best pet care experience with safety, 
            reliability, and love at the heart of everything we do.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animatable.View
              key={feature.title}
              animation={isVisible ? 'fadeInUp' : undefined}
              delay={index * 100}
              style={styles.featureCard}
            >
              <View style={styles.iconContainer}>
                <Icon name={feature.icon} size={32} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Animatable.View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Experience the Difference?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of pet owners who have discovered the peace of mind that comes with trusted, 
              professional pet care services.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.ctaPrimaryButton}>
                <Text style={styles.ctaPrimaryButtonText}>Find Services Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctaSecondaryButton}>
                <Text style={styles.ctaSecondaryButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.9,
  },
  featuresGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  ctaCard: {
    backgroundColor: '#EFF6FF',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: width * 0.8,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ctaPrimaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSecondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaSecondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeaturesSection;
