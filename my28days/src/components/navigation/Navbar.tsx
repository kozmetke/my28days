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
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-full transition-colors ${
                isActive 
                  ? 'font-semibold text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-neutral-900' : 'text-neutral-600'}`} />
              <span className="ml-4 text-[15px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative flex items-center px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-full mt-auto"
        >
          <div className="flex items-center">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || ''}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-neutral-200" />
            )}
            <span className="ml-4 text-[15px]">More</span>
          </div>

          {showMenu && (
            <div className="absolute bottom-full left-4 mb-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100">
              <div className="p-1">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  <AiOutlineLogout className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-around w-full h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative p-2"
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
            <div className="w-6 h-6 rounded-full bg-neutral-200" />
          )}

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100">
              <div className="p-1">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  <AiOutlineLogout className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  );
}
