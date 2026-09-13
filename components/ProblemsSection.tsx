"use client";

import React from "react";
import { Zap, Smartphone, Search, LineChart, TrendingDown, Smile, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { appContent } from "@/constants/content";
import { staggerContainerVariants, staggerItemVariants } from "./ScrollReveal";

const iconMap = {
  Zap,
  Smartphone,
  Search,
  LineChart,
  TrendingDown,
  Smile,
};

export default function ProblemsSection() {
  const { badge, title, description, problems } = appContent.problems;

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#f8f9fa] border-y border-zinc-200/60 overflow-hidden">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Section Header - hiện lần lượt badge, title, description */}
        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
          custom={{ stagger: 0.08 }}
          className="max-w-[680px] mb-12 space-y-3.5"
        >
          <motion.div variants={staggerItemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 rounded-full border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </motion.div>

          <motion.h2 variants={staggerItemVariants} className="typography-display-lg text-zinc-950">
            {title}
          </motion.h2>

          <motion.p variants={staggerItemVariants} className="typography-body text-zinc-600">
            {description}
          </motion.p>
        </motion.div>

        {/* Problems Cards Grid - hiện lần lượt từng card */}
        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
          custom={{ stagger: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {problems.map((item, index) => {
            const IconComponent = iconMap[item.iconName];
            return (
              <motion.div 
                key={index}
                variants={staggerItemVariants}
                className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-7 space-y-4 hover:border-zinc-300 hover:shadow-card card-hover-lift"
              >
                {/* Icon box with subtle background */}
                <div className="p-3 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-xl w-fit flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-rose-500" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-950 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center gap-2 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Được giải quyết triệt để tại Hưng Dev Studio</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
