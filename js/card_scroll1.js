document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('slideTrack');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');

  // Verify elements exist in your console to prevent silent failures
  if (!track || !nextBtn || !prevBtn) {
    console.error('Slider elements missing from DOM!');
    return;
  }

  const AUTO_SCROLL_MS = 3000;

  const getScrollAmount = () => {
    const card = track.querySelector('.slide-card');
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 0;
    return (card ? card.offsetWidth : 300) + gap;
  };

  // Advance one card, looping back to the first card at the end
  const goNext = () => {
    const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;

    if (isAtEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  };

  // --- Auto-scroll -------------------------------------------------------

  let timer = null;
  let isHovering = false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopAuto = () => {
    clearInterval(timer);
    timer = null;
  };

  const startAuto = () => {
    stopAuto();
    if (reduceMotion || isHovering || document.hidden) return;
    timer = setInterval(goNext, AUTO_SCROLL_MS);
  };

  // Pause while the mouse is over the cards or either chevron
  [track, nextBtn, prevBtn].forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovering = true;
      stopAuto();
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      startAuto();
    });
  });

  // Pause while the browser tab is in the background
  document.addEventListener('visibilitychange', startAuto);

  // --- Chevrons (same behavior as before) ---------------------------------

  nextBtn.addEventListener('click', () => {
    goNext();
    startAuto(); // restart the 3 s countdown after a manual click
  });

  prevBtn.addEventListener('click', () => {
    goPrev();
    startAuto();
  });

  startAuto();
});

// --- Mobile navigation menu ------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    // Open/Close the mobile drop-down menu drawer
    navMenu.classList.toggle('active');

    // Animate the hamburger button lines into a close "X" mark
    navToggle.classList.toggle('open');

    // Update accessibility state for screen readers
    const isOpen = navToggle.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu instantly if a mobile navigation link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
});