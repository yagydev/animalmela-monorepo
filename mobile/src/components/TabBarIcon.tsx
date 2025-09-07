import React from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';

interface TabBarIconProps {
  route: {
    name: string;
  };
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color, size }) => {
  let iconName: string;

  switch (route.name) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Services':
      iconName = 'pets';
      break;
    case 'Pets':
      iconName = 'favorite';
      break;
    case 'Profile':
      iconName = 'person';
      break;
    default:
      iconName = 'help';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

export default TabBarIcon;
