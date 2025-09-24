// Simple modern badge-style tech stack
document.addEventListener('DOMContentLoaded', function() {
  
  // Add subtle animation to tech badges
  const techBadges = document.querySelectorAll('.tech-badge');
  
  // Staggered animation entrance
  techBadges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      badge.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, index * 50); // Staggered delay
  });
  
  // Add click ripple effect
  techBadges.forEach(badge => {
    badge.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.pointerEvents = 'none';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add keyframes for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .tech-badge {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);