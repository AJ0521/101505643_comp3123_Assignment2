const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Employee = require('../models/Employee');
const path = require('path');
const fs = require('fs');

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private
router.post('/', auth, upload.single('profilePicture'), [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required'),
  body('salary')
    .isNumeric()
    .withMessage('Salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const employeeData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      department: req.body.department,
      position: req.body.position,
      salary: parseFloat(req.body.salary),
      dateOfJoining: req.body.dateOfJoining || new Date()
    };

    // Handle profile picture upload
    if (req.file) {
      employeeData.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Check if employee with email already exists
    const existingEmployee = await Employee.findOne({ email: employeeData.email });
    if (existingEmployee) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = new Employee(employeeData);
    await employee.save();

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Create employee error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    res.status(500).json({ message: 'Server error creating employee' });
  }
});

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
});

// @route   GET /api/employees/search
// @desc    Search employees by department or position
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { department, position } = req.query;
    const query = {};

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    if (position) {
      query.position = { $regex: position, $options: 'i' };
    }

    if (!department && !position) {
      return res.status(400).json({ message: 'Please provide department or position to search' });
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    console.error('Search employees error:', error);
    res.status(500).json({ message: 'Server error searching employees' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error fetching employee' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', auth, upload.single('profilePicture'), [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required'),
  body('salary')
    .isNumeric()
    .withMessage('Salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      department: req.body.department,
      position: req.body.position,
      salary: parseFloat(req.body.salary),
      dateOfJoining: req.body.dateOfJoining || employee.dateOfJoining
    };

    // Check if email is being changed and if new email already exists
    if (updateData.email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email: updateData.email });
      if (existingEmployee) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }
    }

    // Handle profile picture upload
    if (req.file) {
      // Delete old profile picture if exists
      if (employee.profilePicture) {
        const oldPicturePath = path.join(__dirname, '../../', employee.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Update employee error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    res.status(500).json({ message: 'Server error updating employee' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete profile picture if exists
    if (employee.profilePicture) {
      const picturePath = path.join(__dirname, '../../', employee.profilePicture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error deleting employee' });
  }
});

module.exports = router;

