import React from 'react';
import { Metadata } from 'next';
import ProgressPageClient from './ProgressPageClient';

export const metadata: Metadata = {
  title: 'My Learning Progress - Kisaanmela',
  description: 'Track your agricultural technology learning journey and celebrate your achievements.',
};

export default function ProgressPage() {
  return <ProgressPageClient />;
}
