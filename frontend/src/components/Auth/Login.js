import React, { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Formik } from 'formik';
import { Box, Button, Container, InputAdornment, TextField } from '@mui/material';
import { loginValidationSchema } from '../../validations/loginSchema';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // 
  }

  const toggleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className='mt-5'>
      <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
          enableReinitialize={true}
      >
          {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
              <Box sx={{width: {xs: '100%', sm: '50%', md: '40%', xl: '40%'}}}>
                <h1 className='mb-5 text-center'>Login with your email</h1>
                  <div className="mb-5">
                      <TextField
                      label='Email Address'
                        variant='outlined'
                          name="email"
                          placeholder="Enter your email ID"
                          sx={{ width: '100%' }}
                          value={values.email}
                          onChange={(e) => setFieldValue('email', e.target.value)}
                      />
                      {touched.email && errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>
                  <div>
                      <TextField
                      label='Email Address'
                        variant='outlined'
                          name="password"
                          value={values.password}
                          sx={{ width: '100%' }}
                          type={isPasswordVisible ? 'text' : 'password'}
                          placeholder="Enter your password"
                          onChange={(e) => setFieldValue('password', e.target.value)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">
                            {isPasswordVisible ? (
                                <RemoveRedEyeIcon className="close-icon" onClick={toggleShowPassword} />
                            ) : (
                                <VisibilityOffIcon className="close-icon" onClick={toggleShowPassword} />
                            )}
                        </InputAdornment>
                          }}
                      />
                      {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
                  </div>
                  <div className="btn-container mt-5">
                      <Button
                          variant='contained'
                          color='primary'
                          size='large'
                          data-bs-dismiss="modal"
                          onClick={handleSubmit}
                          id="LOGIN"
                      >
                          Login
                      </Button>
                  </div>
              </Box>
          )}
      </Formik>
    </Container>
  );
};

export default Login;
