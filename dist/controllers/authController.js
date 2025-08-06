"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Technician_1 = __importDefault(require("../models/Technician"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // fallback for safety
// Register Technician
const register = async (req, res) => {
    try {
        const { name, surname, email, password, department, task } = req.body;
        // Validate fields
        if (!name || !surname || !email || !password || !department || !task) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check for existing technician
        const existingUser = await Technician_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'Email already registered' });
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const technician = await Technician_1.default.create({
            name,
            surname,
            email,
            password: hashedPassword,
            department,
            task,
        });
        res.status(201).json({ message: 'Registration successful', technician });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed', details: err });
    }
};
exports.register = register;
// Login Technician
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const technician = await Technician_1.default.findOne({ email });
        if (!technician)
            return res.status(404).json({ message: 'Technician not found' });
        const isMatch = await bcryptjs_1.default.compare(password, technician.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ id: technician._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, technician });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed', details: err });
    }
};
exports.login = login;
