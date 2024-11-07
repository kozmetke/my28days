'use client';

import { useState } from 'react';
import { AiOutlineSend, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex flex-col h-full">
        <div 
          className="flex-1 bg-neutral-50 rounded-t-xl relative overflow-hidden"
          style={{
            backgroundImage: 'url(/poi-knowledge-base-avatar.svg)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        >
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-white/80"></div>
          
          {/* Chat content */}
          <div className="relative h-full flex flex-col">
            <div className="p-4">
              <div>
                <h3 className="font-semibold text-neutral-900">POI Knowledge Base Assistant</h3>
                <p className="text-xs text-neutral-500">Here to support you</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
              <div className="space-y-4">
                <div className="flex items-start justify-end space-x-2.5">
                  <div className="max-w-[80%]">
                    <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-sm">
                      <p className="text-sm text-neutral-900">
                        Hi! I'm your personal POI knowledge base assistant. I'm here to support you on your journey through menopause. How can I help you today?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border-t border-neutral-100 p-3 rounded-b-xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) {
                // Handle message send
                setMessage('');
              }
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-sm bg-neutral-100 rounded-full placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 text-neutral-500 hover:text-pink-500 disabled:opacity-50 disabled:hover:text-neutral-500"
            >
              <AiOutlineSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="fixed md:hidden bottom-16 left-0 right-0 bg-white border-t border-neutral-100">
        <button
          onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
          className="flex items-center justify-between w-full px-4 py-3 text-neutral-900"
        >
          <div className="flex items-center space-x-3">
            <span className="font-medium">POI Knowledge Base Assistant</span>
          </div>
          {isMobileCollapsed ? (
            <AiOutlineDown className="w-5 h-5 text-neutral-500" />
          ) : (
            <AiOutlineUp className="w-5 h-5 text-neutral-500" />
          )}
        </button>

        {!isMobileCollapsed && (
          <div className="border-t border-neutral-100">
            <div 
              className="h-64 relative"
              style={{
                backgroundImage: 'url(/poi-knowledge-base-avatar.svg)',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-white/80"></div>
              
              {/* Chat content */}
              <div className="relative h-full overflow-y-auto p-4">
                <div className="flex flex-col-reverse">
                  <div className="space-y-4">
                    <div className="flex items-start justify-end space-x-2.5">
                      <div className="max-w-[80%]">
                        <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-sm">
                          <p className="text-sm text-neutral-900">
                            Hi! I'm your personal POI knowledge base assistant. I'm here to support you on your journey through menopause. How can I help you today?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/95 backdrop-blur-sm border-t border-neutral-100">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (message.trim()) {
                    // Handle message send
                    setMessage('');
                  }
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 text-sm bg-neutral-100 rounded-full placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 text-neutral-500 hover:text-pink-500 disabled:opacity-50 disabled:hover:text-neutral-500"
                >
                  <AiOutlineSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
