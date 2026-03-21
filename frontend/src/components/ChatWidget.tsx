import { useEffect, useState, useRef } from 'react';
import { MessageSquare, X, Send, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../lib/api';

const STORAGE_KEY = 'kingman_chat_history';
const CONVERSATION_KEY = 'kingman_conversation_id';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const fallback = [
      {
        _id: 'msg-1',
        sender: 'ai' as const,
        text: 'Xin chào, chúc Quý khách một ngày tốt lành! ❤ Đây là King Man, trợ lý ảo của King Man Home. Quý khách muốn King Man hỗ trợ về vấn đề gì ạ?',
        timestamp: new Date()
      }
    ];

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved || saved === 'undefined' || saved === 'null') {
      return fallback;
    }

    try {
      const parsed = JSON.parse(saved) as unknown;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return fallback;
      }

      return parsed
        .filter((item) => item && typeof item === 'object')
        .map((item, index) => {
          const msg = item as Partial<ChatMessage>;
          return {
            _id: typeof msg._id === 'string' ? msg._id : `msg-restored-${index}`,
            sender: msg.sender === 'user' ? 'user' : 'ai',
            text: typeof msg.text === 'string' ? msg.text : '',
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          };
        });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return fallback;
    }
  });

  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(() => {
    const saved = localStorage.getItem(CONVERSATION_KEY);
    if (!saved || saved === 'undefined' || saved === 'null') {
      return undefined;
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (conversationId) {
      localStorage.setItem(CONVERSATION_KEY, conversationId);
    }
  }, [messages, conversationId]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('kingman:open-chat', handleOpen);
    return () => window.removeEventListener('kingman:open-chat', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const renderMessageText = (text: string) => {
    // Regular expression to match both image format (![alt](url)) and link format ([text](url))
    const mdRegex = /(!?)\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mdRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const isImage = match[1] === '!';
      const altOrText = match[2];
      const url = match[3];

      if (isImage) {
        parts.push(
          <div key={match.index} className="my-2 rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-full">
            <img src={url} alt={altOrText} className="w-full h-auto max-h-48 object-cover" />
          </div>
        );
      } else {
        parts.push(
          <a key={match.index} href={url} className="font-semibold text-blue-600 hover:opacity-70 transition-opacity">
            {altOrText}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch sử trò chuyện không?")) {
      const initialMessage = {
        _id: `msg-${Date.now()}`,
        sender: 'ai' as const,
        text: 'Lịch sử trò chuyện đã được xóa. Quý khách muốn King Man hỗ trợ về vấn đề gì ạ?',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      setConversationId(undefined);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CONVERSATION_KEY);
      setInput('');
    }
  };

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
    setIsTyping(true);

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
      setMessages(prev => [...prev, {
        _id: `err-${Date.now()}`,
        sender: 'ai',
        text: "Xin lỗi, hiện tại mình đang gặp sự cố kết nối. Vui lòng thử lại sau.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isExpanded && isOpen 
        ? "top-0 left-0 right-0 bottom-0 bg-white" 
        : "bottom-6 right-6"
    }`}>
      {isOpen ? (
        <div className={`flex flex-col bg-white shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 ${
          isExpanded 
            ? "w-full h-full" 
            : "w-[360px] sm:w-[400px] h-[600px] rounded-2xl"
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                <span className="font-serif font-bold text-lg">A</span>
              </div>
              <div>
                <h3 className="text-black font-semibold text-md tracking-tight">King Man</h3>
                <p className="text-gray-500 text-xs flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={handleClearChat} 
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all"
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all hidden sm:block"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => { setIsOpen(false); setIsExpanded(false); }} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div 
                key={msg._id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-black flex-shrink-0 flex items-center justify-center mr-3 mt-auto shadow-sm">
                    <span className="text-white font-serif font-bold text-xs">A</span>
                  </div>
                )}
                
                <div className={`max-w-[75%] p-4 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-black text-white rounded-2xl rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-100'
                }`}>
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex w-full justify-start animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-black flex-shrink-0 flex items-center justify-center mr-3 mt-auto shadow-sm">
                  <span className="text-white font-serif font-bold text-xs">A</span>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="relative flex items-center shadow-sm rounded-full bg-white border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhắn tin cho King Man..."
                className="w-full bg-transparent py-3.5 pl-5 pr-12 text-black text-sm focus:outline-none placeholder:text-gray-400"
                disabled={isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:bg-gray-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center mt-2.5">
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Powered by King Man AI</span>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center w-14 h-14 bg-black text-white rounded-full justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <MessageSquare className="h-6 w-6 relative z-10" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full z-20"></span>
          
          {/* Hover Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
            Trò chuyện với King Man
            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-4 border-transparent border-l-black"></div>
          </div>
        </button>
      )}
    </div>
  );
}

