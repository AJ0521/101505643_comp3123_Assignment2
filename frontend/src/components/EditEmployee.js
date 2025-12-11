import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Avatar
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { employeeService } from '../services/employeeService';

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    position: '',
    salary: '',
    dateOfJoining: '',
    profilePicture: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [currentPicture, setCurrentPicture] = useState(null);

  const departments = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Engineering',
    'Customer Service'
  ];

  const positions = [
    'Manager',
    'Developer',
    'Designer',
    'Analyst',
    'Coordinator',
    'Specialist',
    'Director',
    'Associate'
  ];

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setFetchLoading(true);
      const data = await employeeService.getEmployeeById(id);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        department: data.department || '',
        position: data.position || '',
        salary: data.salary?.toString() || '',
        dateOfJoining: data.dateOfJoining
          ? new Date(data.dateOfJoining).toISOString().split('T')[0]
          : '',
        profilePicture: null
      });
      if (data.profilePicture) {
        const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
        const backendUrl = apiUrl.replace('/api', '');
        const imageUrl = data.profilePicture.startsWith('http')
          ? data.profilePicture
          : `${backendUrl}${data.profilePicture}`;
        setCurrentPicture(imageUrl);
        setPreview(imageUrl);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch employee details. Please try again.');
      console.error('Error fetching employee:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) < 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({ ...errors, [name]: '' });
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Only image files are allowed');
        return;
      }
      setFormData({
        ...formData,
        profilePicture: file
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await employeeService.updateEmployee(id, formData);
      navigate('/employees');
    } catch (error) {
      const errorMsg = error.response?.data?.message ||
                      error.response?.data?.errors?.[0]?.msg ||
                      'Failed to update employee. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/employees')}
        sx={{ mb: 2 }}
      >
        Back to Employee List
      </Button>

      <Paper 
        elevation={0}
        sx={{ 
          padding: { xs: 3, sm: 4, md: 5 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #2563eb 100%)',
          },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            }}
          >
            Edit Employee
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '1rem',
            }}
          >
            Update employee information
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              mb: 4, 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Avatar
              src={preview || currentPicture}
              sx={{ 
                width: 120, 
                height: 120,
                border: '4px solid',
                borderColor: 'secondary.light',
                bgcolor: 'secondary.main',
                boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {formData.firstName?.[0]}{formData.lastName?.[0]}
            </Avatar>
            <Box>
              <Button
                variant="outlined"
                component="label"
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  borderWidth: '1.5px',
                }}
              >
                {formData.profilePicture ? 'Change Picture' : 'Upload New Picture'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  mt: 0.5,
                }}
              >
                Max size: 5MB • JPG, PNG, GIF
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              required
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              required
              select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={!!errors.department}
              helperText={errors.department}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              required
              select
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              error={!!errors.position}
              helperText={errors.position}
            >
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              required
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              error={!!errors.salary}
              helperText={errors.salary}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/employees')}
              fullWidth
              size="large"
              sx={{
                fontWeight: 600,
                borderWidth: '1.5px',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Employee'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditEmployee;

