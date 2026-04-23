"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, BarChart3, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const data = [
  { month: "Jan", value: 450000, growth: 2.1 },
  { month: "Feb", value: 462000, growth: 2.7 },
  { month: "Mar", value: 458000, growth: -0.8 },
  { month: "Apr", value: 475000, growth: 3.5 },
  { month: "May", value: 490000, growth: 3.1 },
  { month: "Jun", value: 512000, growth: 4.5 },
  { month: "Jul", value: 525000, growth: 2.5 },
];

export default function MarketInsights() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Text Content */}
          <div className="lg:w-2/5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
                <TrendingUp className="w-3 h-3" />
                Live Market Data
              </div>
              <h2 className="text-4xl md:text-5xl font-heading text-zinc-900 dark:text-white leading-tight mb-6">
                Smarter decisions with <span className="text-emerald-600">real-time</span> insights
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Proptech uses advanced AI models to track millions of data points across global markets, giving you a competitive edge in real estate investment.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: BarChart3, label: "Market Growth", value: "+12.4%" },
                  { icon: PieChart, label: "Asset Accuracy", value: "99.8%" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-900/50 border border-stone-200/50 dark:border-zinc-800/50">
                    <stat.icon className="w-5 h-5 text-emerald-500 mb-3" />
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-3/5 w-full"
          >
            <div className="glass-card-hover p-8 rounded-3xl overflow-hidden relative group">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Property Value Trends</h3>
                  <p className="text-sm text-zinc-500">Global Average (USD)</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>+16.7% YoY</span>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      hide
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#18181b', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Decorative overlays */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
