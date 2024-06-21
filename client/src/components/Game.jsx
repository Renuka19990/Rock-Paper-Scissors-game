// components/Game.js
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, Heading } from '@chakra-ui/react';

const Game = ({ opponentId, socket }) => {
  const [move, setMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [result, setResult] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('opponentMove', (move) => {
      console.log('Opponent Move:', move);
      setOpponentMove(move);
    });

    socket.on('gameResult', (result) => {
      console.log('Game Result:', result);
      setResult(result);
      setGameOver(true);
    });

    return () => {
      socket.off('opponentMove');
      socket.off('gameResult');
    };
  }, [socket]);

  const handleMove = (selectedMove) => {
    setMove(selectedMove);
    socket.emit('play', { move: selectedMove, opponentId });
  };

  const handlePlayAgain = () => {
    setMove(null);
    setOpponentMove(null);
    setResult('');
    setGameOver(false);
    socket.emit('playAgain', opponentId);
  };

  return (
    <Box
      mt={4}
      bg="whiteAlpha.900"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      w="full"
      maxW="sm"
      textAlign="center"
    >
      <Heading fontSize="2xl" color="teal.600" mb={4}>
        Game
      </Heading>
      {result && (
        <Text fontSize="lg" color="black" mb={4}>
          {result}
        </Text>
      )}
      {!gameOver && !result && (
        <VStack spacing={4} mt={4}>
          <Button onClick={() => handleMove('rock')} colorScheme="blue" size="lg" w="full">
            Rock
          </Button>
          <Button onClick={() => handleMove('paper')} colorScheme="green" size="lg" w="full">
            Paper
          </Button>
          <Button onClick={() => handleMove('scissors')} colorScheme="red" size="lg" w="full">
            Scissors
          </Button>
        </VStack>
      )}
      {gameOver && (
        <Box mt={4}>
          <Button onClick={handlePlayAgain} colorScheme="teal" size="lg" w="full">
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Game;
