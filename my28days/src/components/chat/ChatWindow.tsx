'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineMessage, AiOutlineSend, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex flex-col h-full">
        <div className="flex-1 bg-neutral-50 rounded-t-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src="/woman-avatar.svg"
              alt="AI Assistant"
              width={40}
              height={40}
              className="rounded-full bg-white"
            />
            <div>
              <h3 className="font-semibold text-neutral-900">AI Assistant</h3>
              <p className="text-xs text-neutral-500">Here to support you</p>
            </div>
          </div>

          <div className="h-[calc(100%-60px)] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start space-x-2.5">
                <Image
                  src="/woman-avatar.svg"
                  alt="AI Assistant"
                  width={32}
                  height={32}
                  className="rounded-full bg-white"
                />
                <div className="flex-1">
                  <div className="inline-block bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
                    <p className="text-sm text-neutral-900">
                      Hi! I'm your personal AI assistant. I'm here to support you on your journey through menopause. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-neutral-100 p-3 rounded-b-xl">
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
            <Image
              src="/woman-avatar.svg"
              alt="AI Assistant"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium">AI Assistant</span>
          </div>
          {isMobileCollapsed ? (
            <AiOutlineDown className="w-5 h-5 text-neutral-500" />
          ) : (
            <AiOutlineUp className="w-5 h-5 text-neutral-500" />
          )}
        </button>

        {!isMobileCollapsed && (
          <div className="border-t border-neutral-100">
            <div className="h-64 overflow-y-auto p-4 bg-neutral-50">
              <div className="space-y-4">
                <div className="flex items-start space-x-2.5">
                  <Image
                    src="/woman-avatar.svg"
                    alt="AI Assistant"
                    width={32}
                    height={32}
                    className="rounded-full bg-white"
                  />
                  <div className="flex-1">
                    <div className="inline-block bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
                      <p className="text-sm text-neutral-900">
                        Hi! I'm your personal AI assistant. I'm here to support you on your journey through menopause. How can I help you today?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-neutral-100">
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
