import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {

  }

  return (
    <div>
      <form>
        <input type='email' onChange={handleChange}/>
      </form> 
    </div>
  );
};

export default Login;
