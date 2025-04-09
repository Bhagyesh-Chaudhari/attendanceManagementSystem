import { useState } from 'react';
import Login from './components/Login';
import SubjectPanel from './components/SubjectPanel';
import AttendanceForm from './components/AttendanceForm';

function App() {
  const [token, setToken] = useState('');
  const [teacher, setTeacher] = useState(null);
  const [selected, setSelected] = useState(null);

  if (!token) return <Login setTeacher={setTeacher} setToken={setToken} />;
  if (!selected) return <SubjectPanel token={token} setSelected={setSelected} />;

  return <AttendanceForm token={token} selected={selected} />;
}

export default App;