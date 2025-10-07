import { useEffect, useState, useRef } from "react";
import {
  GameContainer,
  Score,
  Bottom,
} from "../components/common-styles/common-styles";
import Fish from "../components/fish/fish";
import Pipe from "../components/pipe/pipe";

import BottomThumbnail from "../assets/beach-sand.webp";
import jumpSoundFile from "../assets/bubble-pop.mp3";
import gameOverSoundFile from "../assets/game-over.mp3";

export default function GamePage() {
  const [fishPosition, setFishPosition] = useState(250);
  const [rotation, setRotation] = useState(0);
  const [pipes, setPipes] = useState([
    { left: window.innerWidth, gapTop: 200 },
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const gravity = 4;
  const jumpHeight = 70;
  const pipeSpeed = 4;
  const gap = 180;
  const pipeSpacing = 300;

  const jumpSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const audioUnlocked = useRef(false);

  useEffect(() => {
    jumpSoundRef.current = new Audio(jumpSoundFile);
    gameOverSoundRef.current = new Audio(gameOverSoundFile);
    jumpSoundRef.current.volume = 0.5;
    gameOverSoundRef.current.volume = 0.7;
  }, []);

  // Fish gravity
  useEffect(() => {
    if (!isGameStarted || gameOver) return; // pause if not started or over
    const interval = setInterval(() => {
      setFishPosition((pos) => {
        const newPos = pos + gravity;
        setRotation((r) => Math.min(r + 3, 25)); //tilt the fish

        if (newPos >= window.innerHeight * 0.8 - 30) {
          gameOverSoundRef.current.currentTime = 0;
          gameOverSoundRef.current.play();
          setTimeout(() => setGameOver(true), 100);
          return pos;
        }
        return newPos;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isGameStarted, gameOver]);

  // Pipe movement
  useEffect(() => {
    if (!isGameStarted || gameOver) return;
    const interval = setInterval(() => {
      setPipes((prevPipes) => {
        let updated = prevPipes
          .map((pipe) => ({ ...pipe, left: pipe.left - pipeSpeed }))
          .filter((pipe) => pipe.left > -80);

        const lastPipe = updated[updated.length - 1];
        if (lastPipe.left < window.innerWidth - pipeSpacing) {
          updated.push({
            left: window.innerWidth,
            gapTop: Math.random() * 200 + 100,
          });
        }
        return updated;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isGameStarted, gameOver]);

  // Collision + scoring
  useEffect(() => {
    if (!isGameStarted || gameOver) return;
    setPipes((prevPipes) => {
      const updated = [...prevPipes];
      const remToPx = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const pipeWidth = 5 * remToPx;
      const fishSize = 3 * remToPx;
      const fishLeft = 100;

      updated.forEach((pipe) => {
        const pipeLeft = pipe.left;
        const pipeRight = pipe.left + pipeWidth;

        const horizontalCollision =
          fishLeft + fishSize > pipeLeft && fishLeft < pipeRight;

        const verticalCollision =
          fishPosition < pipe.gapTop ||
          fishPosition + fishSize > pipe.gapTop + gap;

        if (horizontalCollision && verticalCollision) {
          gameOverSoundRef.current.currentTime = 0;
          gameOverSoundRef.current.play();
          setTimeout(() => setGameOver(true), 100);
        }

        if (!pipe.passed && pipeRight < fishLeft) {
          pipe.passed = true;
          setScore((s) => s + 1);
        }
      });

      return updated;
    });
  }, [pipes, fishPosition, isGameStarted, gameOver]);

  // Best score
  useEffect(() => {
    if (gameOver) {
      if (score > bestScore) {
        setBestScore(score);
        setIsNewBest(true);
        localStorage.setItem("bestScore", score);
      } else {
        setIsNewBest(false);
      }
    }
  }, [gameOver]);

  // Handle Jump or Start
  const handleJump = () => {
    if (!audioUnlocked.current) {
      jumpSoundRef.current?.play().catch(() => {});
      gameOverSoundRef.current?.play().catch(() => {});
      jumpSoundRef.current?.pause();
      gameOverSoundRef.current?.pause();
      audioUnlocked.current = true;
    }

    // If first tap, start the game
    if (!isGameStarted) {
      setIsGameStarted(true);
      return;
    }

    if (gameOver) {
      setFishPosition(250);
      setRotation(0);
      setPipes([{ left: window.innerWidth, gapTop: 200 }]);
      setScore(0);
      setGameOver(false);
      // game restarts immediately, no freeze needed
      return;
    }

    if (fishPosition > 0) {
      jumpSoundRef.current.currentTime = 0;
      jumpSoundRef.current.play();
      setFishPosition((pos) => Math.max(pos - jumpHeight, 0));
      setRotation(-25);
    }
  };

  return (
    <div className="wrapper" onClick={handleJump}>
      <GameContainer>
        <Score>
          Best: {bestScore} <br /> Score: {score}
        </Score>

        <Fish top={fishPosition} rotation={rotation} />

        {pipes.map((pipe, index) => (
          <Pipe key={index} left={pipe.left} gapTop={pipe.gapTop} gap={gap} />
        ))}

        {/* Show only before first play */}
        {!isGameStarted && !gameOver && (
          <div className="tap-to-play">
            <h2 style={{ color: "white" }}> Tap to Play</h2>
          </div>
        )}

        {/* Game Over UI */}
        {gameOver && (
          <div className="game-over">
            <h3>
              {isNewBest ? "🎉 New Best Score!" : "Your Score:"} {score}
            </h3>
            <h2 style={{ marginTop: "3rem", marginBottom: "1rem" }}>
              Game Over
            </h2>
            <p>Click anywhere to restart</p>
          </div>
        )}
      </GameContainer>

      <Bottom src={BottomThumbnail} alt="Bottom-thumbnail" />
    </div>
  );
}
