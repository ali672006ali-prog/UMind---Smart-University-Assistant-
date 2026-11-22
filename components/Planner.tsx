
import React, { useState } from 'react';
import { Subject, SubjectDifficulty } from '../types';

interface PlannerProps {
  t: any;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const Planner: React.FC<PlannerProps> = ({ t, subjects, setSubjects }) => {
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    difficulty: SubjectDifficulty.MEDIUM,
    examDate: '',
    targetGrade: 4.0
  });

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.examDate) return;
    const subject: Subject = { ...newSubject, id: Math.random().toString(36).substr(2, 9) };
    setSubjects([...subjects, subject]);
    setNewSubject({ name: '', difficulty: SubjectDifficulty.MEDIUM, examDate: '', targetGrade: 4.0 });
    setShowForm(false);
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tight">{t.courseRegistration}</h1>
          <p className="text-gray-600 font-bold opacity-80">{t.planner}</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-10 py-5 rounded-2xl font-black shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 text-lg"
        >
          <i className="fa-solid fa-plus"></i> {t.addSubject}
        </button>
      </header>

      {showForm && (
        <div className="bg-white border-4 border-brand-gray rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
          <h3 className="text-3xl font-black mb-8">{t.addSubject}</h3>
          <form onSubmit={addSubject} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label={t.subjectName} type="text" value={newSubject.name} onChange={v => setNewSubject({...newSubject, name: v})} />
            <FormInput label={t.examDate} type="date" value={newSubject.examDate} onChange={v => setNewSubject({...newSubject, examDate: v})} />
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-black">{t.difficulty}</label>
              <select 
                className="w-full rounded-2xl p-4 font-black text-lg bg-white border-2 border-brand-gray"
                value={newSubject.difficulty}
                onChange={e => setNewSubject({...newSubject, difficulty: e.target.value as SubjectDifficulty})}
              >
                <option value={SubjectDifficulty.EASY}>{t.easy}</option>
                <option value={SubjectDifficulty.MEDIUM}>{t.medium}</option>
                <option value={SubjectDifficulty.HARD}>{t.hard}</option>
              </select>
            </div>
            <FormInput label={t.targetGpa} type="number" step="0.1" value={newSubject.targetGrade} onChange={v => setNewSubject({...newSubject, targetGrade: parseFloat(v)})} />
            
            <div className="md:col-span-2 flex justify-end gap-6 pt-8 mt-4 border-t-2 border-brand-gray">
              <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 text-gray-400 font-black uppercase tracking-widest hover:text-black">
                {t.cancel}
              </button>
              <button type="submit" className="bg-brand-blue text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:opacity-90 transition-opacity">
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white border-2 border-brand-gray rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-brand-blue transition-all relative group">
            <div className={`absolute top-0 left-0 w-full h-2 ${subject.difficulty === SubjectDifficulty.HARD ? 'bg-brand-red' : 'bg-brand-blue'}`}></div>
            
            <button 
              onClick={() => deleteSubject(subject.id)}
              className="absolute top-4 right-4 w-10 h-10 bg-red-50 text-brand-red rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-red hover:text-white"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>

            <h3 className="font-black text-2xl mb-6 text-black pr-10">{subject.name}</h3>
            <div className="space-y-4">
              <DetailRow label={t.examDate} value={new Date(subject.examDate).toLocaleDateString()} />
              <DetailRow label={t.difficulty} value={subject.difficulty === SubjectDifficulty.HARD ? t.hard : subject.difficulty === SubjectDifficulty.MEDIUM ? t.medium : t.easy} isBadge />
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="md:col-span-3 py-20 text-center bg-gray-50 rounded-[40px] border-4 border-dashed border-brand-gray">
            <i className="fa-solid fa-book-open text-6xl text-gray-200 mb-6"></i>
            <p className="text-xl font-black text-gray-400">{t.noSubjects || "No courses added yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FormInput = ({ label, type, value, onChange, ...props }: any) => (
  <div className="space-y-3">
    <label className="text-xs font-black uppercase tracking-widest text-black">{label}</label>
    <input 
      type={type} required className="w-full rounded-2xl p-4 font-black text-lg" 
      value={value} onChange={e => onChange(e.target.value)} {...props} 
    />
  </div>
);

const DetailRow = ({ label, value, isBadge }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-black uppercase tracking-tighter text-gray-400">{label}</span>
    <span className={`font-bold text-black ${isBadge ? 'px-3 py-1 rounded-lg border-2 border-brand-blue text-brand-blue text-xs uppercase' : ''}`}>
      {value}
    </span>
  </div>
);

export default Planner;
