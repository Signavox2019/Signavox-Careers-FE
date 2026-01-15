// src/components/AssignJob.jsx
import { useEffect, useState } from 'react';
import { api } from '../api';
import { showSuccess, showError } from '../utils/notify';

export default function AssignJob({ jobId, currentAssignee, onAssigned }) {
  const [managers, setManagers] = useState([]);
  const [selected, setSelected] = useState(currentAssignee?._id || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const res = await api.fetchManagers();
      console.log('Managers API response:', res.data);
      setManagers(res.data.managers || []); // ✅ Adjust based on your response
    } catch (err) {
      console.error('Failed fetch managers', err);
      setManagers([]);
    }
  })();
}, []);


  const assign = async () => {
    try {
      setSaving(true);
      await api.updateJob(jobId, JSON.stringify({ assignedTo: selected }));
      showSuccess('Assigned successfully');
      onAssigned && onAssigned(selected);
    } catch (err) {
      console.error(err);
      showError('Failed to assign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="px-3 py-2 border rounded">
        <option value="">Unassigned</option>
        {managers.map(m => <option key={m._id} value={m._id}>{m.name} — {m.email}</option>)}
      </select>
      <button onClick={assign} disabled={saving} className="px-3 py-2 bg-blue-600 text-white rounded">Assign</button>
    </div>
  );
}
