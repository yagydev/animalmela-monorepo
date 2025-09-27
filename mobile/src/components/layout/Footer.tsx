import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

interface FooterProps {
  showFullFooter?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showFullFooter = false }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Pet Sitting', action: () => {} },
      { name: 'Dog Walking', action: () => {} },
      { name: 'Pet Grooming', action: () => {} },
      { name: 'Pet Training', action: () => {} },
      { name: 'Veterinary Care', action: () => {} },
    ],
    company: [
      { name: 'About Us', action: () => {} },
      { name: 'How It Works', action: () => {} },
      { name: 'Safety & Trust', action: () => {} },
      { name: 'Careers', action: () => {} },
      { name: 'Press', action: () => {} },
    ],
    support: [
      { name: 'Help Center', action: () => {} },
      { name: 'Contact Us', action: () => {} },
      { name: 'Trust & Safety', action: () => {} },
      { name: 'Terms of Service', action: () => {} },
      { name: 'Privacy Policy', action: () => {} },
    ],
  };

  const features = [
    {
      icon: 'favorite',
      title: 'Trusted Care',
      description: 'Verified pet sitters and walkers with background checks',
    },
    {
      icon: 'chat',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for peace of mind',
    },
    {
      icon: 'security',
      title: 'Pet Insurance',
      description: 'Comprehensive insurance coverage for your pets',
    },
    {
      icon: 'star',
      title: 'Verified Reviews',
      description: 'Real reviews from real pet owners',
    },
  ];

  const handleEmailPress = () => {
    Linking.openURL('mailto:hello@animall.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+15551234567');
  };

  const handleLocationPress = () => {
    Linking.openURL('https://maps.google.com/?q=123+Pet+Street,+Pet+City,+PC+12345');
  };

  if (!showFullFooter) {
    return (
      <View style={styles.simpleFooter}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.logoTitle}>AnimalMela</Text>
        </View>
        <Text style={styles.copyright}>
          © {currentYear} AnimalMela. All rights reserved.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Footer Content */}
        <View style={styles.mainContent}>
          {/* Company Info */}
          <View style={styles.companyInfo}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>A</Text>
              </View>
              <Text style={styles.logoTitle}>AnimalMela</Text>
            </View>
            <Text style={styles.companyDescription}>
              Your pet's best friend. Find trusted pet care services in your area.
            </Text>
            
            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <TouchableOpacity style={styles.contactItem} onPress={handleLocationPress}>
                <Icon name="location-on" size={20} color="#9CA3AF" />
                <Text style={styles.contactText}>123 Pet Street, Pet City, PC 12345</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
                <Icon name="phone" size={20} color="#9CA3AF" />
                <Text style={styles.contactText}>+1 (555) 123-4567</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                <Icon name="email" size={20} color="#9CA3AF" />
                <Text style={styles.contactText}>hello@animall.com</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Links Sections */}
          <View style={styles.linksContainer}>
            {/* Services */}
            <View style={styles.linksSection}>
              <Text style={styles.linksTitle}>Services</Text>
              {footerLinks.services.map((link) => (
                <TouchableOpacity key={link.name} style={styles.linkItem} onPress={link.action}>
                  <Text style={styles.linkText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Company */}
            <View style={styles.linksSection}>
              <Text style={styles.linksTitle}>Company</Text>
              {footerLinks.company.map((link) => (
                <TouchableOpacity key={link.name} style={styles.linkItem} onPress={link.action}>
                  <Text style={styles.linkText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Support */}
            <View style={styles.linksSection}>
              <Text style={styles.linksTitle}>Support</Text>
              {footerLinks.support.map((link) => (
                <TouchableOpacity key={link.name} style={styles.linkItem} onPress={link.action}>
                  <Text style={styles.linkText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Why Choose AnimalMela?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <Icon name={feature.icon} size={24} color="#3B82F6" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Newsletter Signup */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Stay Updated</Text>
          <Text style={styles.newsletterSubtitle}>
            Get the latest pet care tips and updates from AnimalMela
          </Text>
          <View style={styles.newsletterForm}>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeButtonText}>Subscribe to Newsletter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Footer */}
        <View style={styles.bottomFooter}>
          <Text style={styles.copyright}>
            © {currentYear} AnimalMela. All rights reserved.
          </Text>
          
          {/* Social Links */}
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialLink}>
              <Icon name="facebook" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Icon name="twitter" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Icon name="instagram" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Icon name="linkedin" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  simpleFooter: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  companyInfo: {
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  companyDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
    lineHeight: 24,
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 12,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  linksSection: {
    flex: 1,
  },
  linksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  linkItem: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  featuresSection: {
    paddingVertical: 32,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  newsletterSection: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  newsletterSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  newsletterForm: {
    width: '100%',
  },
  subscribeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  copyright: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialLink: {
    padding: 4,
  },
});

export default Footer;
