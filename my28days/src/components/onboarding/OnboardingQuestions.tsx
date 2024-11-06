'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    result: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What stage of menopause are you in?",
    options: [
      { text: "Pre-menopause", result: "Early awareness is key. Connect with others who are preparing for this journey." },
      { text: "Peri-menopause", result: "You're in transition. Our community can help you navigate the changes ahead." },
      { text: "Post-menopause", result: "Your experience is valuable. Share your journey and support others in our community." },
      { text: "Not sure", result: "Let's help you understand where you are in your journey." }
    ]
  },
  {
    id: 2,
    text: "What symptoms are you experiencing?",
    options: [
      { text: "Hot flashes & night sweats", result: "Temperature regulation issues affect 75% of women. Our community has tips to help." },
      { text: "Mood changes", result: "Emotional well-being is crucial. Connect with others who understand what you're going through." },
      { text: "Sleep issues", result: "Quality sleep is essential. Learn strategies from women who've found solutions." },
      { text: "Other symptoms", result: "Every experience is unique. Share yours and learn from others." }
    ]
  },
  {
    id: 3,
    text: "What kind of support are you looking for?",
    options: [
      { text: "Medical advice", result: "Connect with verified healthcare professionals specializing in menopause." },
      { text: "Peer support", result: "Join a supportive community of women sharing similar experiences." },
      { text: "Lifestyle tips", result: "Discover practical strategies for managing menopause symptoms." },
      { text: "All of the above", result: "Get comprehensive support from both experts and peers in our community." }
    ]
  }
];

export default function OnboardingQuestions({ onComplete }: { onComplete: (result: string) => void }) {
  const searchParams = useSearchParams();
  const savedResult = searchParams.get('result');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  useEffect(() => {
    if (savedResult) {
      onComplete(savedResult);
    }
  }, [savedResult, onComplete]);

  const handleAnswer = (result: string) => {
    const newAnswers = [...answers, result];
    setAnswers(newAnswers);
    setDirection('forward');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      onComplete(result);
    }
  };

  if (savedResult) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className={`transition-all duration-300 ease-in-out transform ${
        direction === 'forward' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900">
              {questions[currentQuestion].text}
            </h2>
            <div className="mt-2 flex items-center justify-center gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentQuestion
                      ? 'w-8 bg-pink-500'
                      : index < currentQuestion
                      ? 'w-4 bg-pink-200'
                      : 'w-4 bg-neutral-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.result)}
                className="group p-4 text-left border border-neutral-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-colors"
              >
                <span className="text-neutral-900 group-hover:text-pink-700 transition-colors">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
