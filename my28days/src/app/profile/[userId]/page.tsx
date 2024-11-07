import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ProfileContent from './ProfileContent';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const userId = params?.userId;
  
  if (!userId) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent userId={userId} />
    </Suspense>
  );
}
