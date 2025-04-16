import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../layout/Navbar';
import '../styles/signup.css'; 

export default function SignupForm() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city_code: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  return (
    <>
    <Navbar />
    <div className="signup-body">
    <div className="auth-card">
      <div className="auth-header">
        <h3>Create Account</h3>
      </div>
      <div className="auth-body">
        {success && <div className="alert alert-success">Signed up! Redirecting...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'phone', 'address', 'city_code'].map((field) => (
            <div className="mb-3" key={field}>
              <label htmlFor={field} className="form-label">
                {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                className="form-control"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Sign Up</button>
          <p className="text-center mt-3 login-link">
            Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#d4af37' }}>Login here</span>
          </p>
        </form>
      </div>
    </div>
    </div>
    </>
  );
}
