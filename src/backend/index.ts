// src/backend/index.ts
import express from 'express';
import { createServer } from 'http';
import { TCPChecker } from './services/tcpChecker';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Add CORS headers
app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Initialize TCP checker
const tcpChecker = new TCPChecker();

// Add some sample hosts for testing
tcpChecker.addHost('host1', 'google.com', 80, 'tcp', 10000, 3);
tcpChecker.addHost('host2', 'github.com', 443, 'tcp', 10000, 3);
tcpChecker.addHost('host4', 'github-fakeee.com', 443, 'tcp', 10000, 3); // Fixed: unique ID

// Add a UDP host as well
tcpChecker.addHost('host3', '8.8.8.8', 53, 'udp', 15000, 3);

// Start checking
tcpChecker.startChecking();

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API endpoints
app.get('/api/status', (req: any, res: any) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/hosts', (req: any, res: any) => {
  res.json(tcpChecker.getAllStatuses());
});

app.post('/api/hosts', (req: any, res: any) => {
  const { id, host, port, protocol, checkInterval, failureThreshold } = req.body;
  if (!id || !host || !port) {
    return res.status(400).json({ error: 'Missing id, host, or port' });
  }
  
  tcpChecker.addHost(
    id, 
    host, 
    port, 
    protocol || 'tcp', 
    checkInterval || 30000, 
    failureThreshold || 3
  );
  res.status(201).json({ message: 'Host added successfully' });
});

app.delete('/api/hosts/:id', (req: any, res: any) => {
  const { id } = req.params;
  tcpChecker.removeHost(id);
  res.json({ message: 'Host removed successfully' });
});

const server = createServer(app);
server.listen(port, () => {
  console.log(`Mission Control server running on http://localhost:${port}`);
});