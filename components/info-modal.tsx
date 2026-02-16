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
                className="bg-[#000085] text-white text-lg px-4 py-1 rounded-md transition-colors md:hover:bg-white md:hover:text-[#000085]"
            >
                Learn +
            </button>

            {isOpen && (
                <div
                    className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={handleClose}
                >
                    <div
                        className={`bg-[#1e1e23] text-white rounded-lg p-8 max-w-lg mx-4 w-full transition-all duration-300 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
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
                                <h3 className="text-lg font-semibold mb-2 text-orange-500">System Prompt</h3>
                                <p>
                                    Define reusable AI behavior: expertise and rules that apply across tasks.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-orange-500">User Prompt</h3>
                                <p>
                                    Define the specific task, requirements, and technologies.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-orange-500">Learn by doing</h3>
                                <p>
                                    There are many prompt techniques out there, and the best way to learn is to experiment yourself. Note that CLAUDE.md files are commonly used to create both System and User Prompts.
                                </p>
                            </div>

                            <p>
                                You can learn more about prompting in my Claude Code Guide website. Check out:
                            </p>

                            <p>
                                <a
                                    href="https://ccguide.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-400 hover:underline"
                                >
                                    Claude Code Guide
                                </a>
                            </p>

                            <p>
                                <a
                                    href="https://ccguide.vercel.app/#advanced/claude-md-guide.md"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-400 hover:underline"
                                >
                                    CLAUDE.md
                                </a>
                            </p>

                            <p>
                                <a
                                    href="https://ccguide.vercel.app/#reference/prompts.md"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-400 hover:underline"
                                >
                                    Prompts for Beginners
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
