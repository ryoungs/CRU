document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('slideTrack');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');

  // Verify elements exist in your console to prevent silent failures
  if (!track || !nextBtn || !prevBtn) {
    console.error('Slider elements missing from DOM!');
    return;
  }

  const getScrollAmount = () => {
    const card = track.querySelector('.slide-card');
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 0;
    return (card ? card.offsetWidth : 300) + gap;
  };

nextBtn.addEventListener('click', () => {
  // Check if the user has reached the end of the scroll container
  const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;

  if (isAtEnd) {
    // Loop back to the very first card
    track.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    // Otherwise, scroll to the next card normally
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  }
});


  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
});
const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  navToggle.addEventListener('click', () => {
    // Open/Close the mobile drop-down menu drawer
    navMenu.classList.toggle('active');
    
    // Animate the hamburger button lines into a close "X" mark
    navToggle.classList.toggle('open');
    
    // Update accessibility state for screen readers
    const isOpen = navToggle.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Optional: Close menu instantly if a mobile navigation link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });