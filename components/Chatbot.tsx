
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Language } from '../translations';

interface Message {
  role: 'user' | 'model';
  text: string;
  grounding?: any[];
}

interface ChatbotProps {
  language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: language === 'en' ? 'Hello! I am your Daraz AI assistant. I can help with orders or check live prices for you. How can I help?' : 'नमस्ते! म तपाईंको दराज AI सहायक हुँ। म तपाईंलाई कसरी मद्दत गर्न सक्छु?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          systemInstruction: "You are a professional customer support agent for 'Daraz Clone'. You have LIVE WEB SEARCH access. Use it to check current market prices, availability of products in Nepal, and exchange rates if asked. Keep responses helpful and professional.",
          tools: [{ googleSearch: {} }],
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      setMessages(prev => [...prev, { role: 'model', text: aiText, grounding: grounding }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, my real-time search is currently offline. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[600px] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-slideUp">
          <div className="bg-[#F85606] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black">AI</div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Daraz Assistant</p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-bold uppercase tracking-tighter">Real-Time Search Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-sm text-sm shadow-sm ${m.role === 'user' ? 'bg-[#002F6C] text-white' : 'bg-white text-gray-800 border'}`}>
                  {m.text}
                </div>
                {m.grounding && m.grounding.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.grounding.map((chunk, i) => (
                      chunk.web && (
                        <a 
                          key={i} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors font-bold uppercase tracking-tighter"
                        >
                          🔗 {chunk.web.title || 'Source'}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-sm flex gap-2 items-center">
                  <span className="text-[10px] font-black text-orange-500 animate-pulse uppercase">Searching live web...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
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
              placeholder="Ask for prices or support..."
              className="flex-1 border border-gray-200 rounded-sm px-4 py-2 text-sm focus:border-orange-500 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim() || !isKeyConfigured}
              className="bg-[#F85606] text-white p-2 rounded-sm hover:bg-orange-600 disabled:opacity-50"
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
          <div className="absolute -top-2 -right-1 bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg">LIVE</div>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
