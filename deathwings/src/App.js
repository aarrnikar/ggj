import React, { useState, useEffect, useRef } from 'react';

function App() {
  const grid = Array.from({ length: 10 }, () => Array(10).fill(0));
  
  const [gameOver, setGameOver] = useState(false);

  // Generate random initial position for the player
  const randomPosition = () => Math.floor(Math.random() * 10);
  const [playerPosition, setPlayerPosition] = useState({ x: randomPosition(), y: randomPosition() });

  let initialFoodPosition = { x: randomPosition(), y: randomPosition() };
  while (initialFoodPosition.x === playerPosition.x && initialFoodPosition.y === playerPosition.y) {
    initialFoodPosition = { x: randomPosition(), y: randomPosition() };
  }
  const [foodPosition, setFoodPosition] = useState(initialFoodPosition);

  // Initialize score
  const [score, setScore] = useState(0);

  const playerPositionRef = useRef(playerPosition);
  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);


  let initialEnemyPosition = { x: randomPosition(), y: randomPosition() };
  while (initialEnemyPosition.x === playerPosition.x && initialEnemyPosition.y === playerPosition.y) {
    initialEnemyPosition = { x: randomPosition(), y: randomPosition() };
  }
  const [enemyPosition, setEnemyPosition] = useState(initialEnemyPosition);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let newPosition = { ...playerPosition };
      switch(event.key) {
        case 'ArrowUp':
          newPosition.x = Math.max(playerPosition.x - 1, 0);
          break;
        case 'ArrowDown':
          newPosition.x = Math.min(playerPosition.x + 1, 9);
          break;
        case 'ArrowLeft':
          newPosition.y = Math.max(playerPosition.y - 1, 0);
          break;
        case 'ArrowRight':
          newPosition.y = Math.min(playerPosition.y + 1, 9);
          break;
        default:
          break;
      }

      // Check if the new position is the same as the food's position
      if (newPosition.x === foodPosition.x && newPosition.y === foodPosition.y) {
        setScore(score + 1); // Increment score

        // Generate new food position
        let newFoodPosition = { x: randomPosition(), y: randomPosition() };
        while (newFoodPosition.x === newPosition.x && newFoodPosition.y === newPosition.y) {
          newFoodPosition = { x: randomPosition(), y: randomPosition() };
        }
        setFoodPosition(newFoodPosition);
      }

      setPlayerPosition(newPosition);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, foodPosition, score]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyPosition(prev => {
        const dx = playerPositionRef.current.x - prev.x;
        const dy = playerPositionRef.current.y - prev.y;
        const newEnemyPosition = {
          x: prev.x + Math.sign(dx),
          y: prev.y + Math.sign(dy),
        };

        // Check if the new enemy position is the same as the player's position
        if (newEnemyPosition.x === playerPositionRef.current.x && newEnemyPosition.y === playerPositionRef.current.y) {
          setGameOver(true);
          clearInterval(interval);
        }

        return newEnemyPosition;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playerPositionRef]);


  if (gameOver) {
    return (
      <div>
        <h1>Game Over</h1>
        <p>Your final score is: {score}</p>
      </div>
    );
  }


  return (
    <div className="App">
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        padding: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        Score: {score}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: '1px',
        width: '700px',
        margin: '0 auto',
      }}>
        {grid.map((row, i) => row.map((cell, j) => (
          <div key={`${i}-${j}`} style={{
            backgroundColor: i === playerPosition.x && j === playerPosition.y ? 'black' : 
                            i === foodPosition.x && j === foodPosition.y ? 'red' :
                            i === enemyPosition.x && j === enemyPosition.y ? 'blue' : 'gray',                    
            height: '70px',
          }} />
        )))}
      </div>
    </div>
  );
}

export default App;