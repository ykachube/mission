// src/frontend/src/App.tsx
import React from 'react';
import Canvas from './components/Canvas';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Subtle CRT flicker animation
const flicker = keyframes`
  0% { opacity: 0.98; }
  25% { opacity: 1; }
  50% { opacity: 0.98; }
  75% { opacity: 0.99; }
  100% { opacity: 0.98; }
`;

// Slower scanline animation for better performance
const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

// Global styles for retro terminal look
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #0f0;
    font-family: 'Courier New', Courier, monospace;
    overflow: hidden;
  }
  
  /* Text glow effect */
  * {
    text-shadow: 0 0 5px #0f0;
  }
`;

const AppContainer = styled.div`
  background-color: #000;
  height: 100vh;
  position: relative;
  animation: ${flicker} 0.5s infinite;
  
  /* Simplified static noise effect */
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 0, 0.05),
      rgba(0, 255, 0, 0.05) 1px,
      transparent 1px,
      transparent 4px
    );
    pointer-events: none;
  }
  
  /* Simplified animated scanline */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 255, 0, 0.4);
    animation: ${scanline} 8s linear infinite;
    pointer-events: none;
    z-index: 5;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 24px;
  letter-spacing: 3px;
  text-transform: uppercase;
  z-index: 10;
  text-shadow: 0 0 8px #0f0, 0 0 15px #0f0;
  
  /* Subtle header animation */
  animation: ${flicker} 1s infinite;
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>MISSION CONTROL</Header>
        <Canvas />
      </AppContainer>
    </>
  );
};

export default App;