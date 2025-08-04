"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 📄 src/routes/sessions.ts
const express_1 = __importDefault(require("express"));
const sessionController_1 = require("../controllers/sessionController");
// Import routes
const auth_1 = __importDefault(require("../routes/auth"));
const sessions_1 = __importDefault(require("../routes/sessions"));
const router = express_1.default.Router();
router.post('/start', sessionController_1.startSession);
router.post('/scan', sessionController_1.scanScreen);
router.post('/stop', sessionController_1.stopSession);
router.get('/summary/:technicianId', sessionController_1.getSessionSummary);
exports.default = router;
// 📄 src/server.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Test endpoint
app.get('/', (_, res) => {
    res.send('Technician API is running');
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/sessions', sessions_1.default);
const PORT = process.env.PORT || 5000;
// Connect to MongoDB and start server
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => console.error('MongoDB connection error:', err));
