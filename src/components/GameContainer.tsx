import { useState } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import { GameCanvas } from "./GameCanvas";
import { ControlTips } from "./ControlTips";
import { StatusBar } from "./StatusBar";
import { CompletionPanel } from "./CompletionPanel";
import { YardEditor } from "./YardEditor";
import { Leaf, Pencil, RotateCcw } from "lucide-react";
import type { CustomGridConfig } from "../types/game";

export function GameContainer() {
  const [viewMode, setViewMode] = useState<"game" | "editor">("game");
  const [customConfig, setCustomConfig] = useState<
    CustomGridConfig | undefined
  >(undefined);
  const [gameKey, setGameKey] = useState(0);

  const {
    gameState,
    score,
    moveMower,
    resetGame,
    formattedTime,
    completionPercent,
  } = useGameLogic(customConfig);

  const handleStartGame = (config: CustomGridConfig) => {
    setCustomConfig(config);
    setGameKey((k) => k + 1);
    setViewMode("game");
  };

  const handleBackToEditor = () => {
    setViewMode("editor");
  };

  const handleDefaultGame = () => {
    setCustomConfig(undefined);
    setGameKey((k) => k + 1);
  };

  if (viewMode === "editor") {
    return (
      <YardEditor
        onStartGame={handleStartGame}
        onBack={() => setViewMode("game")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              快乐割草机
            </h1>
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-green-700/80 font-medium">
            推着割草机走出整齐纹路，享受修剪的极致舒适感 🌿
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-5">
          <button
            onClick={handleDefaultGame}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow border border-green-200 hover:bg-white transition-colors text-green-700 font-medium text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            默认地图
          </button>
          <button
            onClick={() => setViewMode("editor")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 px-4 py-2 rounded-full shadow text-white font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Pencil className="w-4 h-4" />
            院子编辑器
          </button>
        </div>

        <div className="mb-5" key={gameKey}>
          <StatusBar time={formattedTime} completion={completionPercent} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="flex-shrink-0">
            <GameCanvas gameState={gameState} />
          </div>

          <div className="w-full lg:w-64">
            <ControlTips onMove={moveMower} />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-green-700/60">
          💡 小提示：尽量保持直线行驶，少走回头路，可以获得更高的评分和成就哦！
        </div>
      </div>

      {gameState.completed && score && (
        <CompletionPanel
          score={score}
          onRestart={resetGame}
          onBackToEditor={customConfig ? handleBackToEditor : undefined}
        />
      )}
    </div>
  );
}
