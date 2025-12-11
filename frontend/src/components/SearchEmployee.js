import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Alert,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const SearchEmployee = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchData, setSearchData] = useState({
    department: '',
    position: ''
  });
  const [employees, setEmployees] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.department && !searchData.position) {
      setError('Please select at least one search criteria (department or position)');
      return;
    }

    try {
      setError('');
      const results = await employeeService.searchEmployees(
        searchData.department,
        searchData.position
      );
      setEmployees(results);
      setSearched(true);
    } catch (error) {
      setError('Failed to search employees. Please try again.');
      console.error('Error searching employees:', error);
      setEmployees([]);
      setSearched(true);
    }
  };

  const handleReset = () => {
    setSearchData({ department: '', position: '' });
    setEmployees([]);
    setSearched(false);
    setError('');
  };

  const handleLogout = () => {
    logout();
    authService.logout();
    navigate('/login');
  };

  const getImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');
    return `${backendUrl}${profilePicture}`;
  };

  return (
    <Box>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 800,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              letterSpacing: '-0.01em',
            }}
          >
            Employee Search
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', md: 'block' },
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9375rem',
              }}
            >
              Welcome, <strong style={{ fontWeight: 600 }}>{user?.username}</strong>
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/employees')}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: '1.5px',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Employee List
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: '1.5px',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
            mb: 4,
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
              Search Employees
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1rem',
              }}
            >
              Search employees by department or position (or both)
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSearch}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                select
                label="Department"
                name="department"
                value={searchData.department}
                onChange={handleChange}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Position"
                name="position"
                value={searchData.position}
                onChange={handleChange}
              >
                <MenuItem value="">All Positions</MenuItem>
                {positions.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                fullWidth
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                fullWidth
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>

        {searched && (
          <Paper 
            elevation={0}
            sx={{ 
              padding: 4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: '4px solid #8096AD',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Search Results ({employees.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employees.length === 0 
                  ? 'No employees match your search criteria'
                  : `Found ${employees.length} employee${employees.length !== 1 ? 's' : ''}`
                }
              </Typography>
            </Box>

            {employees.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No employees found matching your search criteria.
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Profile</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Salary</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee._id} hover>
                        <TableCell>
                          <Avatar
                            src={getImageUrl(employee.profilePicture)}
                            alt={`${employee.firstName} ${employee.lastName}`}
                          >
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                          </Avatar>
                        </TableCell>
                        <TableCell>{employee.firstName}</TableCell>
                        <TableCell>{employee.lastName}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phoneNumber}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/employees/view/${employee._id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default SearchEmployee;

