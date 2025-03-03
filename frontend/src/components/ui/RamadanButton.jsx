import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const RamadanButton = () => {
  return (
    <Link
      to="/ramadan"
      className="fixed bottom-16 right-4 p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
      aria-label="Ramadan Calendar"
    >
      <Calendar className="h-5 w-5" />
      <span className="text-sm">Ramadan Times</span>
    </Link>
  );
};

export default RamadanButton;