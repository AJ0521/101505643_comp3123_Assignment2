import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { employeeService } from '../services/employeeService';

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch employee details. Please try again.');
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');
    return `${backendUrl}${profilePicture}`;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !employee) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Employee not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          sx={{ mt: 2 }}
        >
          Back to Employee List
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          Back to Employee List
        </Button>

        {/* Hero Section */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
            },
          }}
        >
          <Box sx={{ p: { xs: 4, sm: 5, md: 6 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={getImageUrl(employee.profilePicture)}
                  sx={{ 
                    width: { xs: 120, sm: 140, md: 160 }, 
                    height: { xs: 120, sm: 140, md: 160 },
                    border: '6px solid rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {employee.firstName?.[0]}{employee.lastName?.[0]}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <Box sx={{ color: 'white' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 1.5,
                      letterSpacing: '-0.02em',
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
                    <Chip
                      icon={<WorkIcon />}
                      label={employee.position}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                    <Chip
                      icon={<BusinessIcon />}
                      label={employee.department}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/employees/edit/${id}`)}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Edit Employee
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Details Section */}
        <Grid container spacing={3}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                height: '100%',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Contact Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <EmailIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                      }}
                    >
                      Email Address
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      pl: 4.5,
                    }}
                  >
                    {employee.email}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <PhoneIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                      }}
                    >
                      Phone Number
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      pl: 4.5,
                    }}
                  >
                    {employee.phoneNumber}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Employment Details */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                height: '100%',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Employment Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <BusinessIcon sx={{ color: 'secondary.main', fontSize: '1.5rem' }} />
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                      }}
                    >
                      Department
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      pl: 4.5,
                    }}
                  >
                    {employee.department}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <WorkIcon sx={{ color: 'secondary.main', fontSize: '1.5rem' }} />
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                      }}
                    >
                      Position
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      pl: 4.5,
                    }}
                  >
                    {employee.position}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Financial Information */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                height: '100%',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Financial Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MoneyIcon sx={{ color: 'success.main', fontSize: '2rem' }} />
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem',
                    }}
                  >
                    Annual Salary
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'success.main',
                    pl: 4.5,
                    letterSpacing: '-0.02em',
                  }}
                >
                  ${employee.salary?.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Joining Information */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                height: '100%',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Joining Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <CalendarIcon sx={{ color: 'info.main', fontSize: '2rem' }} />
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem',
                    }}
                  >
                    Date of Joining
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    pl: 4.5,
                  }}
                >
                  {new Date(employee.dateOfJoining).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ViewEmployee;

