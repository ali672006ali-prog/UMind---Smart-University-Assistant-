
import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TasksProps {
  t: any;
}

const Tasks: React.FC<TasksProps> = ({ t }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('unimind_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('unimind_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      priority,
      dueDate: new Date().toISOString().split('T')[0]
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tight">{t.tasks}</h1>
          <p className="text-gray-600 font-bold opacity-80">Stay organized, stay productive.</p>
        </div>
      </header>

      <div className="bg-white border-4 border-brand-gray rounded-[40px] p-8 shadow-sm">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="flex-grow rounded-2xl p-4 font-bold text-lg border-2 border-brand-gray"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="rounded-2xl p-4 font-black border-2 border-brand-gray bg-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all"
          >
            Add Task
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-6 rounded-[24px] border-2 transition-all ${
                task.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-brand-gray shadow-sm hover:border-brand-blue'
              }`}
            >
              <div className="flex items-center gap-6">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                    task.completed ? 'bg-brand-blue border-brand-blue text-white' : 'border-brand-gray bg-white'
                  }`}
                >
                  {task.completed && <i className="fa-solid fa-check"></i>}
                </button>
                <div>
                  <h4 className={`text-xl font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-black'}`}>
                    {task.text}
                  </h4>
                  <div className="flex gap-3 mt-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      task.priority === 'high' ? 'border-brand-red text-brand-red bg-red-50' : 
                      task.priority === 'medium' ? 'border-brand-blue text-brand-blue bg-blue-50' : 
                      'border-gray-400 text-gray-400 bg-gray-50'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase">{task.dueDate}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-300 hover:text-brand-red transition-colors p-2"
              >
                <i className="fa-solid fa-trash-can text-xl"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[40px] border-4 border-dashed border-brand-gray">
            <i className="fa-solid fa-list-check text-6xl text-gray-200 mb-6"></i>
            <p className="text-xl font-black text-gray-400">No tasks for now. Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
