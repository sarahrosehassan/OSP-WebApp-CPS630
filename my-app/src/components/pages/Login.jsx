import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../layout/Navbar';
import '../styles/login.css';

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard'); 
    } else {
      setError(result.error);
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-body">
    <div className="card">
      <div className="card-header">
        <h3>Welcome Back</h3>
      </div>
      <div className="card-body">
        <div className="form-icon">
          <i className="fas fa-user-circle"></i>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </div>

          <button type="submit" className="btn btn-primary">Sign In</button>

          <p className="text-center mt-3 signup-link">
            Don’t have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
    </div>
    </>
  );
}
