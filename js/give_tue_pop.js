    document.addEventListener("DOMContentLoaded", () => {
      const popup = document.getElementById("promoPopup");
      const closeBtn = document.getElementById("closePopupBtn");

      // Show popup after 10 seconds (10,000 milliseconds)
      setTimeout(() => {
        popup.classList.add("active");
      }, 10000);

      // Close popup when clicking the 'X' button
      closeBtn.addEventListener("click", () => {
        popup.classList.remove("active");
      });

      // Close popup when clicking outside the image box on the dark background
      popup.addEventListener("click", (event) => {
        if (event.target === popup) {
          popup.classList.remove("active");
        }
      });

      // Close popup when pressing the Escape key
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && popup.classList.contains("active")) {
          popup.classList.remove("active");
        }
      });
    });