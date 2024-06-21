// components/GameLobby.js
/* eslint-disable react/prop-types */
import { Box, Button, Text, VStack, Heading, HStack, Divider } from '@chakra-ui/react';

const GameLobby = ({ players = [], socket, setWaiting }) => {
  const handleStartGame = (opponentId) => {
    socket.emit('startGame', opponentId);
    setWaiting(true);
  };

  return (
    <Box
      bg="whiteAlpha.900"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      w="full"
      maxW="md"
      textAlign="center"
    >
      <Heading fontSize="2xl" color="teal.600" mb={6}>
        Game Lobby
      </Heading>
      <VStack spacing={6}>
        {players.map((player) => (
          <HStack
            key={player.id}
            p={4}
            bg="gray.100"
            borderRadius="md"
            w="full"
            justifyContent="space-between"
          >
            <Text fontSize="lg" fontWeight="medium">
              {player.username}
            </Text>
            <Button onClick={() => handleStartGame(player.id)} colorScheme="teal" size="sm">
              Play
            </Button>
          </HStack>
        ))}
        {players.length === 0 && (
          <Text fontSize="lg" color="gray.500">
            No players available
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default GameLobby;
