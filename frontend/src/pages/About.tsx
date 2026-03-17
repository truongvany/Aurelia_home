import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen text-[#0a192f] selection:bg-[#0a192f] selection:text-white">
      
      {/* Massive Hero Typography */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-serif text-[15vw] md:text-[12vw] leading-[0.85] tracking-tighter uppercase text-[#0a192f]">
            Aurelia.
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8">
            <div className="w-24 h-[2px] bg-[#1e3a8a]"></div>
            <p className="max-w-md text-lg md:text-xl text-slate-600 font-light leading-relaxed text-left md:text-right">
              We don't follow trends. We engineer garments that outlast them. A study in minimalism, precision, and oceanic depth.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Split Layout Section */}
      <section className="py-24 border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            
            {/* Sticky Left Column */}
            <div className="md:sticky top-32 h-fit">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6 text-[#0a192f]"
              >
                The Ethos
              </motion.h2>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#1e3a8a]">Est. 2026 — New York</p>
            </div>

            {/* Scrolling Right Column */}
            <div className="space-y-20">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="text-6xl font-serif text-slate-300 mb-6">01</div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#0a192f]">Reduction</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  True elegance is found in what is removed, not what is added. We strip away the superfluous to reveal the essential structure of menswear. Clean lines, hidden seams, and absolute structural integrity.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="text-6xl font-serif text-slate-300 mb-6">02</div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#0a192f]">Materiality</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Fabric dictates form. We source exclusively from historic mills in Biella and the Scottish Highlands. Unblended cashmere, heavy-weight silks, and raw wools that develop character with wear.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="text-6xl font-serif text-slate-300 mb-6">03</div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#0a192f]">Permanence</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  An Aurelia garment is not bought for a season; it is acquired for a lifetime. We reject the cycle of fast fashion in favor of enduring style and indestructible construction.
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Brutalist Image / Quote */}
      <section className="py-32 bg-[#0a192f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl max-w-4xl mx-auto leading-tight text-blue-50">
              "PERFECTION IS ACHIEVED NOT WHEN THERE IS NOTHING MORE TO ADD, BUT WHEN THERE IS NOTHING LEFT TO TAKE AWAY."
            </h2>
            <p className="mt-12 text-sm uppercase tracking-[0.3em] text-blue-300">Antoine de Saint-Exupéry</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

