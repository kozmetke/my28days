import Image from 'next/image';
import Link from 'next/link';

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    image: string;
    bio?: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/profile/${user._id}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-pink-200 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={user.image}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            {user.bio && (
              <p className="text-sm text-gray-500 truncate">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
