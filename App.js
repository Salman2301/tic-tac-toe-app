import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

const TicTacToe = () => {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [theme, setTheme] = useState(themes[0]);

  const getStyle = (index) => {
    const style = [styles.square];
    if (index % 3 === 2) {
      style.push({ borderRightWidth: 0 });
    }
    if (Math.floor(index / 3) === 2) {
      style.push({ borderBottomWidth: 0 });
    }
    return style;
  };

  const handleMove = (index) => {
    if (board[index] || winner || isGameOver) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setScore((prevScore) => ({ ...prevScore, [winner]: prevScore[winner] + 1 }));
      setIsGameOver(true);
    } else if (newBoard.every((square) => square !== null)) {
      setIsGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const calculateWinner = (squares) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsGameOver(false);
  };

  const startNewGame = () => {
    resetGame();
    setModalVisible(false);
  };

  const changeTheme = () => {
    const nextThemeIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextThemeIndex]);
  };

  const renderSquare = (index) => (
    <TouchableOpacity style={getStyle(index)} onPress={() => handleMove(index)}>
      <Text style={[styles.squareText, { color: theme.squareTextColor }]}>{board[index]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.header, { color: theme.headerColor }]}>
        {winner ? `Winner: ${winner}` : isGameOver ? 'Game Over' : `Next Player: ${currentPlayer}`}
      </Text>
      <View style={styles.board}>
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: theme.scoreTextColor }]}>
          Score - Player X: {score.X} | Player O: {score.O}
        </Text>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.modalBackgroundColor }]}>
            <Text style={[styles.modalText, { color: theme.modalTextColor }]}>Choose Theme</Text>
            {themes.map((t, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.themeButton, { backgroundColor: t.backgroundColor }]}
                onPress={() => {
                  setTheme(t);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.themeButtonText}>{t.name}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <Button title="Reset Game" onPress={resetGame} />
        <Button title="New Game" onPress={startNewGame} />
        <Button title="Change Theme" onPress={changeTheme} />
      </View>
    </View>
  );
};

const themes = [
  {
    name: 'Theme 2',
    backgroundColor: '#282c34',
    headerColor: '#61dafb',
    squareTextColor: '#fff',
    scoreTextColor: '#fff',
    modalBackgroundColor: '#282c34',
    modalTextColor: '#61dafb',
  },
  {
    name: 'Theme 1',
    backgroundColor: '#f0f0f0',
    headerColor: '#333',
    squareTextColor: '#000',
    scoreTextColor: '#333',
    modalBackgroundColor: '#fff',
    modalTextColor: '#000',
  },
  // Add more themes as needed
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {},
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  squareText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 20,
  },
  scoreText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  themeButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  themeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default TicTacToe;
