import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Catalog - Kisaanmela',
  description: 'Manage your product listings and upload your catalog to reach more customers.',
};

export default function UploadCatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Catalog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your product listings and upload your catalog to reach more customers.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Product Catalog Management</h2>
          <p className="text-gray-600 mb-6">
            Upload and manage your product catalog to showcase your offerings to potential buyers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Bulk Upload</h3>
              <p className="text-gray-600 text-sm mb-3">Upload multiple products at once</p>
              <p className="text-green-700 font-semibold">CSV/Excel support</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Image Management</h3>
              <p className="text-gray-600 text-sm mb-3">Upload product photos</p>
              <p className="text-blue-700 font-semibold">High-quality images</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Inventory Tracking</h3>
              <p className="text-gray-600 text-sm mb-3">Track stock levels</p>
              <p className="text-yellow-700 font-semibold">Real-time updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}