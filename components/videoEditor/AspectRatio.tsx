import React from 'react';
import { LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";
import { FaRegSquare } from "react-icons/fa";

interface AspectRatioProps {
  onRatioChange: (ratio: string) => void;
  selectedRatio: string;
}

const AspectRatio: React.FC<AspectRatioProps> = ({ onRatioChange, selectedRatio }) => {
  return (
    <div className="flex justify-center gap-2 border-2 border-gray-400 shadow-lg w-52 px-2 py-1 rounded-full">
      <button
        className={`px-3 py-2 hover:bg-slate-400 text-neutral-600 hover:text-neutral-900 rounded-2xl ${
          selectedRatio === '16:9' ? 'bg-slate-400 text-neutral-900' : ''
        }`}
        onClick={() => onRatioChange('16:9')}
      >
        <LuRectangleHorizontal />
      </button>
      <button
        className={`px-3 py-2 hover:bg-slate-400 text-neutral-600 hover:text-neutral-900 rounded-2xl ${
          selectedRatio === '9:16' ? 'bg-slate-400 text-neutral-900' : ''
        }`}
        onClick={() => onRatioChange('9:16')}
      >
        <LuRectangleVertical />
      </button>
      <button
        className={`px-3 py-2 hover:bg-slate-400 text-neutral-600 hover:text-neutral-900 rounded-2xl ${
          selectedRatio === '1:1' ? 'bg-slate-400 text-neutral-900' : ''
        }`}
        onClick={() => onRatioChange('1:1')}
      >
        <FaRegSquare />
      </button>
    </div>
  );
};

export default AspectRatio;
