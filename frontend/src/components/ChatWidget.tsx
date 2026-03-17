import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../lib/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: 'msg-1',
      sender: 'ai',
      text: 'Welcome to Aurelia Home. I am your personal AI Stylist. How may I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const handleSend = async () => {
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="glass-dark w-80 sm:w-96 h-[500px] rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-white/10">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-charcoal/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">A</span>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">AI Stylist</h3>
                <p className="text-gold text-xs">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gold text-white rounded-br-sm' 
                    : 'bg-white/10 text-gray-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-charcoal/50">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold hover:text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-charcoal text-gold rounded-full flex items-center justify-center shadow-xl hover:bg-gold hover:text-white transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
