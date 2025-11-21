import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n'; // Initialize i18n
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
import PatientDetails from './pages/PatientDetails';
import FollowUpForm from './pages/FollowUpForm';
import MedicineList from './pages/MedicineList';
import MedicineForm from './pages/MedicineForm';
import PrescriptionList from './pages/PrescriptionList';
import PrescriptionForm from './pages/PrescriptionForm';
import DietPlanForm from './pages/DietPlanForm';
import FollowUpList from './pages/FollowUpList';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="patients/edit/:id" element={<PatientForm />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="medicines" element={<MedicineList />} />
          <Route path="medicines/new" element={<MedicineForm />} />
          <Route path="medicines/edit/:id" element={<MedicineForm />} />
          <Route path="prescriptions" element={<PrescriptionList />} />
          <Route path="prescriptions/new" element={<PrescriptionForm />} />
          <Route path="diet-plans/new" element={<DietPlanForm />} />
          <Route path="diet-plans/edit/:id" element={<DietPlanForm />} />
          <Route path="follow-ups" element={<FollowUpList />} />
          <Route path="follow-ups/new" element={<FollowUpForm />} />
          <Route path="follow-ups/edit/:id" element={<FollowUpForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
