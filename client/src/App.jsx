// App.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Box, Button, Input, VStack, Heading, HStack, Text, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import GameLobby from './components/GameLobby';
import Game from './components/Game';
import Leaderboard from './components/LeaderBoard';
import WaitingList from './components/WaitingList';

const socket = io('https://rock-paper-scissors-game-amlu.onrender.com');

const App = () => {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [opponentId, setOpponentId] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.200, blue.500, blue.800)",
    "linear(to-r, gray.800, gray.900)"
  );

  useEffect(() => {
    socket.on('updatePlayers', (players) => {
      setPlayers(players);
    });

    socket.on('gameStarted', (opponentId) => {
      setOpponentId(opponentId);
      setWaiting(false);
    });

    socket.on('opponentDisconnected', () => {
      setOpponentId(null);
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('gameStarted');
      socket.off('opponentDisconnected');
    };
  }, []);

  const handleLogin = () => {
    socket.emit('join', username);
    setLoggedIn(true);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={bgGradient}
      p={4}
    >
      <Flex direction="column" align="center" bg="whiteAlpha.800" p={8} borderRadius="lg" boxShadow="lg">
        <Button onClick={toggleColorMode} alignSelf="flex-end" mb={4}>
          {colorMode === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
        <Heading color="teal.600" mb={6}>Rock-Paper-Scissors</Heading>
        {!loggedIn ? (
          <VStack spacing={4}>
            <Text fontSize="lg" color="black.600">Login to Game</Text>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              w="300px"
              focusBorderColor="teal.400"
            />
            <Button onClick={handleLogin} colorScheme="teal" w="300px">
              Login
            </Button>
          </VStack>
        ) : (
          <Flex direction="column" align="center" w="full">
            <Flex w="full" justify="space-around" wrap="wrap" mb={4}>
              <GameLobby players={players} socket={socket} setWaiting={setWaiting} />
              <Game opponentId={opponentId} socket={socket} />
              <Leaderboard players={players} />
            </Flex>
            {waiting && <WaitingList />}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default App;
