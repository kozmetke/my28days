"use client";

import { useState } from 'react';
import { db } from '@/lib/data';
import ValidationCard from './ValidationCard';
import type { ValidationConversation } from '@/types';

export default function ValidationContent() {
  const [conversations, setConversations] = useState<ValidationConversation[]>(
    db.getValidationConversations()
  );

  const handleStatusChange = (id: string, status: 'validated' | 'invalidated' | 'dismissed') => {
    db.updateValidationStatus(id, status);
    // Update local state to reflect the change
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv._id === id ? { ...conv, status } : conv
      )
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Validation Queue
      </h2>
      <div className="space-y-4">
        {conversations
          .filter(conv => conv.status === 'pending')
          .map(conversation => (
            <ValidationCard
              key={conversation._id}
              conversation={conversation}
              onStatusChange={handleStatusChange}
            />
          ))}
      </div>
    </div>
  );
}
