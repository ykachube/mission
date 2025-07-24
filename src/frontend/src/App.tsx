// src/frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Subtle CRT flicker animation
const flicker = keyframes`
  0% { opacity: 0.99; }
  25% { opacity: 1; }
  50% { opacity: 0.99; }
  75% { opacity: 0.995; }
  100% { opacity: 0.99; }
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
    background-color: var(--background-color);
    color: var(--text-color);
    font-family: 'Courier New', Courier, monospace;
    overflow: hidden;
  }
  
  /* Text glow effect */
  * {
    text-shadow: 0 0 5px var(--glow-color);
  }
`;

const AppContainer = styled.div`
  background-color: var(--background-color);
  height: 100vh;
  position: relative;
  animation: ${props => props.theme.effects.flicker ? 'flicker 3s infinite' : 'none'};
  
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
      var(--static-noise-color),
      var(--static-noise-color) 1px,
      transparent 1px,
      transparent 4px
    );
    pointer-events: none;
    display: ${props => props.theme.effects.staticNoise ? 'block' : 'none'};
  }
  
  /* Simplified animated scanline */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--scanline-color);
    animation: ${props => props.theme.effects.scanlines ? 'scanline 12s linear infinite' : 'none'};
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
  color: var(--text-color);
  text-shadow: 0 0 8px var(--glow-color), 0 0 15px var(--glow-color);
  
  /* Subtle header animation */
  animation: ${props => props.theme.effects.flicker && !props.theme.effects.glitches ? 'flicker 3s infinite' : 'none'};
  background: ${props => props.theme.effects.glitches ? 'rgba(255, 255, 255, 0.05)' : 'none'};
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border-top: 1px solid var(--glow-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  font-size: 14px;
  z-index: 100;
  font-family: 'Courier New', monospace;
  /* Completely remove flickering by eliminating animations */
  opacity: 1;
  background-color: ${props => props.theme.name === 'green' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.8)'};
`;

const StatusText = styled.span`
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleLabel = styled.span`
  color: var(--text-color);
  font-size: 12px;
`;

const ThemeToggle = styled.button<{ active: boolean }>`
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid var(--glow-color);
  border-radius: 3px;
  transition: all 0.2s ease-in-out;
  margin: 0 5px;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-color);
`;

const EffectToggle = styled.button<{ on: boolean }>`
  cursor: pointer;
  width: 36px;
  height: 18px;
  border-radius: 9px;
  padding: 2px;
  border: 1px solid var(--glow-color);
  background-color: transparent;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${props => props.on ? '20px' : '2px'};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.on ? 'var(--glow-color)' : 'var(--background-color)'};
    transition: all 0.2s ease-in-out;
  }
`;

// Main App component with theme provider
const AppContent: React.FC = () => {
  const { theme, toggleTheme, toggleEffect } = useTheme();
  
  return (
    <>
      <GlobalStyle />
      <AppContainer theme={theme}>
        <Header theme={theme}>MISSION CONTROL</Header>
        <Canvas />
        <Footer theme={theme}>
          <StatusText className="status-text">NETWORK STATUS: ACTIVE</StatusText>
          <ToggleGroup className="toggle-group">
            <ToggleLabel className="toggle-label">THEME:</ToggleLabel>
            <ThemeToggle 
              active={theme.name === 'green'} 
              onClick={toggleTheme}
              className="theme-toggle"
            >
              GREEN/VINTAGE
            </ThemeToggle>
            
            <ToggleLabel className="toggle-label">EFFECTS:</ToggleLabel>
            {(['flicker', 'scanlines', 'staticNoise', 'glitches'] as const).map(effect => (
              <ToggleGroup key={effect}>
                <ToggleLabel>{effect.toUpperCase()}</ToggleLabel>
                <EffectToggle 
                  on={theme.effects[effect]} 
                  onClick={() => toggleEffect(effect)}
                />
              </ToggleGroup>
            ))}
          </ToggleGroup>
        </Footer>
      </AppContainer>
    </>
  );
};

// Root App component that wraps everything with the ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export { App };