'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlinePlusCircle,
  AiOutlineHeart,
  AiOutlineUser,
  AiOutlineLogout
} from 'react-icons/ai';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  if (!session || pathname.startsWith('/auth') || pathname === '/onboarding') {
    return null;
  }

  const navItems = [
    { href: '/', icon: AiOutlineHome, label: 'Home' },
    { href: '/search', icon: AiOutlineSearch, label: 'Search' },
    { href: '/create', icon: AiOutlinePlusCircle, label: 'Create' },
    { href: '/notifications', icon: AiOutlineHeart, label: 'Notifications' },
    { href: `/profile/${session.user.id}`, icon: AiOutlineUser, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:top-0 md:border-b md:border-t-0">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:block">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="My28Days"
                width={40}
                height={40}
                className="w-auto h-8"
              />
            </Link>
          </div>

          <div className="flex items-center justify-around w-full md:justify-center md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1 md:hidden">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="relative p-2 text-gray-600 hover:text-pink-600"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200" />
              )}

              {showMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="p-2">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <AiOutlineLogout className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
