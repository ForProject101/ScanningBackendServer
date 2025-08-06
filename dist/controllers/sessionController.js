"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionSummary = exports.stopSession = exports.scanScreen = exports.startSession = void 0;
const TaskSession_1 = __importDefault(require("../models/TaskSession")); // ✅ Correct path
const startSession = async (req, res) => {
    const { technicianId } = req.body;
    try {
        const session = await TaskSession_1.default.create({ technicianId, screens: [], startTime: new Date() });
        res.status(201).json({ sessionId: session._id });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to start session' });
    }
};
exports.startSession = startSession;
const scanScreen = async (req, res) => {
    const { sessionId, barcode, status } = req.body;
    try {
        const session = await TaskSession_1.default.findById(sessionId);
        if (!session)
            return res.status(404).json({ error: 'Session not found' });
        session.screens.push({
            barcode,
            status,
            timestamp: new Date(),
        });
        await session.save();
        res.status(200).json({ message: 'Screen saved' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save screen' });
    }
};
exports.scanScreen = scanScreen;
const stopSession = async (req, res) => {
    const { sessionId } = req.body;
    try {
        const session = await TaskSession_1.default.findById(sessionId);
        if (!session)
            return res.status(404).json({ error: 'Session not found' });
        session.endTime = new Date();
        await session.save();
        const reparable = session.screens.filter((s) => s.status === 'Reparable').length;
        const beyondRepair = session.screens.filter((s) => s.status === 'Beyond Repair').length;
        res.status(200).json({
            message: 'Session ended',
            totalScreens: session.screens.length,
            duration: (new Date().getTime() - session.startTime.getTime()) / 1000, // seconds
            reparable,
            beyondRepair,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to stop session' });
    }
};
exports.stopSession = stopSession;
const getSessionSummary = async (req, res) => {
    const { technicianId } = req.params;
};
exports.getSessionSummary = getSessionSummary;
