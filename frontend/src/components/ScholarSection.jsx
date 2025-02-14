import React, { useState } from 'react';
import { UserCircle, Star, Clock, Shield } from 'lucide-react';

// Dummy scholar data
const scholars = [
  {
    id: 1,
    name: "Dr. Ahmed Khan",
    expertise: ["Fiqh", "Hadith"],
    rating: 4.9,
    experience: "15 years",
    available: true,
    image: "/api/placeholder/64/64",
    bio: "Specialized in Islamic jurisprudence with focus on contemporary issues",
    qualifications: ["Al-Azhar University", "Islamic Studies PhD"]
  },
  {
    id: 2,
    name: "Shaykh Muhammad Ali",
    expertise: ["Quran", "Tafsir"],
    rating: 4.8,
    experience: "20 years",
    available: true,
    image: "/api/placeholder/64/64",
    bio: "Expert in Quranic sciences and contemporary interpretation",
    qualifications: ["Madinah University", "Quranic Studies"]
  },
  {
    id: 3,
    name: "Dr. Sarah Rahman",
    expertise: ["Family Law", "Women's Issues"],
    rating: 4.9,
    experience: "12 years",
    available: false,
    image: "/api/placeholder/64/64",
    bio: "Specialist in Islamic family law and women's rights in Islam",
    qualifications: ["International Islamic University", "Islamic Law PhD"]
  }
];

export const ScholarList = ({ onSelectScholar }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {scholars.map((scholar) => (
        <div key={scholar.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-start space-x-4">
            <img
              src={scholar.image}
              alt={scholar.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {scholar.name}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{scholar.rating}</span>
                <Clock className="w-4 h-4 ml-3 mr-1" />
                <span>{scholar.experience}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {scholar.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {scholar.bio}
          </p>
          <button
            onClick={() => onSelectScholar(scholar)}
            className={`mt-4 w-full py-2 px-4 rounded-md text-sm font-medium ${
              scholar.available
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!scholar.available}
          >
            {scholar.available ? 'Start Chat' : 'Currently Unavailable'}
          </button>
        </div>
      ))}
    </div>
  );
};

export const ScholarChat = ({ scholar, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: `You are now connected with ${scholar.name}. Please note that responses are currently simulated for demonstration purposes.`
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);

    // Simulate scholar response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'scholar',
        content: `Thank you for your question. As a scholar specializing in ${scholar.expertise.join(' and ')}, I would need to research this topic further to provide a comprehensive answer. Would you like me to explain the general principles related to your question?`,
        scholar: scholar.name
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <img
            src={scholar.image}
            alt={scholar.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {scholar.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {scholar.expertise.join(' • ')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xl rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : message.type === 'system'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default function ScholarSection() {
  const [selectedScholar, setSelectedScholar] = useState(null);

  return (
    <div className="h-full">
      {selectedScholar ? (
        <ScholarChat
          scholar={selectedScholar}
          onClose={() => setSelectedScholar(null)}
        />
      ) : (
        <ScholarList onSelectScholar={setSelectedScholar} />
      )}
    </div>
  );
}