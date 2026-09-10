"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { appContent } from "@/constants/content";

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { badge, title, description, steps } = appContent.workflow;

  return (
    <section id="quy-trinh" className="relative w-full py-section bg-surface-tile-2 text-white select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10">
        
        {/* Section Header */}
        <div className="max-w-[720px] mb-12 space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#2997ff] bg-white/5 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
            <span>{badge}</span>
          </div>

          {/* Heading */}
          <h2 className="typography-display-lg text-white">
            {title}
          </h2>

          {/* Description */}
          <p className="typography-body text-[#cccccc]">
            {description}
          </p>
        </div>

        {/* Workflow Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Steps List (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-3.5">
            {steps.map((step, index) => {
              const isSelected = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border text-left select-none transition-all duration-300 ${
                    isSelected
                      ? "bg-[#1d1d1f] border-[#2997ff] text-[#2997ff]"
                      : "bg-surface-tile-3 border-white/5 text-[#cccccc] hover:border-white/20"
                  } cursor-pointer apple-active-scale`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`typography-caption-strong font-bold ${
                      isSelected ? "text-[#2997ff]" : "text-[#7a7a7a]"
                    }`}>
                      {step.number}
                    </span>
                    <span className="typography-caption-strong text-white">
                      {step.title}
                    </span>
                  </span>
                  <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${
                    isSelected ? "translate-x-0.5 -translate-y-0.5 text-[#2997ff]" : "text-[#7a7a7a]"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Step Details Panel (Spans 7 columns) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1d1d1f] border border-white/5 rounded-lg p-6 sm:p-8 space-y-5 h-full min-h-[220px] flex flex-col justify-between transition-all duration-300">
              
              <div className="space-y-4">
                {/* Step indicator */}
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-surface-tile-3 border border-white/5 text-[#2997ff] flex items-center justify-center text-sm font-bold">
                    {steps[activeStep].number}
                  </span>
                  <h3 className="typography-body-strong text-white">
                    {steps[activeStep].title}
                  </h3>
                </div>

                {/* Description */}
                <p className="typography-caption text-[#cccccc] leading-relaxed">
                  {steps[activeStep].desc}
                </p>
              </div>

              {/* Bottom detail boxes */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-white/5">
                {steps[activeStep].details.map((detail, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-surface-tile-3 border border-white/5 rounded-lg text-center"
                  >
                    <span className="typography-micro-legal text-[#cccccc] font-normal">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
