'use client';

import React, { useState } from 'react';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CursorPromptProps {
  className?: string;
}

export default function CursorPrompt({ className = '' }: CursorPromptProps) {
  const [isOpen, setIsOpen] = useState(false);

  const instructions = [
    {
      icon: '🖼️',
      title: 'Image Interaction',
      description: 'Move cursor over images to see zoom cursor. Click to view full size.'
    },
    {
      icon: '📝',
      title: 'Edit Entries',
      description: 'Click "Edit" button to modify farmer details, products, and images.'
    },
    {
      icon: '🗑️',
      title: 'Delete Entries',
      description: 'Click "Delete" button to remove farmers and their associated data.'
    },
    {
      icon: '📤',
      title: 'Image Upload',
      description: 'Drag and drop images or click to browse. Preview before uploading.'
    },
    {
      icon: '👁️',
      title: 'Image Preview',
      description: 'Hover over image thumbnails to see action buttons (view, delete).'
    },
    {
      icon: '✅',
      title: 'Save Changes',
      description: 'Always click "Save" after making changes to persist your updates.'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title={isOpen ? 'Hide instructions' : 'Show instructions'}
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      {/* Prompt Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              💡 Help & Instructions
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Instructions List */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-2xl">{instruction.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {instruction.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {instruction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Click the help button again to hide these instructions
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
