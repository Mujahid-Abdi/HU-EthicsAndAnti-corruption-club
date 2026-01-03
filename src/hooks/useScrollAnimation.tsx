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

    const observeElements = () => {
      const elements = document.querySelectorAll(
        '.scroll-fade-up, .scroll-fade-up-delay, .scroll-fade-up-slow, .scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
      );
      elements.forEach((el) => {
        observer.observe(el);
      });
    };

    // Initial scan
    observeElements();

    // Set up MutationObserver to watch for new elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
