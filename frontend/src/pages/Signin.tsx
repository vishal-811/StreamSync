import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StreamSyncSignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/api/auth/signin',{
       email : email,
       password : password
    }, {withCredentials: true})
    if(response.status === 200){
       navigate('/');
    }
  };

  

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center">Sign In to Your Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-zinc-700 py-2">
            <User className="text-zinc-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none flex-grow"
            />
          </div>

          <div className="flex items-center border-b border-zinc-700 py-2">
            <Lock className="text-zinc-400 w-5 h-5 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none flex-grow"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-zinc-950 px-4 py-2 rounded-lg font-semibold transition-all mt-4">
            Sign In
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-4">
          Don't have an account? 
          <a href="/signup" className="text-orange-500 hover:underline"> Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default StreamSyncSignIn;