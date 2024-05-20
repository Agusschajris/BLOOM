import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Proyecto from './Pages/proyecto';

<Router>
  <Routes>
    <Route path="/proyecto" element={<Proyecto />} />
  </Routes>
</Router>
