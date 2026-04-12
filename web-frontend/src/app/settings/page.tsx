import { Metadata } from 'next';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
  title: 'Settings - Kisaanmela',
  description: 'Manage your Kisaanmela account settings, preferences, and privacy options.',
};

export default function SettingsPage() {
  return <SettingsClient />;
}
