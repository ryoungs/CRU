document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('slideTrack');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');

  // Verify elements exist in your console to prevent silent failures
  if (!track || !nextBtn || !prevBtn) {
    console.error('Slider elements missing from DOM!');
    return;
  }

  // --- Settings ------------------------------------------------------------

  const AUTO_SCROLL_MS = 3500; // time between automatic advances
  const FADE_MS = 2000;         // crossfade length
  const SLIDE_MS = 750;        // slide-into-place length
  const SLIDE_PX = 28;         // how far the new cards travel as they settle
  const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The overlay (old view) is positioned against the track's parent
  const stage = track.parentElement;
  if (getComputedStyle(stage).position === 'static') {
    stage.style.position = 'relative';
  }

  const getScrollAmount = () => {
    const card = track.querySelector('.slide-card');
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 0;
    return (card ? card.offsetWidth : 300) + gap;
  };

  const maxScroll = () => track.scrollWidth - track.clientWidth;

  // --- Crossfade transition ------------------------------------------------

  let busy = false;

  // Snapshot the current view as a non-interactive overlay
  const makeOverlay = () => {
    const overlay = track.cloneNode(true);
    overlay.removeAttribute('id');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    overlay.querySelectorAll('a, button, input, select, textarea, [tabindex]')
      .forEach(el => el.setAttribute('tabindex', '-1'));

    const trackBox = track.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();

    Object.assign(overlay.style, {
      position: 'absolute',
      left: `${trackBox.left - stageBox.left + stage.scrollLeft}px`,
      top: `${trackBox.top - stageBox.top + stage.scrollTop}px`,
      width: `${trackBox.width}px`,
      height: `${trackBox.height}px`,
      margin: '0',
      pointerEvents: 'none',
      zIndex: '1',
      scrollSnapType: 'none',
      scrollBehavior: 'auto'
    });

    stage.appendChild(overlay);
    overlay.scrollLeft = track.scrollLeft; // match the old position exactly
    return overlay;
  };

  // direction: 1 = new cards arrive from the right and settle left,
  //           -1 = they arrive from the left and settle right
  const transitionTo = (targetLeft, direction = 1) => {
    targetLeft = Math.max(0, Math.min(targetLeft, maxScroll()));
    if (busy || Math.abs(targetLeft - track.scrollLeft) < 1) return;

    if (reduceMotion) {
      track.scrollTo({ left: targetLeft, behavior: 'auto' });
      return;
    }

    busy = true;
    const overlay = makeOverlay();

    // Jump the real track to its new position instantly, underneath the overlay
    track.scrollTo({ left: targetLeft, behavior: 'auto' });

    // Old view fades out
    const fadeOut = overlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: FADE_MS, easing: 'ease-in-out', fill: 'forwards' }
    );

    // New view fades in while sliding slightly into place
    const fadeIn = track.animate(
      [
        { opacity: 0, transform: `translateX(${SLIDE_PX * direction}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      { duration: SLIDE_MS, easing: EASE }
    );

    Promise.all([fadeOut.finished, fadeIn.finished])
      .catch(() => {})
      .finally(() => {
        overlay.remove();
        busy = false;
      });
  };

  // Advance one card, looping back to the first card at the end
  const goNext = () => {
    const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    transitionTo(isAtEnd ? 0 : track.scrollLeft + getScrollAmount(), 1);
  };

  const goPrev = () => {
    transitionTo(track.scrollLeft - getScrollAmount(), -1);
  };

  // --- Auto-advance --------------------------------------------------------

  let timer = null;
  let isHovering = false;

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

  // --- Chevrons ------------------------------------------------------------

  nextBtn.addEventListener('click', () => {
    goNext();
    startAuto(); // restart the countdown after a manual click
  });

  prevBtn.addEventListener('click', () => {
    goPrev();
    startAuto();
  });

  startAuto();
});

// --- Mobile navigation menu --------------------------------------------------

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