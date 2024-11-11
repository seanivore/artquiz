import React, { useState } from 'react';
import { Palette, ArrowRight, RefreshCcw } from 'lucide-react';
import { questions } from './data/questions';
import { artStyles } from './data/artStyles';
import type { ArtStyle, Question } from './types';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ArtStyle | null>(null);

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [currentQuestion]: score };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, number>) => {
    const scores = Object.values(finalAnswers);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    let matchedStyle: ArtStyle;
    if (avgScore <= 2) {
      matchedStyle = artStyles.classical;
    } else if (avgScore <= 3) {
      matchedStyle = artStyles.renaissance;
    } else if (avgScore <= 4) {
      matchedStyle = artStyles.baroque;
    } else {
      matchedStyle = artStyles.romantic;
    }
    
    setResult(matchedStyle);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Palette className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">Historic Art Style Quiz</h1>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleAnswer(score)}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
                >
                  <span className="text-gray-700">{questions[currentQuestion].answers[score - 1]}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <img 
              src={result.imageUrl} 
              alt={result.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Art Style: {result.name}
            </h2>
            <p className="text-gray-600 mb-6">{result.description}</p>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Famous Artists:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {result.artists.map((artist) => (
                  <span key={artist} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {artist}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={resetQuiz}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <RefreshCcw className="w-5 h-5" />
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;