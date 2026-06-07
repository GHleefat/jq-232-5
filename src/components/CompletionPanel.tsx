import { Trophy, Clock, CheckCircle2, Ruler, RefreshCw, Sparkles, Zap, Repeat2, Award, Lock } from 'lucide-react';
import type { ScoreResult } from '../types/game';

interface CompletionPanelProps {
  score: ScoreResult;
  onRestart: () => void;
  onBackToEditor?: () => void;
}

export function CompletionPanel({ score, onRestart, onBackToEditor }: CompletionPanelProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S':
        return 'from-yellow-400 via-amber-400 to-orange-500';
      case 'A':
        return 'from-green-400 via-emerald-500 to-teal-600';
      case 'B':
        return 'from-blue-400 via-cyan-500 to-sky-600';
      case 'C':
        return 'from-purple-400 via-violet-500 to-indigo-600';
      default:
        return 'from-gray-400 via-slate-500 to-zinc-600';
    }
  };

  const unlockedAchievements = score.achievements.filter((a) => a.unlocked);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn overflow-y-auto py-6">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl transform animate-scaleIn my-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">修剪完成！</h2>
          <p className="text-gray-500">院子焕然一新 🌿</p>
        </div>

        <div className="flex flex-col items-center mb-5">
          <div
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getGradeColor(score.grade)} flex items-center justify-center shadow-xl mb-3`}
          >
            <span className="text-5xl font-black text-white drop-shadow-lg">
              {score.grade}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full border border-amber-200">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-amber-800 font-bold">{score.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-5">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Clock className="w-4 h-4 text-green-700" />
            </div>
            <p className="text-[10px] text-gray-500 mb-0.5">用时</p>
            <p className="text-sm font-bold text-green-800">{score.time}s</p>
          </div>

          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
            </div>
            <p className="text-[10px] text-gray-500 mb-0.5">完成度</p>
            <p className="text-sm font-bold text-green-800">{score.completion}%</p>
          </div>

          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Ruler className="w-4 h-4 text-green-700" />
            </div>
            <p className="text-[10px] text-gray-500 mb-0.5">整齐度</p>
            <p className="text-sm font-bold text-green-800">{score.neatness}%</p>
          </div>

          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Zap className="w-4 h-4 text-green-700" />
            </div>
            <p className="text-[10px] text-gray-500 mb-0.5">效率</p>
            <p className="text-sm font-bold text-green-800">{score.efficiency}%</p>
          </div>

          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Repeat2 className="w-4 h-4 text-green-700" />
            </div>
            <p className="text-[10px] text-gray-500 mb-0.5">重叠率</p>
            <p className="text-sm font-bold text-green-800">{score.pathOverlap}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <span className="text-white font-medium">综合评分</span>
          </div>
          <span className="text-3xl font-black text-white">{score.total}</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-700">成就解锁</p>
            <p className="text-xs text-gray-500">
              {unlockedAchievements.length} / {score.achievements.length}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {score.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-xl p-2 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border border-amber-200'
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
                title={achievement.description}
              >
                <div className="text-2xl mb-1">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <p
                  className={`text-[10px] font-bold leading-tight ${
                    achievement.unlocked ? 'text-amber-800' : 'text-gray-400'
                  }`}
                >
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {onBackToEditor && (
            <button
              onClick={onBackToEditor}
              className="flex-1 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              返回编辑器
            </button>
          )}
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            再来一次
          </button>
        </div>
      </div>
    </div>
  );
}
