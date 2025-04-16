import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/pages/Signup';
import LoginForm from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Cart from './components/pages/Cart';  
import Delivery from './components/pages/Delivery';
import Process from './components/pages/Process';
import Payment from './components/pages/Payment';
import Reviews from './components/pages/Reviews';
import About from './components/pages/About';
import Insert from './components/pages/Insert';
import Delete from './components/pages/Delete';
import Select from './components/pages/Select';
import Update from './components/pages/Update';
import Search from './components/pages/Search';
import { AuthProvider } from './components/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/process" element={<Process />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/insert" element={<Insert />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/select" element={<Select />} />
          <Route path="/update" element={<Update />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
