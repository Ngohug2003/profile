"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Clock, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { appContent } from "@/constants/content";
import { staggerContainerVariants, staggerItemVariants } from "./ScrollReveal";

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { badge, title, description, steps } = appContent.workflow;

  return (
    <section id="quy-trinh" className="relative w-full py-16 md:py-24 bg-zinc-950 text-white overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10 relative">
        
        {/* Section Header - hiện lần lượt */}
        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
          custom={{ stagger: 0.08 }}
          className="max-w-[680px] mb-14 space-y-3.5"
        >
          <motion.div variants={staggerItemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-400 bg-white/5 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{badge}</span>
          </motion.div>

          <motion.h2 variants={staggerItemVariants} className="typography-display-lg text-white font-display">
            {title}
          </motion.h2>

          <motion.p variants={staggerItemVariants} className="typography-body text-zinc-400">
            {description}
          </motion.p>
        </motion.div>

        {/* Workflow Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Steps List (Spans 5 columns) - hiện lần lượt 4 bước */}
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
            custom={{ stagger: 0.1 }}
            className="lg:col-span-5 space-y-3 flex flex-col justify-center"
          >
            {steps.map((step, index) => {
              const isSelected = activeStep === index;
              return (
                <motion.div key={index} variants={staggerItemVariants}>
                  <button
                    onClick={() => setActiveStep(index)}
                    className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                        : "bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/15 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                        isSelected 
                          ? "bg-blue-600 text-white" 
                          : "bg-white/5 text-zinc-400"
                      }`}>
                        {step.number}
                      </span>
                      <span className={`text-sm font-semibold transition-colors ${
                        isSelected ? "text-white" : "text-zinc-300"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected ? "translate-x-1 text-blue-400" : "text-zinc-600"
                    }`} />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Column: Dynamic Step Details Panel (Spans 7 columns) */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 h-full min-h-[300px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
              
              <div className="space-y-4">
                {/* Step indicator header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-bold font-mono">
                      {steps[activeStep].number}
                    </span>
                    <div>
                      <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider block">
                        Giai đoạn {steps[activeStep].number}
                      </span>
                      <h3 className="text-xl font-bold text-white font-display">
                        {steps[activeStep].title}
                      </h3>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Cam kết đúng tiến độ</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
                  {steps[activeStep].desc}
                </p>
              </div>

              {/* Bottom detail deliverables */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <span>Sản phẩm bàn giao ở bước này:</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {steps[activeStep].details.map((detail, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs text-zinc-200 font-medium">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
