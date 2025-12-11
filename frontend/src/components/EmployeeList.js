import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Logout as LogoutIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch employees. Please try again.');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (error) {
      alert('Failed to delete employee. Please try again.');
      console.error('Error deleting employee:', error);
    } finally {
      setDeleteLoading(null);
    }
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
            Employee Management System
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
              startIcon={<SearchIcon />}
              onClick={() => navigate('/search')}
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
              Search
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

      <Container maxWidth="xl" sx={{ mt: { xs: 3, sm: 4, md: 5 }, mb: 4, px: { xs: 2, sm: 3 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
            flexWrap: 'wrap',
            gap: 3,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              }}
            >
              Employee List
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1rem',
                fontWeight: 400,
              }}
            >
              Manage your employee database efficiently
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/employees/add')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Add Employee
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box 
            display="flex" 
            flexDirection="column"
            justifyContent="center" 
            alignItems="center"
            p={8}
            sx={{ gap: 2 }}
          >
            <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              Loading employees...
            </Typography>
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Salary</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No employees found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Get started by adding your first employee
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/employees/add')}
                        >
                          Add Employee
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow 
                      key={employee._id} 
                      hover
                      sx={{ 
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={getImageUrl(employee.profilePicture)}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          sx={{ 
                            width: 48, 
                            height: 48,
                            border: '2.5px solid',
                            borderColor: 'primary.light',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                        {employee.firstName}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                        {employee.lastName}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.9375rem', color: 'text.secondary' }}>
                        {employee.email}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.9375rem' }}>{employee.phoneNumber}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            display: 'inline-block',
                            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
                          }}
                        >
                          {employee.department}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            display: 'inline-block',
                            boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          {employee.position}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'success.main', fontSize: '1rem' }}>
                        ${employee.salary?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            onClick={() => navigate(`/employees/view/${employee._id}`)}
                            size="small"
                            sx={{
                              color: 'info.main',
                              '&:hover': {
                                bgcolor: 'info.main',
                                color: 'white',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => navigate(`/employees/edit/${employee._id}`)}
                            size="small"
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(employee._id)}
                            disabled={deleteLoading === employee._id}
                            size="small"
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.main',
                                color: 'white',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            {deleteLoading === employee._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default EmployeeList;

