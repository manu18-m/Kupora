import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- ATOMIC EMBEDDED INLINE SVGS (CRASH PROTECTION) ---
const SendIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const PaperclipIcon = () => <svg className="w-4 h-4 text-zinc-400 hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;
const ShieldCheckIcon = () => <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const ArrowLeftIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const SearchIcon = () => <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ImageIcon = () => <svg className="w-4 h-4 text-zinc-400 hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

// --- MOCK TELEMETRY CHANNELS ---
const DEMO_CHANNELS = [
  { id: 1, name: 'DevOps_Liquidity_Alpha', role: 'Seller', status: 'online', dealContext: 'Vercel Pro Tier Allocation', unread: 2, initials: 'DA' },
  { id: 2, name: 'indie_hacker_99', role: 'Buyer', status: 'offline', dealContext: 'Supabase $50 Credit Pool', unread: 0, initials: 'IH' },
  { id: 3, name: 'Cloud_Broker_Node', role: 'Seller', status: 'online', dealContext: 'AWS Activate Voucher Bundle', unread: 0, initials: 'CB' },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'them', text: "Greetings. I have verified your requested baseline parameter thresholds for the Vercel infrastructure routing block.", time: "10:14 AM" },
  { id: 2, sender: 'me', text: "Excellent. Is the matching token string fully compatible with existing enterprise environments or is it strictly bound to vanilla workspaces?", time: "10:15 AM" },
  { id: 3, sender: 'them', text: "It is universal. Our synthetic checkout automations tested it cleanly across multi-tenant clusters.", time: "10:16 AM" }
];

export default function ChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [channels] = useState(DEMO_CHANNELS);
  const [activeChannel, setActiveChannel] = useState(DEMO_CHANNELS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Automatically anchors views to message array floors on load/update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulated respondent action sequences
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'them',
          text: "Copy that. Telemetry payload accepted and updated inside your account profile.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-purple-600/5 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

      {/* FIXED CHAT DESKTOP FRAMING BODY CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex gap-6 relative z-10 h-[calc(100vh-20px)] max-h-[850px] my-auto">
        
        {/* LEFT COMPONENT COLUMN: CHAT SIDEBAR LISTING (4-COL GRID EQUIV) */}
        <section className="w-full md:w-[340px] border border-white/5 bg-[#04030f]/60 backdrop-blur-xl rounded-2xl flex flex-col shrink-0 overflow-hidden">
          {/* Sidebar Action Search Header */}
          <div className="p-4 border-b border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/browse')} className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all">
                <ArrowLeftIcon />
              </button>
              <h2 className="text-sm font-mono uppercase tracking-wider font-black text-white">Deals Matrix Messenger</h2>
            </div>
            
            <div className="relative group">
              <span className="absolute left-3.5 top-3"><SearchIcon /></span>
              <input 
                type="text" placeholder="Filter allocation feeds..."
                className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none transition-all placeholder-zinc-700"
              />
            </div>
          </div>

          {/* Active Navigation Queue Stream Rows */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {channels.map(chan => (
              <div
                key={chan.id} onClick={() => setActiveChannel(chan)}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all border ${activeChannel.id === chan.id ? 'bg-white/5 border-white/5 shadow-inner' : 'border-transparent hover:bg-white/[0.01]'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 font-mono font-bold text-xs flex items-center justify-center relative shrink-0 border border-purple-900/30">
                    {chan.initials}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#030014] ${chan.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-xs flex items-center gap-1.5 truncate">
                      {chan.name}
                      {chan.role === 'Seller' && <ShieldCheckIcon />}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">{chan.dealContext}</p>
                  </div>
                </div>

                {chan.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-purple-500 text-black text-[9px] font-mono font-black flex items-center justify-center shrink-0">
                    {chan.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT COMPONENT COLUMN: LIVE MESSAGE CONTAINER FEEDS */}
        <section className="flex-1 border border-white/5 bg-[#04030f]/30 backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden relative">
          
          {/* Thread Subject Action Bar Header */}
          <div className="p-4 border-b border-white/5 bg-[#02010a]/40 backdrop-blur-md flex justify-between items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-white font-bold text-sm tracking-tight">{activeChannel.name}</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{activeChannel.dealContext}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-900/40 px-2.5 py-1 rounded-md uppercase">
              {activeChannel.role} NODE
            </span>
          </div>

          {/* CHAT THREAD DISPLAY FRAME SCROLLER */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map(msg => {
                const isMe = msg.sender === 'me';
                return (
                  <motion.div
                    key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-3.5 px-4 rounded-2xl text-xs font-normal leading-relaxed ${isMe ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-[0_0_25px_rgba(124,58,237,0.15)]' : 'bg-white/5 border border-white/5 text-zinc-300 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 mt-1.5 px-1">{msg.time}</span>
                  </motion.div>
                );
              })}

              {/* ACTIVE TYPING INDICATOR EFFECT TRACKER */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start max-w-[75%] mr-auto">
                  <div className="bg-white/5 border border-white/5 p-3 px-4 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM ACTION BOTTOM TRAY CONTAINER */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#02010a]/40 backdrop-blur-md flex items-center gap-3 px-6">
            <div className="flex gap-2">
              <button type="button" className="p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                <PaperclipIcon />
              </button>
              <button type="button" className="p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/5 text-zinc-500 hover:text-white transition-all hidden sm:block">
                <ImageIcon />
              </button>
            </div>

            <div className="flex-1 relative">
              <input 
                type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                placeholder="Transmit verified data parameter message..."
                className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder-zinc-700"
              />
            </div>

            <button 
              type="submit" disabled={!inputText.trim()}
              className="p-3 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:bg-white/5 disabled:text-zinc-600 shadow-xl font-medium transition-all shrink-0 flex items-center justify-center"
            >
              <SendIcon />
            </button>
          </form>

        </section>

      </main>
    </div>
  );
}