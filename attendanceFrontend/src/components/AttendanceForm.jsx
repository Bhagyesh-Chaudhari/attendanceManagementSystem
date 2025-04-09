import { useEffect, useState } from 'react';
import API from '../api';

export default function AttendanceForm({ token, selected }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    API.get(`/students?classId=${selected.class_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setStudents(res.data);
      setAttendance(res.data.map(s => ({ student_name: s.name, status: '' })));
    });
  }, []);

  const handleCheck = (i, status) => {
    const updated = [...attendance];
    updated[i].status = status;
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    await API.post('/attendance', {
      classId: selected.class_id,
      subjectId: selected.subject_id,
      attendanceList: attendance,
      date,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Attendance submitted!');
  };

  return (
    <div>
      <h3>Attendance for {selected.class_name} - {selected.subject_name}</h3>
      <input type="date" onChange={e => setDate(e.target.value)} />
      {students.map((s, i) => (
        <div key={i}>
          <span>{s.name}</span>
          <input type="radio" name={s.name} onClick={() => handleCheck(i, 'present')} /> Present
          <input type="radio" name={s.name} onClick={() => handleCheck(i, 'absent')} /> Absent
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}