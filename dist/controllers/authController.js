"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, password, department, task } = req.body;
        // Validate fields
        if (!name || !surname || !email || !password || !department || !task) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check for existing technician
        const existingUser = yield Technician_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'Email already registered' });
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const technician = yield Technician_1.default.create({
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
});
exports.register = register;
// Login Technician
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const technician = yield Technician_1.default.findOne({ email });
        if (!technician)
            return res.status(404).json({ message: 'Technician not found' });
        const isMatch = yield bcryptjs_1.default.compare(password, technician.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ id: technician._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, technician });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed', details: err });
    }
});
exports.login = login;
