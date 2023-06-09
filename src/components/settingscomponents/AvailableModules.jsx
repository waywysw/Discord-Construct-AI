import { useEffect, useState } from 'react';
import { getAvailableModules } from '../api';

function AvailableModules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    async function fetchModules() {
      const availableModules = await getAvailableModules();
      setModules(availableModules);
    }
    fetchModules();
  }, []);

  return (
    <div className="centered settings-box">
      <div className='mb-4'>
        <h1 className='text-xl font-bold'>Available Modules</h1>
      </div>
        {modules.map((module) => (
          <p key={module}>{module}</p>
        ))}
    </div>
  );
}

export default AvailableModules;
