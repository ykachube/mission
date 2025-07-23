# Mission Control - Network Monitoring Dashboard

![Mission Control Dashboard](public/logo192.png)

A retro-styled, real-time network monitoring dashboard with interactive visualizations. Monitor TCP/UDP hosts with a vintage terminal aesthetic featuring glowing LED indicators, scanlines, and authentic CRT effects.

## Features

- **Real-Time Host Monitoring**: Continuously checks TCP/UDP hosts for availability
- **Retro Terminal UI**: Authentic vintage computer terminal aesthetics with glowing green text
- **Visual Status Indicators**: LED indicators with radar-like pulse effects on status updates
- **Drag-and-Drop Interface**: Rearrange host boxes for custom dashboard layouts
- **Configurable Checks**: Set custom check intervals and failure thresholds
- **Protocol Support**: Monitor both TCP and UDP services

## Screenshots

![Dashboard Preview](public/screenshot.png)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mission-control.git
   cd mission-control
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd src/frontend
   npm install
   cd ../..
   ```

### Running the Application

#### Using Node.js directly

1. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will be available at `http://localhost:3000`

2. In a separate terminal, start the frontend:
   ```bash
   cd src/frontend
   npm start
   ```
   The dashboard will open in your browser at `http://localhost:3001`

#### Using Docker

1. Build and run with Docker:
   ```bash
   docker-compose up --build
   ```
   The application will be available at `http://localhost:3000`

### Building for Production

1. Build the backend:
   ```bash
   npm run build
   ```

2. Build the frontend:
   ```bash
   cd src/frontend
   npm run build
   ```

## API Endpoints

- `GET /api/status` - Server status check
- `GET /api/hosts` - Get all monitored hosts and their statuses
- `POST /api/hosts` - Add a new host to monitor
- `DELETE /api/hosts/:id` - Remove a host from monitoring

## Project Structure

```
mission-control/
├── src/
│   ├── backend/
│   │   ├── index.ts         # Main server entry point
│   │   ├── api/             # API route handlers
│   │   └── services/
│   │       ├── tcpChecker.ts # Host monitoring service
│   │       └── database.ts   # Database service (planned)
│   └── frontend/
│       ├── src/
│       │   ├── App.tsx       # Main application component
│       │   ├── components/
│       │   │   └── Canvas.tsx # Host visualization canvas
│       │   └── ...
│       └── ...
├── package.json             # Backend dependencies
└── README.md
```

## Configuration

You can configure the initial hosts to monitor by modifying the `src/backend/index.ts` file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Konva for canvas-based visualizations
- Styled Components for CSS-in-JS styling
- Express for the backend API