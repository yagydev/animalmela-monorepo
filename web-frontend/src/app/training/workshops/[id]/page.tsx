import React from 'react';
import { Metadata } from 'next';
import WorkshopDetailPageClient from './WorkshopDetailPageClient';

export const metadata: Metadata = {
  title: 'Workshop Details - Kisaanmela',
  description: 'Learn sustainable farming practices, soil health management, and organic certification processes.',
};

export default function WorkshopDetailPage() {
  return <WorkshopDetailPageClient />;
}
