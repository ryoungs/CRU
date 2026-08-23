const track = document.getElementById('slideTrack');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

// Calculate distance dynamically based on card size + gap width
const getScrollAmount = () => {
  const card = track.querySelector('.slide-card');
  const style = window.getComputedStyle(track);
  const gap = parseInt(style.gap) || 0;
  return card.offsetWidth + gap;
};

// Event Listeners for arrow click movement
nextBtn.addEventListener('click', () => {
  track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
});
  

