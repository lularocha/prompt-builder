"use client";

import { useState, useEffect } from "react";

export function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the element is mounted before animating
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#000085] text-white text-sm font-semibold px-4 py-1 rounded-full transition-colors md:hover:bg-white md:hover:text-[#000085]"
      >
        Learn +
      </button>

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleClose}
        >
          <div
            className={`bg-[#1e1e23] text-white rounded-lg p-8 max-w-lg mx-4 w-full transition-all duration-300 ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">Learn More</h2>
              <button
                onClick={handleClose}
                className="text-white/60 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-orange-500 pt-2">
                  System Prompt
                </h3>
                <p>
                  Define reusable AI behavior: expertise and rules that apply
                  across tasks. System Prompts can also be done with CLAUDE.md
                  or AGENTS.md files.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-orange-500 pt-2">
                  User Prompt
                </h3>
                <p>
                  Define the specific task, requirements, and technologies. User
                  Prompts can also be done with PDR.md files.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-orange-500 pt-2">
                  Learn by doing
                </h3>
                <p>
                  There are many prompt techniques out there, do your own
                  research and experiment yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
