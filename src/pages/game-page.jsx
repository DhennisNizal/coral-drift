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
  const [pipes, setPipes] = useState([
    { left: window.innerWidth, gapTop: 200 },
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const gravity = 4;
  const jumpHeight = 70;
  const pipeSpeed = 4;
  const gap = 180;
  const pipeSpacing = 300;

  // Audio Refs
  const jumpSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const audioUnlocked = useRef(false);

  // Initialize Sounds
  useEffect(() => {
    jumpSoundRef.current = new Audio(jumpSoundFile);
    gameOverSoundRef.current = new Audio(gameOverSoundFile);

    jumpSoundRef.current.volume = 0.5;
    gameOverSoundRef.current.volume = 0.7;
  }, []);

  // Fish Gravity
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setFishPosition((pos) => {
          const newPos = pos + gravity;

          // Hit the ground
          if (newPos >= window.innerHeight * 0.8 - 30) {
            if (gameOverSoundRef.current) {
              gameOverSoundRef.current.currentTime = 0;
              gameOverSoundRef.current.play();
            }
            setTimeout(() => setGameOver(true), 100);
            return pos;
          }

          return newPos;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  // Pipe Movement
  useEffect(() => {
    if (!gameOver) {
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
    }
  }, [gameOver]);

  // Collision + Scoring
  useEffect(() => {
    if (!gameOver) {
      setPipes((prevPipes) => {
        const updated = [...prevPipes];

        // Convert rem values to px dynamically for accurate hitboxes
        const remToPx = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );
        const pipeWidth = 5 * remToPx; // 5rem pipe width
        const fishSize = 3 * remToPx; // 3rem fish size
        const fishLeft = 100; // Fixed horizontal position of the fish

        updated.forEach((pipe) => {
          const pipeLeft = pipe.left;
          const pipeRight = pipe.left + pipeWidth;

          // Collision logic
          const horizontalCollision =
            fishLeft + fishSize > pipeLeft && fishLeft < pipeRight;

          const verticalCollision =
            fishPosition < pipe.gapTop ||
            fishPosition + fishSize > pipe.gapTop + gap;

          if (horizontalCollision && verticalCollision) {
            if (gameOverSoundRef.current) {
              gameOverSoundRef.current.currentTime = 0;
              gameOverSoundRef.current.play();
            }
            setTimeout(() => setGameOver(true), 100);
          }

          // Scoring logic
          if (!pipe.passed && pipeRight < fishLeft) {
            pipe.passed = true;
            setScore((s) => s + 1);
          }
        });

        return updated;
      });
    }
  }, [pipes, fishPosition, gameOver]);

  // Save Best Score
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

  // Jump / Restart
  const handleJump = () => {
    // Unlock audio on first click (required for mobile)
    if (!audioUnlocked.current) {
      jumpSoundRef.current?.play().catch(() => {});
      gameOverSoundRef.current?.play().catch(() => {});
      jumpSoundRef.current?.pause();
      gameOverSoundRef.current?.pause();
      audioUnlocked.current = true;
    }

    if (gameOver) {
      setFishPosition(250);
      setPipes([{ left: window.innerWidth, gapTop: 200 }]);
      setScore(0);
      setGameOver(false);
    } else if (fishPosition > 0) {
      if (jumpSoundRef.current) {
        jumpSoundRef.current.currentTime = 0;
        jumpSoundRef.current.play();
      }
      setFishPosition((pos) => pos - jumpHeight);
    }
  };

  //Render game Ui
  return (
    <div className="wrapper" onClick={handleJump}>
      <GameContainer>
        <Score>
          Best: {bestScore} <br />
          Score: {score}
        </Score>

        <Fish top={fishPosition} />
        {pipes.map((pipe, index) => (
          <Pipe key={index} left={pipe.left} gapTop={pipe.gapTop} gap={gap} />
        ))}

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
