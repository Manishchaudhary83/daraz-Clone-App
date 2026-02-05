
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Language } from '../translations';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatbotProps {
  language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: language === 'en' ? 'Hello! I am your Daraz AI assistant. How can I help you today?' : 'नमस्ते! म तपाईंको दराज AI सहायक हुँ। म तपाईंलाई कसरी मद्दत गर्न सक्छु?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if API Key exists
  const apiKey = process.env.API_KEY;
  const isKeyConfigured = !!apiKey && apiKey !== "undefined" && apiKey !== "" && !apiKey.includes("PASTE_YOUR");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !isKeyConfigured) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMsg }].map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are a friendly and professional customer support agent for 'Daraz Clone', an e-commerce platform in Nepal. You help users track orders, understand payment methods (eSewa, Khalti, COD, etc.), and provide product information. Keep responses concise and helpful. You can speak English and Nepali.",
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am currently offline. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-slideUp">
          <div className="bg-[#F85606] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black">AI</div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Daraz Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isKeyConfigured ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-[10px] font-bold opacity-80 uppercase">{isKeyConfigured ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {!isKeyConfigured && (
              <div className="bg-orange-50 border border-orange-200 p-5 rounded-sm text-center shadow-inner">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-2">Setup Required</p>
                <p className="text-[11px] text-orange-700 font-medium mb-4 leading-relaxed">
                  The AI assistant needs a **Gemini API Key** value to work. 
                </p>
                
                <div className="bg-white border border-orange-100 p-3 mb-4 rounded text-left">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mb-1">Look for this format:</p>
                  <code className="text-[10px] text-orange-600 font-mono break-all font-bold">
                    AIzaSyB3X4C2mP-L8qZ0-j9W8vR1a2b3c...
                  </code>
                </div>

                <div className="space-y-3">
                  <a 
                    href="https://aistudio.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-orange-500 text-white text-[10px] font-black py-3 rounded-sm uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-md"
                  >
                    1. Click here for AI Studio
                  </a>
                  <div className="text-[9px] text-gray-400 leading-tight">
                    <p className="mb-1 font-bold text-gray-500">2. ADD TO RENDER/VERCEL:</p>
                    <p>Settings → Environment Variables</p>
                    <p className="mt-1">Add <b>API_KEY</b> as the name and your <b>AIzaSy...</b> string as the value.</p>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-sm text-sm shadow-sm ${m.role === 'user' ? 'bg-[#002F6C] text-white' : 'bg-white text-gray-800 border'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isKeyConfigured ? "Ask me anything..." : "API Key missing..."}
              disabled={!isKeyConfigured}
              className="flex-1 border border-gray-200 rounded-sm px-4 py-2 text-sm focus:border-orange-500 outline-none transition-all disabled:bg-gray-50"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim() || !isKeyConfigured}
              className="bg-[#F85606] text-white p-2 rounded-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#F85606] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group relative"
        >
          <div className="absolute -top-2 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">AI</div>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-black uppercase text-xs tracking-widest">
            {language === 'en' ? 'Need Help?' : 'मद्दत चाहिन्छ?'}
          </span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
