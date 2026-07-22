class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.words = options.words || [];
    this.wait = options.wait || 2000;
    this.typeSpeed = options.typeSpeed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    
    this.txt = '';
    this.wordIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;

    // Set ARIA attributes for accessibility
    this.element.setAttribute('aria-live', 'polite');
    this.element.setAttribute('aria-atomic', 'true');
    
    this.tick();
  }

  tick() {
    if (!this.words.length) return;

    const currentIdx = this.wordIndex % this.words.length;
    const fullTxt = this.words[currentIdx];

    // Determine state and update text
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Render safely using textContent to prevent XSS
    this.element.textContent = this.txt;

    // Calculate dynamic speed
    let currentSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    // Add slight natural variance to typing speed
    if (!this.isDeleting) {
      currentSpeed += Math.random() * 40 - 20; 
    }

    // State transition logic
    if (!this.isDeleting && this.txt === fullTxt) {
      // Pause at full word
      currentSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      // Pause before starting next word
      currentSpeed = 500;
    }

    this.timeoutId = setTimeout(() => this.tick(), currentSpeed);
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const targetElement = document.querySelector('[data-typewriter]');
  
  if (targetElement) {
    // Read configurations from data attributes or fall back to defaults
    const words = JSON.parse(targetElement.getAttribute('data-typewriter-words') || '[]');
    const wait = parseInt(targetElement.getAttribute('data-typewriter-wait') || '2000', 10);
    const typeSpeed = parseInt(targetElement.getAttribute('data-typewriter-speed') || '100', 10);
    
    new Typewriter(targetElement, {
      words,
      wait,
      typeSpeed,
      deleteSpeed: typeSpeed / 2
    });
  }
});