import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post('https://promising-margery-codexspaces-d281ce63.koyeb.app/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: ""
        });
      }
    } catch (error) {

      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [])
  return (
    <div className='flex items-center h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
        </div>
        <div>
          <span className='font-medium flex items-start'>Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-1"
          />
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
          loading ? (
            <Button>
              <Loader2 className='mr-5 h-4 w-5 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit' disabled={loading}>
              Signup
            </Button>
          )
        }

        <span className='text-center'>
          Already have an account? <Link to='/login' className='text-blue-600'>Login</Link>
        </span>
      </form>
    </div>
  )
}

export default Signup;
