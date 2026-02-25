import React from 'react';

interface AnimatedAvatarProps {
    gender?: 'MASCULINO' | 'FEMENINO';
    className?: string;
}

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ gender = 'MASCULINO', className = '' }) => {
    const isGirl = gender === 'FEMENINO';

    // Base style configurations to mix with user's Tailwind classes
    const containerClasses = `relative overflow-hidden bg-slate-100 flex items-center justify-center ${className}`;

    if (isGirl) {
        return (
            <div className={containerClasses}>
                <style>
                    {`
            @keyframes floatGirl {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-4px) rotate(2deg); }
            }
            @keyframes blinkGirl {
              0%, 96%, 98%, 100% { transform: scaleY(1); }
              97%, 99% { transform: scaleY(0.1); }
            }
            .animate-float-girl { animation: floatGirl 4s ease-in-out infinite; transform-origin: center bottom; }
            .animate-blink-girl { animation: blinkGirl 5s infinite; transform-origin: center; }
          `}
                </style>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1 animate-float-girl">
                    {/* Back Hair */}
                    <path d="M25 40 C20 70 30 95 40 95 C45 95 55 95 60 95 C70 95 80 70 75 40 Z" fill="#4a3b32" />

                    {/* Face */}
                    <circle cx="50" cy="50" r="25" fill="#ffd1b3" />

                    {/* Blushes */}
                    <circle cx="35" cy="55" r="4" fill="#ff9999" opacity="0.6" />
                    <circle cx="65" cy="55" r="4" fill="#ff9999" opacity="0.6" />

                    {/* Eyes with Blink Animation */}
                    <g className="animate-blink-girl">
                        <circle cx="40" cy="48" r="3.5" fill="#333333" />
                        <circle cx="60" cy="48" r="3.5" fill="#333333" />
                        {/* Eye sparkle */}
                        <circle cx="41" cy="47" r="1" fill="white" />
                        <circle cx="61" cy="47" r="1" fill="white" />
                    </g>

                    {/* Smile */}
                    <path d="M43 60 Q50 66 57 60" stroke="#cc8866" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Front Hair / Bangs */}
                    <path d="M25 45 C25 25 75 25 75 45 C75 35 60 25 50 25 C40 25 25 35 25 45 Z" fill="#3d2f26" />
                    <path d="M50 25 C60 30 70 40 75 45 C80 30 65 20 50 15 C35 20 20 30 25 45 C30 40 40 30 50 25 Z" fill="#4a3b32" />

                    {/* Hair Bow */}
                    <path d="M70 35 C75 30 85 30 85 40 C85 45 75 45 70 40 Z" fill="#f43f5e" />
                    <path d="M70 35 C65 30 55 30 55 40 C55 45 65 45 70 40 Z" fill="#f43f5e" />
                    <circle cx="70" cy="38" r="3" fill="#e11d48" />
                </svg>
            </div>
        );
    }

    // MASCULINO (Boy)
    return (
        <div className={containerClasses}>
            <style>
                {`
          @keyframes floatBoy {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3px) rotate(-2deg); }
          }
           @keyframes blinkBoy {
            0%, 96%, 98%, 100% { transform: scaleY(1); }
            97%, 99% { transform: scaleY(0.1); }
          }
          .animate-float-boy { animation: floatBoy 3.5s ease-in-out infinite; transform-origin: center bottom; }
          .animate-blink-boy { animation: blinkBoy 6s infinite; transform-origin: center; }
        `}
            </style>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1 animate-float-boy">
                {/* Ears */}
                <circle cx="25" cy="50" r="5" fill="#fcdbb3" />
                <circle cx="75" cy="50" r="5" fill="#fcdbb3" />

                {/* Face */}
                <circle cx="50" cy="50" r="25" fill="#ffe0c2" />

                {/* Eyes with Blink Animation */}
                <g className="animate-blink-boy">
                    <circle cx="40" cy="48" r="3" fill="#2d3748" />
                    <circle cx="60" cy="48" r="3" fill="#2d3748" />
                </g>

                {/* Freckles (optional boy detail) */}
                <circle cx="36" cy="54" r="1.5" fill="#e2b896" opacity="0.8" />
                <circle cx="40" cy="55" r="1.2" fill="#e2b896" opacity="0.8" />
                <circle cx="60" cy="55" r="1" fill="#e2b896" opacity="0.8" />
                <circle cx="64" cy="54" r="1.5" fill="#e2b896" opacity="0.8" />

                {/* Smile */}
                <path d="M42 61 Q50 67 58 61" stroke="#cc9977" strokeWidth="2.5" strokeLinecap="round" />

                {/* Hair Base */}
                <path d="M25 45 C25 20 75 20 75 45 C75 30 65 15 50 15 C35 15 25 30 25 45 Z" fill="#292524" />
                <path d="M22 40 C25 20 50 10 78 40 C75 15 50 5 22 40 Z" fill="#44403c" />

                {/* Hair Tuft / Spikes */}
                <path d="M45 15 L50 8 L55 15 Z" fill="#44403c" />
                <path d="M38 18 L42 10 L48 18 Z" fill="#44403c" />
                <path d="M52 18 L58 10 L62 18 Z" fill="#44403c" />
            </svg>
        </div>
    );
};
