'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineStar } from 'react-icons/ai';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    image: string;
    specialty: string;
    qualifications: string[];
    rating: number;
    yearsOfExperience: number;
  };
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="p-3 hover:bg-neutral-50 transition-colors">
      <div className="flex items-start space-x-3">
        <Image
          src={doctor.image}
          alt={doctor.name}
          width={40}
          height={40}
          className="rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <Link href={`/doctors/${doctor.id}`}>
                <h3 className="font-semibold text-sm text-neutral-900 hover:underline truncate">
                  Dr. {doctor.name}
                </h3>
              </Link>
              <p className="text-xs text-pink-600 mt-0.5 truncate">{doctor.specialty}</p>
            </div>
            <div className="flex items-center text-xs text-neutral-600 whitespace-nowrap ml-2 flex-shrink-0">
              <AiOutlineStar className="w-3.5 h-3.5 text-yellow-400 mr-0.5" />
              {doctor.rating}
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {doctor.qualifications.slice(0, 2).map((qual, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 truncate max-w-[100px]"
                >
                  {qual}
                </span>
              ))}
              {doctor.qualifications.length > 2 && (
                <span className="text-xs text-neutral-500">+{doctor.qualifications.length - 2}</span>
              )}
            </div>
          </div>
          
          <p className="mt-1.5 text-xs text-neutral-600 truncate">
            {doctor.yearsOfExperience} years exp.
          </p>
        </div>
      </div>
    </div>
  );
}
