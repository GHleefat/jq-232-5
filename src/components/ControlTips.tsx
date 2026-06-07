import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlTipsProps {
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export function ControlTips({ onMove }: ControlTipsProps) {
  const handleClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    onMove?.(direction);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-green-100">
      <h3 className="text-lg font-bold text-green-800 mb-4 text-center">操作说明</h3>

      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-5">
        <div></div>
        <button
          onClick={() => handleClick('up')}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div></div>
        <button
          onClick={() => handleClick('left')}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleClick('down')}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleClick('right')}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span>
          草地：需要修剪
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-800 rounded-sm"></span>
          已修剪：深浅交替纹路
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-br from-pink-500 to-orange-400"></span>
          花坛：不可进入
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-700"></span>
          小路：不可进入
        </p>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        使用方向键或 WASD 控制割草机
      </p>
    </div>
  );
}
