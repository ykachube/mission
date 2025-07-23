// src/backend/services/tcpChecker.ts
import { createConnection } from 'net';
import { createSocket } from 'dgram';
import { EventEmitter } from 'events';
import { lookup } from 'dns';

export interface HostConfig {
  id: string;
  host: string;
  port: number;
  protocol: 'tcp' | 'udp';
  checkInterval: number;
  failureThreshold: number;
}

export interface HostStatus extends HostConfig {
  status: 'up' | 'down';
  lastChecked: Date;
  consecutiveFailures: number;
}

export class TCPChecker extends EventEmitter {
  private hosts: HostConfig[] = [];
  private statuses: Map<string, HostStatus> = new Map();
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();
  private defaultCheckInterval: number = 30000; // 30 seconds
  private defaultFailureThreshold: number = 3;

  addHost(
    id: string,
    host: string,
    port: number,
    protocol: 'tcp' | 'udp' = 'tcp',
    checkInterval: number = this.defaultCheckInterval,
    failureThreshold: number = this.defaultFailureThreshold
  ): void {
    const hostConfig: HostConfig = { id, host, port, protocol, checkInterval, failureThreshold };
    this.hosts.push(hostConfig);
    this.statuses.set(id, {
      ...hostConfig,
      status: 'down',
      lastChecked: new Date(0),
      consecutiveFailures: 0
    });
  }

  removeHost(id: string): void {
    this.hosts = this.hosts.filter(host => host.id !== id);
    this.statuses.delete(id);
    const intervalId = this.intervalIds.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervalIds.delete(id);
    }
  }

  startChecking(): void {
    // Clear any existing intervals
    this.intervalIds.forEach(intervalId => clearInterval(intervalId));
    this.intervalIds.clear();

    // Set up individual intervals for each host
    this.hosts.forEach(host => {
      const intervalId = setInterval(() => this.checkHostById(host.id), host.checkInterval);
      this.intervalIds.set(host.id, intervalId);
      // Initial check
      this.checkHostById(host.id);
    });
  }

  stopChecking(): void {
    this.intervalIds.forEach(intervalId => clearInterval(intervalId));
    this.intervalIds.clear();
  }

  getStatus(id: string): HostStatus | undefined {
    return this.statuses.get(id);
  }

  getAllStatuses(): HostStatus[] {
    return Array.from(this.statuses.values());
  }

  private async checkHostById(id: string): Promise<void> {
    const hostConfig = this.hosts.find(h => h.id === id);
    if (!hostConfig) return;

    try {
      const isUp = await this.checkHost(
        hostConfig.host,
        hostConfig.port,
        hostConfig.protocol
      );
      
      const status = this.statuses.get(id);
      if (status) {
        const newStatus = isUp ? 'up' : 'down';
        const consecutiveFailures = isUp ? 0 : status.consecutiveFailures + 1;
        const isMarkedDown = consecutiveFailures >= hostConfig.failureThreshold;
        const finalStatus = isMarkedDown ? 'down' : (isUp ? 'up' : status.status);
        
        this.statuses.set(id, {
          ...status,
          status: finalStatus,
          lastChecked: new Date(),
          consecutiveFailures
        });
        
        this.emit('statusChange', {
          ...status,
          status: finalStatus,
          lastChecked: new Date(),
          consecutiveFailures
        });
      }
    } catch (error) {
      // Update status to down in case of error
      const status = this.statuses.get(id);
      if (status) {
        const consecutiveFailures = status.consecutiveFailures + 1;
        const isMarkedDown = consecutiveFailures >= hostConfig.failureThreshold;
        const finalStatus = isMarkedDown ? 'down' : status.status;
        
        this.statuses.set(id, {
          ...status,
          status: finalStatus,
          lastChecked: new Date(),
          consecutiveFailures
        });
        
        this.emit('statusChange', {
          ...status,
          status: finalStatus,
          lastChecked: new Date(),
          consecutiveFailures
        });
      }
    }
  }

  private async checkHost(host: string, port: number, protocol: 'tcp' | 'udp'): Promise<boolean> {
    // First, resolve the hostname to make sure it exists
    try {
      await new Promise<void>((resolve, reject) => {
        lookup(host, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error: any) {
      // If DNS resolution fails, the host is definitely down
      return false;
    }

    if (protocol === 'tcp') {
      return new Promise((resolve) => {
        const socket = createConnection(port, host, () => {
          socket.end();
          resolve(true);
        });
        
        socket.on('error', (err: Error) => {
          resolve(false);
        });
        
        // Timeout after 5 seconds
        setTimeout(() => {
          socket.destroy();
          resolve(false);
        }, 5000);
      });
    } else { // UDP
      return new Promise((resolve) => {
        const socket = createSocket('udp4');
        let resolved = false;
        
        socket.on('error', (err: Error) => {
          if (!resolved) {
            resolved = true;
            socket.close();
            resolve(false);
          }
        });
        
        // For UDP, we'll try to send a packet and see if we get a response
        socket.on('message', () => {
          if (!resolved) {
            resolved = true;
            socket.close();
            resolve(true);
          }
        });
        
        socket.on('listening', () => {
          // Send a test packet
          const message = Buffer.from('test');
          socket.send(message, port, host, (err) => {
            if (err && !resolved) {
              resolved = true;
              socket.close();
              resolve(false);
            }
          });
        });
        
        try {
          socket.bind();
        } catch (error: any) {
          if (!resolved) {
            resolved = true;
            socket.close();
            resolve(false);
          }
        }
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            socket.close();
            resolve(false);
          }
        }, 5000);
      });
    }
  }
}