import { motion } from 'motion/react';
import { User, Package, Settings, LogOut, ChevronRight } from 'lucide-react';

export default function Profile() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen text-[#0a192f] py-24 selection:bg-[#0a192f] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tighter uppercase text-[#0a192f]">
            Dossier.
          </h1>
          <div className="w-24 h-[1px] bg-[#1e3a8a] mb-8"></div>
          <p className="text-slate-500 max-w-xl text-lg font-light">
            Welcome back, Client 007. Manage your preferences, orders, and bespoke measurements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-2"
          >
            {[
              { icon: User, label: "Personal Details", active: true },
              { icon: Package, label: "Order History", active: false },
              { icon: Settings, label: "Preferences", active: false },
              { icon: LogOut, label: "Sign Out", active: false }
            ].map((item, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center justify-between p-4 transition-colors duration-300 ${
                  item.active 
                    ? 'bg-[#0a192f] text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0a192f] hover:text-[#0a192f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                {item.active && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-9"
          >
            <div className="bg-white border border-slate-200 p-10 md:p-14">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-tight mb-10 text-[#0a192f]">Personal Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1e3a8a] mb-2">Full Name</label>
                  <p className="text-lg border-b border-slate-200 pb-2">James Bond</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1e3a8a] mb-2">Email Address</label>
                  <p className="text-lg border-b border-slate-200 pb-2">007@mi6.gov.uk</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1e3a8a] mb-2">Phone Number</label>
                  <p className="text-lg border-b border-slate-200 pb-2">+44 20 7946 0958</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1e3a8a] mb-2">Member Since</label>
                  <p className="text-lg border-b border-slate-200 pb-2">October 2026</p>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold uppercase tracking-tight mb-8 text-[#0a192f] pt-8 border-t border-slate-200">Recent Acquisitions</h2>
              
              <div className="space-y-4">
                {[
                  { id: "ORD-001", date: "Oct 12, 2026", item: "Navy Cashmere Overcoat", status: "Delivered" },
                  { id: "ORD-002", date: "Nov 05, 2026", item: "Silk Tuxedo Shirt", status: "Processing" }
                ].map((order, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-slate-200 hover:border-[#0a192f] transition-colors">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1e3a8a] mb-1">{order.id}</p>
                      <p className="text-lg font-serif">{order.item}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                      <p className="text-sm text-slate-500 mb-1">{order.date}</p>
                      <p className={`text-xs font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-600' : 'text-amber-600'}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
