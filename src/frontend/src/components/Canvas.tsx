// src/frontend/components/Canvas.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group } from 'react-konva';

interface HostStatus {
  id: string;
  host: string;
  port: number;
  protocol: 'tcp' | 'udp';
  status: 'up' | 'down';
  lastChecked: string;
  consecutiveFailures: number;
  failureThreshold: number;
}

const Canvas: React.FC = () => {
  const [hosts, setHosts] = useState<HostStatus[]>([]);
  const animationRef = useRef<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  // Animation loop for smooth effects
  useEffect(() => {
    const animate = () => {
      setAnimationTime(Date.now());
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch initial host data
    fetch('/api/hosts')
      .then(res => res.json())
      .then(data => setHosts(data))
      .catch(err => console.error('Failed to fetch hosts:', err));

    // Set up polling for updates
    const interval = setInterval(() => {
      fetch('/api/hosts')
        .then(res => res.json())
        .then(data => setHosts(data))
        .catch(err => console.error('Failed to fetch hosts:', err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // LED component for host status with enhanced radar-like glow effect
  const LEDIndicator: React.FC<{ status: 'up' | 'down'; lastChecked: string }> = ({ status, lastChecked }) => {
    // Calculate fade based on time since last check
    const checkTime = new Date(lastChecked).getTime();
    const timeDiff = animationTime - checkTime;
    
    // Shorter fade time for more responsive effect (3 seconds)
    const maxFadeTime = 3000;
    const fade = Math.min(1, timeDiff / maxFadeTime);
    
    // Flash effect for very recent updates (first 300ms)
    const isFlashing = timeDiff < 300;
    const flashIntensity = isFlashing ? 1 - (timeDiff / 300) : 0;
    
    // Smooth pulse effect for recent updates (last 1 second)
    const pulseTime = Math.min(1, timeDiff / 1000);
    const pulseEffect = Math.max(0, Math.sin(pulseTime * Math.PI * 2) * (1 - pulseTime));
    
    // Calculate glow intensity with smoother transition
    const glowIntensity = Math.max(0.1, Math.pow(1 - fade, 2));
    
    // Define colors based on status
    const glowColor = status === 'up' ? '#00ff00' : '#ff0000';
    const shadowColor = glowColor;
    
    // Calculate the colors based on status and fade
    let fillColor, shadowBlur, shadowOpacity;
    
    if (isFlashing) {
      // During flash, make it almost white for both up and down states
      const brightness = Math.floor(200 + 55 * flashIntensity);
      fillColor = `rgba(${brightness}, ${brightness}, ${brightness}, 1)`;
      shadowBlur = 25 + 20 * flashIntensity;
      shadowOpacity = 0.9 * flashIntensity;
    } else if (status === 'up') {
      // Green for up hosts, fading to dark green
      const greenValue = Math.floor(50 + 205 * (1 - fade));
      fillColor = `rgba(0, ${greenValue}, 0, 1)`;
      shadowBlur = 20 * glowIntensity + 15 * pulseEffect;
      shadowOpacity = 0.8 * glowIntensity + 0.5 * pulseEffect;
    } else {
      // Red for down hosts, fading to dark red
      const redValue = Math.floor(50 + 205 * (1 - fade));
      fillColor = `rgba(${redValue}, 0, 0, 1)`;
      shadowBlur = 20 * glowIntensity + 15 * pulseEffect;
      shadowOpacity = 0.8 * glowIntensity + 0.5 * pulseEffect;
    }
    
    return (
      <Group>
        {/* Bright flash effect for initial impulse - almost white */}
        {isFlashing && (
          <>
            <Circle
              radius={30}
              fill="transparent"
              stroke="#ffffff"
              strokeWidth={4}
              opacity={0.8 * flashIntensity}
            />
            <Circle
              radius={40}
              fill="transparent"
              stroke={glowColor}
              strokeWidth={2}
              opacity={0.5 * flashIntensity}
            />
          </>
        )}
        {/* Outer glow ring for radar effect - only show for recent updates */}
        {timeDiff < 2000 && !isFlashing && (
          <Circle
            radius={15}
            fill="transparent"
            stroke={glowColor}
            strokeWidth={2 * glowIntensity}
            opacity={0.3 * glowIntensity}
          />
        )}
        {/* Main LED */}
        <Circle
          radius={8}
          fill={fillColor}
          shadowColor={shadowColor}
          shadowBlur={shadowBlur}
          shadowOpacity={shadowOpacity}
        />
        {/* Inner bright spot for more realistic LED */}
        <Circle
          radius={3}
          fill="#ffffff"
          x={-2}
          y={-2}
          opacity={isFlashing ? 0.9 * flashIntensity : (glowIntensity + 0.3 * flashIntensity)}
        />
      </Group>
    );
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {/* Vintage terminal background effects */}
        <Rect
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          fill="black"
        />
        
        {/* Simplified scanlines effect for better performance */}
        {Array.from({ length: Math.ceil(window.innerHeight / 6) }).map((_, i) => (
          <Rect
            key={i}
            x={0}
            y={i * 6}
            width={window.innerWidth}
            height={1}
            fill="rgba(0, 255, 0, 0.05)"
          />
        ))}
        
        {/* Individual hosts with LED indicators */}
        {hosts.map((host, index) => (
          <Group
            key={host.id}
            x={50}
            y={100 + index * 50}
            draggable
            onDragEnd={(e) => {
              // In a real implementation, we would update the host position
              console.log(`Host ${host.id} moved to:`, e.target.x(), e.target.y());
            }}
          >
            <Rect
              width={320}
              height={40}
              stroke="#00ff00"
              strokeWidth={1}
            />
            <Group x={20} y={20}>
              <LEDIndicator status={host.status} lastChecked={host.lastChecked} />
            </Group>
            <Text
              x={40}
              y={13}
              text={`${host.host}:${host.port} (${host.protocol.toUpperCase()})`}
              fill="#00ff00"
              fontSize={14}
            />
            <Text
              x={230}
              y={13}
              text={host.status === 'up' ? 'UP' : `DOWN (${host.consecutiveFailures}/${host.failureThreshold})`}
              fill={host.status === 'up' ? '#00ff00' : '#ff0000'}
              fontSize={14}
              fontStyle="bold"
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;