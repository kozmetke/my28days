'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Onboarding() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diagnosisDate: '',
    symptoms: [] as string[],
    treatments: [] as string[],
    bio: '',
    interests: [] as string[],
  });

  const commonSymptoms = [
    'Hot Flashes',
    'Night Sweats',
    'Irregular Periods',
    'Mood Changes',
    'Sleep Problems',
    'Vaginal Dryness',
    'Weight Gain',
    'Memory Issues',
  ];

  const commonTreatments = [
    'Hormone Therapy',
    'Natural Remedies',
    'Lifestyle Changes',
    'Diet Modifications',
    'Exercise Programs',
    'Meditation',
    'Counseling',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleTreatmentToggle = (treatment: string) => {
    setFormData(prev => ({
      ...prev,
      treatments: prev.treatments.includes(treatment)
        ? prev.treatments.filter(t => t !== treatment)
        : [...prev.treatments, treatment],
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          medicalInfo: {
            diagnosisDate: formData.diagnosisDate,
            symptoms: formData.symptoms,
            treatments: formData.treatments,
          },
          bio: formData.bio,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      router.push('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">When were you diagnosed?</h2>
            <input
              type="date"
              value={formData.diagnosisDate}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosisDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => setStep(2)}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700"
            >
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What symptoms are you experiencing?</h2>
            <div className="grid grid-cols-2 gap-4">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 rounded-md border ${
                    formData.symptoms.includes(symptom)
                      ? 'bg-pink-100 border-pink-500 text-pink-700'
                      : 'border-gray-300 hover:border-pink-500'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700"
            >
              Next
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What treatments are you using?</h2>
            <div className="grid grid-cols-2 gap-4">
              {commonTreatments.map((treatment) => (
                <button
                  key={treatment}
                  onClick={() => handleTreatmentToggle(treatment)}
                  className={`p-3 rounded-md border ${
                    formData.treatments.includes(treatment)
                      ? 'bg-pink-100 border-pink-500 text-pink-700'
                      : 'border-gray-300 hover:border-pink-500'
                  }`}
                >
                  {treatment}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(4)}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700"
            >
              Next
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tell us about yourself</h2>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Share your story and what you hope to find in this community..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? 'Completing Setup...' : 'Complete Setup'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-12 px-4">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="My28Days Logo"
            width={60}
            height={60}
            className="mx-auto"
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Welcome to My28Days</h1>
          <p className="mt-2 text-gray-600">Let's personalize your experience</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-1/4 h-2 rounded-full ${
                    stepNumber <= step ? 'bg-pink-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
}
