import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const {user}=useSelector(store=>store.auth)
  const navigate=useNavigate()
  const dispatch=useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const LoginHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const res = await axios.post('https://wave-liart.vercel.app/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        navigate("/")
        toast.success(res.data.message);
        setInput({
          email: "",
          password: ""
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
if(user){
  navigate("/")
}
},[])
  return (
    <div className='flex items-center h-screen justify-center'>
      <form onSubmit={LoginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
        </div>
        <div>
          <span className='font-medium flex items-start'>Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-1"
          />
        </div>
        <div>
          <span className='font-medium flex items-start'>Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-1"
          />
        </div>
        {
          loading?(
            <Button>
              <Loader2 className='mr-5 h-4 w-5 animate-spin'/>
              Please wait
            </Button>
          ):(
            <Button type='submit' disabled={loading}>
              Login
            </Button>
          )
        }
        
        <span className='text-center'>
                 Already have an account? <Link to='/SignUp' className='text-blue-600'>Signup</Link> 
        </span>
      </form>
    </div>
  );
};

export default Login;
