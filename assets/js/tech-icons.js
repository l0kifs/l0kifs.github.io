// Handle tech icon image loading errors
document.addEventListener('DOMContentLoaded', function() {
  const techIcons = document.querySelectorAll('.tech-icon img');
  
  techIcons.forEach(img => {
    const iconContainer = img.parentElement;
    iconContainer.classList.add('loading');
    
    img.addEventListener('load', function() {
      iconContainer.classList.remove('loading');
      iconContainer.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
      const techItem = this.closest('.tech-item');
      const techName = techItem.getAttribute('data-tech');
      
      iconContainer.classList.remove('loading');
      
      // Remove the failed image
      this.remove();
      
      // Create fallback based on tech name
      let fallbackContent = '';
      let fallbackColor = '';
      
      switch(techName) {
        case 'selenium':
          fallbackContent = 'Se';
          fallbackColor = '#43B02A';
          break;
        case 'pytest':
          fallbackContent = 'Py';
          fallbackColor = '#0A9EDC';
          break;
        case 'testng':
          fallbackContent = 'TNG';
          fallbackColor = '#DC382D';
          break;
        case 'cucumber':
          fallbackContent = 'Cu';
          fallbackColor = '#23D96C';
          break;
        case 'jenkins':
          fallbackContent = 'Je';
          fallbackColor = '#D33833';
          break;
        case 'docker':
          fallbackContent = 'Do';
          fallbackColor = '#2496ED';
          break;
        case 'git':
          fallbackContent = 'Git';
          fallbackColor = '#F05032';
          break;
        case 'kubernetes':
          fallbackContent = 'K8s';
          fallbackColor = '#326CE5';
          break;
        case 'python':
          fallbackContent = 'Py';
          fallbackColor = '#3776AB';
          break;
        case 'java':
          fallbackContent = 'Jv';
          fallbackColor = '#ED8B00';
          break;
        case 'javascript':
          fallbackContent = 'JS';
          fallbackColor = '#F7DF1E';
          break;
        case 'bash':
          fallbackContent = 'Sh';
          fallbackColor = '#4EAA25';
          break;
        case 'grafana':
          fallbackContent = 'Gr';
          fallbackColor = '#F46800';
          break;
        case 'prometheus':
          fallbackContent = 'Pr';
          fallbackColor = '#E6522C';
          break;
        case 'postman':
          fallbackContent = 'PM';
          fallbackColor = '#FF6C37';
          break;
        case 'gitlab':
          fallbackContent = 'GL';
          fallbackColor = '#FC6D26';
          break;
        case 'junit':
          fallbackContent = 'JU';
          fallbackColor = '#25A162';
          break;
        default:
          fallbackContent = techName.substring(0, 2).toUpperCase();
          fallbackColor = '#666666';
      }
      
      // Set fallback styles
      iconContainer.style.background = fallbackColor;
      iconContainer.innerHTML = `<span style="color: white; font-size: 8px; font-weight: bold;">${fallbackContent}</span>`;
    });
  });
});