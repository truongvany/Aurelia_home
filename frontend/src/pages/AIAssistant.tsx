import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage } from '../types';
import { api } from '../lib/api';

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: 'msg-1',
      sender: 'ai',
      text: 'Welcome to your personal Aurelia Home styling session. I am your AI Tailor. Are you looking for a specific garment, or would you like recommendations for an upcoming occasion?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const newUserMsg: ChatMessage = {
      _id: `msg-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    try {
      const payload = await api.sendChatMessage({
        message: newUserMsg.text,
        conversationId
      });
      setConversationId(payload.conversationId);
      setMessages(prev => [
        ...prev,
        {
          _id: payload.aiMessage._id,
          sender: 'ai',
          text: payload.aiMessage.text,
          timestamp: new Date(payload.aiMessage.createdAt)
        }
      ]);
    } catch (error) {
      console.error('Chat failed', error);
    }
  };

  const suggestions = [
    "I need an outfit for a summer wedding.",
    "Show me your best cashmere coats.",
    "How should I style a navy turtleneck?",
    "What are the essentials for a minimalist wardrobe?"
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-[90vh] py-16 selection:bg-[#0a192f] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 tracking-tighter uppercase text-[#0a192f] flex items-center gap-4">
            AI Tailor.
            <Cpu className="h-10 w-10 text-[#1e3a8a]" />
          </h1>
          <div className="w-24 h-[1px] bg-[#1e3a8a] mb-6"></div>
          <p className="text-slate-500 max-w-xl text-lg font-light">
            Algorithmic precision meets sartorial elegance. Input your parameters.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 flex flex-col md:flex-row h-[600px] shadow-sm"
        >
          {/* Sidebar */}
          <div className="hidden md:flex md:w-1/3 bg-[#0a192f] text-white p-10 flex-col justify-between">
            <div>
              <h2 className="font-serif text-2xl mb-8 uppercase tracking-widest text-blue-50">Session</h2>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-10 font-light">
                Our neural network analyzes your preferences against our catalog to generate optimal styling configurations.
              </p>
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1e3a8a] mb-6">Quick Inputs</h3>
              <div className="space-y-0">
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="block w-full text-left text-sm text-blue-100 hover:text-white hover:bg-white/5 transition-colors py-4 border-b border-white/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-[10px] text-blue-400/50 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Online
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-4`}>
                    <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${
                      msg.sender === 'user' ? 'bg-slate-100 text-[#0a192f]' : 'bg-[#0a192f] text-white'
                    }`}>
                      {msg.sender === 'user' ? <span className="text-xs font-bold uppercase">Usr</span> : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className={`p-5 text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-slate-100 text-[#0a192f]' 
                        : 'bg-white text-[#0a192f] border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter parameters..."
                  className="w-full bg-transparent border-b border-slate-300 py-4 pl-2 pr-16 text-[#0a192f] text-sm focus:outline-none focus:border-[#0a192f] transition-all placeholder-slate-400"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0a192f] text-white flex items-center justify-center hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 ml-1" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
