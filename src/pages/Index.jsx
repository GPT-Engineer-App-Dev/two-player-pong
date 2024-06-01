import React, { useEffect, useRef, useState } from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const paddleWidth = 10;
    const paddleHeight = 100;
    const ballSize = 10;

    let player1Y = canvas.height / 2 - paddleHeight / 2;
    let player2Y = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      context.fillStyle = "white";
      context.fillRect(10, player1Y, paddleWidth, paddleHeight);
      context.fillRect(canvas.width - 20, player2Y, paddleWidth, paddleHeight);

      // Draw ball
      context.fillRect(ballX, ballY, ballSize, ballSize);

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top and bottom walls
      if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
      }

      // Ball collision with paddles
      if (
        (ballX <= 20 && ballY >= player1Y && ballY <= player1Y + paddleHeight) ||
        (ballX + ballSize >= canvas.width - 20 && ballY >= player2Y && ballY <= player2Y + paddleHeight)
      ) {
        ballSpeedX = -ballSpeedX;
      }

      // Ball out of bounds
      if (ballX <= 0) {
        setPlayer2Score((prev) => prev + 1);
        resetBall();
      } else if (ballX + ballSize >= canvas.width) {
        setPlayer1Score((prev) => prev + 1);
        resetBall();
      }

      requestAnimationFrame(draw);
    };

    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
    };

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "w":
          player1Y = Math.max(player1Y - 20, 0);
          break;
        case "s":
          player1Y = Math.min(player1Y + 20, canvas.height - paddleHeight);
          break;
        case "ArrowUp":
          player2Y = Math.max(player2Y - 20, 0);
          break;
        case "ArrowDown":
          player2Y = Math.min(player2Y + 20, canvas.height - paddleHeight);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    draw();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bg="black">
      <VStack spacing={4} color="white">
        <Text fontSize="2xl">Pong Game</Text>
        <Text>Player 1 (W/S): {player1Score}</Text>
        <Text>Player 2 (Up/Down): {player2Score}</Text>
        <canvas ref={canvasRef} width="800" height="400" style={{ border: "1px solid white" }}></canvas>
      </VStack>
    </Box>
  );
};

export default Index;