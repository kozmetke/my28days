"use client";

import { useState } from 'react';
import { ValidationConversation } from '@/types';

interface ValidationCardProps {
  conversation: ValidationConversation;
  onStatusChange: (id: string, status: 'validated' | 'invalidated' | 'dismissed') => void;
}

export default function ValidationCard({ conversation, onStatusChange }: ValidationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      {/* Card Header - Always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-800">{conversation.subject}</h3>
        <p className="text-gray-600 mt-1">{conversation.summary}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-600 ml-1">{conversation.starScore.toFixed(1)}</span>
          </div>
          <span className="text-gray-400 ml-2">
            {new Date(conversation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Conversation */}
          <div className="p-4 bg-gray-50">
            {conversation.fullConversation.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.role === 'doctor'
                    ? 'ml-4'
                    : 'mr-4'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'doctor'
                      ? 'bg-blue-100 ml-auto'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-gray-800">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-white border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={() => onStatusChange(conversation._id, 'validated')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Validate
            </button>
            <button
              onClick={() => onStatusChange(conversation._id, 'invalidated')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Invalidate
            </button>
            <button
              onClick={() => onStatusChange(conversation._id, 'dismissed')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
