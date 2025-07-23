// src/frontend/components/Canvas.tsx
import React, { useState, useEffect } from 'react';
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

  // LED component for host status with fading effect
  const LEDIndicator: React.FC<{ status: 'up' | 'down'; lastChecked: string }> = ({ status, lastChecked }) => {
    // Calculate fade based on time since last check
    const checkTime = new Date(lastChecked).getTime();
    const now = Date.now();
    const timeDiff = now - checkTime;
    const maxFadeTime = 60000; // 1 minute to fully fade
    const fade = Math.min(1, timeDiff / maxFadeTime);
    
    const color = status === 'up' ? '#00ff00' : '#ff0000';
    const opacity = status === 'up' ? 1 - fade * 0.7 : 1 - fade * 0.5;
    
    return (
      <Circle
        radius={8}
        fill={color}
        shadowColor={color}
        shadowBlur={10}
        shadowOpacity={opacity * 0.8}
        opacity={opacity}
      />
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
        
        {/* Scanlines effect */}
        {Array.from({ length: Math.ceil(window.innerHeight / 4) }).map((_, i) => (
          <Rect
            key={i}
            x={0}
            y={i * 4}
            width={window.innerWidth}
            height={2}
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
            <Group x={10} y={15}>
              <LEDIndicator status={host.status} lastChecked={host.lastChecked} />
            </Group>
            <Text
              x={30}
              y={10}
              text={`${host.host}:${host.port} (${host.protocol.toUpperCase()})`}
              fill="#00ff00"
              fontSize={14}
              shadowColor="#00ff00"
              shadowBlur={3}
            />
            <Text
              x={220}
              y={10}
              text={host.status === 'up' ? 'UP' : `DOWN (${host.consecutiveFailures}/${host.failureThreshold})`}
              fill={host.status === 'up' ? '#00ff00' : '#ff0000'}
              fontSize={14}
              fontStyle="bold"
              shadowColor={host.status === 'up' ? '#00ff00' : '#ff0000'}
              shadowBlur={3}
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;