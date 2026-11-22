
import React, { useState, useRef, useEffect } from 'react';
import { summarizeContent, explainConcept, generateQuiz, chatWithAssistant } from '../services/geminiService';
import { saveToGoogleDrive } from '../services/driveService';
import { Message, QuizQuestion } from '../types';

interface AIPartnerProps {
  t: any;
}

const AIPartner: React.FC<AIPartnerProps> = ({ t }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('unimind_chat_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [
      { id: '1', role: 'assistant', content: 'Hi! I am UniMind, your academic companion. How can I help you study today? You can ask me to summarize notes, explain a concept, or quiz you.', timestamp: new Date() }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDriveToast, setShowDriveToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'summarize'>('chat');
  const [quizResults, setQuizResults] = useState<QuizQuestion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    localStorage.setItem('unimind_chat_history', JSON.stringify(messages));
  }, [messages]);

  const triggerDriveSave = async (text: string) => {
    setIsSyncing(true);
    await saveToGoogleDrive(text, `Note_${Date.now()}`);
    setIsSyncing(false);
    setShowDriveToast(true);
    setTimeout(() => setShowDriveToast(false), 3000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant([], currentInput);
      const assistantMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', content: response || "I'm sorry, I couldn't process that.", timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      
      // Auto-save user input to Drive
      triggerDriveSave(currentInput);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const summary = await summarizeContent(input);
      const assistantMsg: Message = { id: Date.now().toString(), role: 'assistant', content: `**Summary:**\n\n${summary}`, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setActiveTab('chat');
      
      // Auto-save original content to Drive
      triggerDriveSave(input);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuiz = async (type: 'mcq' | 'tf' | 'essay') => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const quiz = await generateQuiz(input, type);
      setQuizResults(quiz);
      setActiveTab('quiz');
      triggerDriveSave(`Quiz Generation Content: ${input}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white border-2 border-brand-gray rounded-[32px] shadow-sm overflow-hidden animate-in fade-in duration-500 relative">
      
      {/* Drive Sync Toast */}
      {showDriveToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-2 rounded-full text-sm font-black shadow-2xl border border-brand-blue animate-in slide-in-from-top-4">
          <i className="fa-solid fa-cloud-check mr-2 text-brand-blue"></i>
          {t.savedToDrive}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b-2 border-brand-gray bg-gray-50">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-4 font-black transition-colors ${activeTab === 'chat' ? 'bg-white text-brand-blue border-b-4 border-brand-blue' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-comments mr-2"></i> {t.aiPartner}
        </button>
        <button 
          onClick={() => setActiveTab('summarize')}
          className={`flex-1 px-4 py-4 font-black transition-colors ${activeTab === 'summarize' ? 'bg-white text-brand-blue border-b-4 border-brand-blue' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-file-contract mr-2"></i> {t.summarize}
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 px-4 py-4 font-black transition-colors ${activeTab === 'quiz' ? 'bg-white text-brand-blue border-b-4 border-brand-blue' : 'text-gray-500 hover:text-black'}`}
        >
          <i className="fa-solid fa-list-check mr-2"></i> {t.quiz}
        </button>
        <button 
          onClick={() => {
            if (window.confirm(t.lang === 'ar' ? 'هل تريد مسح سجل الدردشة؟' : 'Clear chat history?')) {
              setMessages([{ id: '1', role: 'assistant', content: t.lang === 'ar' ? 'تم مسح السجل. كيف يمكنني مساعدتك؟' : 'Chat history cleared. How can I help you now?', timestamp: new Date() }]);
            }
          }}
          className="px-6 py-4 text-gray-300 hover:text-brand-red transition-colors border-l-2 border-brand-gray"
          title={t.chatHistory}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-8 space-y-6" ref={scrollRef}>
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {messages.length === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setInput(t.lang === 'ar' ? 'اشرح لي مفهوم...' : 'Explain the concept of...')}
                  className="p-4 bg-white border-2 border-brand-gray rounded-2xl font-bold text-left hover:border-brand-blue hover:bg-blue-50 transition-all flex items-center gap-3"
                >
                  <i className="fa-solid fa-lightbulb text-brand-blue"></i>
                  <span>{t.lang === 'ar' ? 'شرح مفهوم' : 'Explain a Concept'}</span>
                </button>
                <button 
                  onClick={() => setInput(t.lang === 'ar' ? 'أعطني نصائح للمذاكرة لـ...' : 'Give me study tips for...')}
                  className="p-4 bg-white border-2 border-brand-gray rounded-2xl font-bold text-left hover:border-brand-blue hover:bg-blue-50 transition-all flex items-center gap-3"
                >
                  <i className="fa-solid fa-graduation-cap text-brand-blue"></i>
                  <span>{t.lang === 'ar' ? 'نصائح مذاكرة' : 'Study Tips'}</span>
                </button>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[24px] p-5 shadow-sm border ${msg.role === 'user' ? 'bg-brand-blue text-white border-brand-blue rounded-tr-none' : 'bg-gray-100 text-black border-brand-gray rounded-tl-none'}`}>
                  <div className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">{msg.role === 'user' ? 'You' : 'UniMind'}</div>
                  <div className="whitespace-pre-wrap leading-relaxed font-bold">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'summarize' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-blue-50 border-2 border-brand-blue rounded-3xl p-8">
              <h3 className="text-xl font-black text-brand-blue mb-4 flex items-center gap-3">
                <i className="fa-solid fa-sparkles"></i>
                {t.summarize}
              </h3>
              <div className="prose prose-blue max-w-none">
                {messages.filter(m => m.content.startsWith('**Summary:**')).slice(-1).map(m => (
                  <div key={m.id} className="font-bold text-black leading-relaxed whitespace-pre-wrap">
                    {m.content.replace('**Summary:**\n\n', '')}
                  </div>
                ))}
                {messages.filter(m => m.content.startsWith('**Summary:**')).length === 0 && (
                  <p className="text-gray-400 font-black italic">No summary generated yet. Paste content below and click "{t.summarizeNow}".</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {quizResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-graduation-cap text-brand-blue"></i>
                  {t.quiz}
                </h3>
                {quizResults.map((q, idx) => (
                  <div key={idx} className="bg-white border-2 border-brand-gray rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black flex-shrink-0">{idx + 1}</span>
                      <p className="font-bold text-lg text-black">{q.question}</p>
                    </div>
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
                        {q.options.map((opt, oIdx) => (
                          <button key={oIdx} className="text-left p-4 rounded-xl border-2 border-brand-gray font-bold hover:border-brand-blue hover:bg-blue-50 transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    <details className="ml-12 group">
                      <summary className="cursor-pointer font-black text-brand-blue uppercase text-xs tracking-widest list-none flex items-center gap-2">
                        <i className="fa-solid fa-eye group-open:hidden"></i>
                        <i className="fa-solid fa-eye-slash hidden group-open:block"></i>
                        Show Answer
                      </summary>
                      <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 font-black">
                        Correct Answer: {q.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300 text-3xl">
                  <i className="fa-solid fa-vial"></i>
                </div>
                <p className="text-gray-400 font-black">{t.pasteContent}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t-2 border-brand-gray">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              className="w-full rounded-2xl p-5 font-bold text-lg min-h-[100px] pr-12"
              placeholder={activeTab === 'chat' ? t.askMeAnything : t.pasteContent}
              value={input}
              onChange={e => setInput(e.target.value)}
            ></textarea>
            {input && (
              <button 
                onClick={() => setInput('')}
                className="absolute top-4 right-4 text-gray-300 hover:text-brand-red transition-colors"
              >
                <i className="fa-solid fa-circle-xmark text-xl"></i>
              </button>
            )}
            {isSyncing && (
              <div className="absolute bottom-4 right-4 text-brand-blue animate-pulse">
                <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              {activeTab === 'chat' && (
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                  {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                  Send
                </button>
              )}
              {activeTab === 'summarize' && (
                <button onClick={handleSummarize} disabled={isLoading} className="bg-black text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2">
                  {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
                  {t.summarizeNow}
                </button>
              )}
              {activeTab === 'quiz' && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleQuiz('mcq')} disabled={isLoading} className="bg-brand-blue text-white px-6 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2">
                    {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-list-ol"></i>}
                    MCQs
                  </button>
                  <button onClick={() => handleQuiz('tf')} disabled={isLoading} className="bg-black text-white px-6 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2">
                    {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check-double"></i>}
                    True/False
                  </button>
                  <button onClick={() => handleQuiz('essay')} disabled={isLoading} className="bg-gray-800 text-white px-6 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2">
                    {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-pen-nib"></i>}
                    Essay
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-brand-gray">
               <i className={`fa-solid fa-cloud ${isSyncing ? 'text-brand-blue animate-bounce' : 'text-gray-300'}`}></i>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.driveSync}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPartner;
