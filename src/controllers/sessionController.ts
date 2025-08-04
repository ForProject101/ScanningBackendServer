// 📄 src/controllers/sessionController.ts
import { Request, Response } from 'express';
import TaskSession from '../models/TaskSession'; // ✅ Correct path

export const startSession = async (req: Request, res: Response) => {
  const { technicianId } = req.body;

  try {
    const session = await TaskSession.create({ technicianId, screens: [], startTime: new Date() });
    res.status(201).json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
};

export const scanScreen = async (req: Request, res: Response) => {
  const { sessionId, barcode, status } = req.body;

  try {
    const session = await TaskSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.screens.push({
      barcode,
      status,
      timestamp: new Date(),
    });

    await session.save();
    res.status(200).json({ message: 'Screen saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save screen' });
  }
};

export const stopSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  try {
    const session = await TaskSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.endTime = new Date();
    await session.save();

    const reparable = session.screens.filter((s: any) => s.status === 'Reparable').length;
    const beyondRepair = session.screens.filter((s: any) => s.status === 'Beyond Repair').length;

    res.status(200).json({
      message: 'Session ended',
      totalScreens: session.screens.length,
      duration: (new Date().getTime() - session.startTime.getTime()) / 1000, // seconds
      reparable,
      beyondRepair,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop session' });
  }
};

export const getSessionSummary = async (req: Request, res: Response) => {
  const { technicianId } = req.params;

};