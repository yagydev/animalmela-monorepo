import React from 'react';
import { Metadata } from 'next';
import WorkshopsPageClient from './WorkshopsPageClient';

export const metadata: Metadata = {
  title: 'Agricultural Workshops - Kisaanmela',
  description: 'Enhance your farming skills with our comprehensive training programs. Learn from experts and connect with fellow farmers.',
};

export default function WorkshopsPage() {
  return <WorkshopsPageClient />;
}