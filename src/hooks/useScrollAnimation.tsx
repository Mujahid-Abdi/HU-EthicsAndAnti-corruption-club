import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
      '.scroll-fade-up, .scroll-fade-up-delay, .scroll-fade-up-slow, .scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Initialize elements on mount
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-fade-up, .scroll-fade-up-delay, .scroll-fade-up-slow');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-8');
    });
  }, []);
};
