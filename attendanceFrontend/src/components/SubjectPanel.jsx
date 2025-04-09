import { useEffect, useState } from 'react';
import API from '../../api';

export default function SubjectPanel({ token, setSelected }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    API.get('/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSubjects(res.data));
  }, []);

  return (
    <div>
      <h2>Your Classes & Subjects</h2>
      {subjects.map((subj) => (
        <div key={subj.subject_id}>
          <button onClick={() => setSelected(subj)}>
            {subj.class_name} - {subj.subject_name}
          </button>
        </div>
      ))}
    </div>
  );
}