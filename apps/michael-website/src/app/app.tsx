import { Route, Routes, Link } from 'react-router-dom';
import Home from '../pages/Home';
import Footer from '@/components/Footer';

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
