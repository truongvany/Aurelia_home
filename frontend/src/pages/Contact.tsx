import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Private Fitting Request',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        subject: form.subject,
        message: form.message
      });
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'Private Fitting Request',
        message: ''
      });
      alert('Message received. We will be in touch.');
    } catch (error) {
      console.error(error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0a192f] relative overflow-hidden py-24 selection:bg-[#0a192f] selection:text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tighter uppercase text-[#0a192f]">
            Contact.
          </h1>
          <div className="w-24 h-[1px] bg-[#1e3a8a] mb-8"></div>
          <p className="text-slate-500 max-w-xl text-lg font-light">
            For bespoke inquiries, private fittings, or exclusive support. Reach out to our concierge desk.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left: Contact Info Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-4"
          >
            {[
              { icon: Phone, title: "Direct Line", desc: "+1 (800) 123-4567", sub: "Mon - Fri, 09:00 - 18:00 EST" },
              { icon: Mail, title: "Email", desc: "concierge@aurelia.com", sub: "Response within 24 hours" },
              { icon: MapPin, title: "Flagship", desc: "125 Fifth Avenue, NY", sub: "By appointment only" },
              { icon: Clock, title: "Support", desc: "24/7 Concierge", sub: "For VIP clients" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group flex items-start space-x-6 p-6 bg-white border border-slate-200 hover:border-[#0a192f] transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-none bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#0a192f] group-hover:text-white transition-colors duration-300">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1e3a8a] mb-1">{item.title}</h3>
                  <p className="text-lg font-serif mb-1 text-[#0a192f]">{item.desc}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: The Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white p-10 md:p-14 border border-slate-200 relative">
              <h2 className="font-serif text-2xl font-bold mb-10 uppercase tracking-tight text-[#0a192f]">Send Inquiry</h2>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="firstName"
                      required 
                      value={form.firstName}
                      onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-transparent border-b border-slate-300 py-2 text-[#0a192f] focus:outline-none focus:border-[#0a192f] transition-colors peer placeholder-transparent"
                      placeholder="First Name"
                    />
                    <label htmlFor="firstName" className="absolute left-0 top-2 text-sm text-slate-400 uppercase tracking-wider transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1e3a8a] peer-valid:-top-5 peer-valid:text-xs peer-valid:text-slate-500 cursor-text">
                      First Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="lastName"
                      required 
                      value={form.lastName}
                      onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-transparent border-b border-slate-300 py-2 text-[#0a192f] focus:outline-none focus:border-[#0a192f] transition-colors peer placeholder-transparent"
                      placeholder="Last Name"
                    />
                    <label htmlFor="lastName" className="absolute left-0 top-2 text-sm text-slate-400 uppercase tracking-wider transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1e3a8a] peer-valid:-top-5 peer-valid:text-xs peer-valid:text-slate-500 cursor-text">
                      Last Name
                    </label>
                  </div>
                </div>
                
                <div className="relative group">
                  <input 
                    type="email" 
                    id="email"
                    required 
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent border-b border-slate-300 py-2 text-[#0a192f] focus:outline-none focus:border-[#0a192f] transition-colors peer placeholder-transparent"
                    placeholder="Email Address"
                  />
                  <label htmlFor="email" className="absolute left-0 top-2 text-sm text-slate-400 uppercase tracking-wider transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1e3a8a] peer-valid:-top-5 peer-valid:text-xs peer-valid:text-slate-500 cursor-text">
                    Email Address
                  </label>
                </div>

                <div className="relative group pt-2">
                  <select 
                    id="subject" 
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-transparent border-b border-slate-300 py-2 text-[#0a192f] focus:outline-none focus:border-[#0a192f] transition-colors appearance-none cursor-pointer"
                  >
                    <option>Private Fitting Request</option>
                    <option>Order Status</option>
                    <option>Bespoke Tailoring</option>
                    <option>Other Inquiry</option>
                  </select>
                  <label htmlFor="subject" className="absolute left-0 -top-4 text-xs text-[#1e3a8a] uppercase tracking-wider">
                    Subject
                  </label>
                </div>

                <div className="relative group">
                  <textarea 
                    id="message" 
                    rows={4}
                    required 
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-transparent border-b border-slate-300 py-2 text-[#0a192f] focus:outline-none focus:border-[#0a192f] transition-colors peer placeholder-transparent resize-none"
                    placeholder="Message"
                  ></textarea>
                  <label htmlFor="message" className="absolute left-0 top-2 text-sm text-slate-400 uppercase tracking-wider transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1e3a8a] peer-valid:-top-5 peer-valid:text-xs peer-valid:text-slate-500 cursor-text">
                    Your Message
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group flex items-center justify-between w-full px-8 py-5 bg-[#0a192f] text-white font-bold uppercase tracking-widest transition-all hover:bg-[#1e3a8a] disabled:opacity-70 mt-8"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Submit'}</span>
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isSubmitting ? 'translate-x-4 opacity-0' : 'group-hover:translate-x-2'}`} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

