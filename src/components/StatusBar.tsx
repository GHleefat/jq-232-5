import { Clock, Gauge } from 'lucide-react';

interface StatusBarProps {
  time: string;
  completion: number;
}

export function StatusBar({ time, completion }: StatusBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-green-100 flex gap-8 items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">用时</p>
          <p className="text-xl font-bold text-green-800 font-mono">{time}</p>
        </div>
      </div>

      <div className="w-px h-12 bg-green-100"></div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Gauge className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">完成度</p>
          <p className="text-xl font-bold text-green-800 font-mono">{completion}%</p>
        </div>
      </div>

      <div className="w-px h-12 bg-green-100"></div>

      <div className="w-40">
        <div className="h-3 bg-green-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
