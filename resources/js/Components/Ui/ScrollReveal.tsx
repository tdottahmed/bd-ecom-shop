import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'zoom-in';
    duration?: string;
    delay?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className = '',
    animation = 'fade-up',
    duration = 'duration-700',
    delay = 'delay-0',
    threshold = 0.1,
    triggerOnce = true,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) observer.unobserve(element);
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' },
        );

        observer.observe(element);
        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold, triggerOnce]);

    const getAnimationClasses = () => {
        switch (animation) {
            case 'fade-up':
                return isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6';
            case 'fade-in':
                return isVisible ? 'opacity-100' : 'opacity-0';
            case 'fade-left':
                return isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-6';
            case 'fade-right':
                return isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-6';
            case 'zoom-in':
                return isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-[0.97]';
            default:
                return isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6';
        }
    };

    return (
        <div
            ref={ref}
            /*
             * will-change-transform promotes the element to its own compositor
             * layer before the animation starts, preventing it from causing
             * repaints or layout shifts in sibling/parent elements.
             */
            className={`transition-all ease-out will-change-transform ${duration} ${delay} ${getAnimationClasses()} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
