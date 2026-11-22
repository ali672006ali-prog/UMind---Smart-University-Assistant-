
import React, { useState } from 'react';
import { GPAEntry } from '../types';

interface GPAProps {
  t: any;
}

const GPA: React.FC<GPAProps> = ({ t }) => {
  const [entries, setEntries] = useState<GPAEntry[]>([]);
  const [subjectName, setSubjectName] = useState('');
  const [credits, setCredits] = useState(3);
  const [grade, setGrade] = useState(4.0);

  const addEntry = () => {
    if (!subjectName) return;
    setEntries([...entries, { id: Math.random().toString(36).substr(2, 9), subjectName, creditHours: credits, grade }]);
    setSubjectName('');
  };

  const calculateGPA = () => {
    if (entries.length === 0) return 0;
    const totalPoints = entries.reduce((acc, curr) => acc + (curr.grade * curr.creditHours), 0);
    const totalCredits = entries.reduce((acc, curr) => acc + curr.creditHours, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-4xl font-black text-black tracking-tight">{t.gpa}</h1>
        <p className="text-gray-600 font-bold opacity-80">{t.tagline}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-black">{t.addGrade}</h3>
            <div className="space-y-4">
              <FormInput label={t.subjectName} value={subjectName} onChange={setSubjectName} />
              <FormInput label={t.totalCredits} type="number" value={credits} onChange={v => setCredits(parseInt(v))} />
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">GRADE</label>
                <select value={grade} onChange={e => setGrade(parseFloat(e.target.value))} className="w-full rounded-2xl p-4 font-black border-2 border-brand-gray">
                  <option value="4.0">A (4.0)</option>
                  <option value="3.0">B (3.0)</option>
                  <option value="2.0">C (2.0)</option>
                  <option value="0.0">F (0.0)</option>
                </select>
              </div>
              <button onClick={addEntry} className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black shadow-xl hover:opacity-90">
                {t.addSubject}
              </button>
            </div>
          </div>
          <div className="bg-black text-white rounded-[32px] p-10 shadow-2xl text-center space-y-2">
            <p className="text-xs font-black opacity-60 uppercase tracking-widest">CURRENT GPA</p>
            <div className="text-7xl font-black">{calculateGPA()}</div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm">
          <h3 className="text-2xl font-black mb-8">{t.courseBreakdown}</h3>
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-brand-gray">
                    {entry.grade >= 3.0 ? 'A' : 'B'}
                  </div>
                  <div>
                    <p className="text-xl font-black">{entry.subjectName}</p>
                    <p className="text-sm font-bold text-gray-400">{entry.creditHours} {t.totalCredits}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-2xl font-black text-brand-blue">{entry.grade.toFixed(1)}</span>
                  <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-gray-300 hover:text-brand-red">
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-2xl p-4 font-black" />
  </div>
);

export default GPA;
