//authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Technician from '../models/Technician';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // fallback for safety

// Register Technician
export const register = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password, department, task } = req.body;

    // Validate fields
    if (!name || !surname || !email || !password || !department || !task) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing technician
    const existingUser = await Technician.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const technician = await Technician.create({
      name,
      surname,
      email,
      password: hashedPassword,
      department,
      task,
    });

    res.status(201).json({ message: 'Registration successful', technician });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err });
  }
};

// Login Technician
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const technician = await Technician.findOne({ email });
    if (!technician) return res.status(404).json({ message: 'Technician not found' });

    const isMatch = await bcrypt.compare(password, technician.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: technician._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, technician });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', details: err });
  }
};
