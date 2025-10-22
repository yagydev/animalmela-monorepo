import React from 'react';
import { Metadata } from 'next';
import SubsidyTrackingPageClient from './SubsidyTrackingPageClient';

export const metadata: Metadata = {
  title: 'My Subsidy Applications - Kisaanmela',
  description: 'Track the status of your government scheme applications and manage your documents.',
};

export default function SubsidyTrackingPage() {
  return <SubsidyTrackingPageClient />;
}
