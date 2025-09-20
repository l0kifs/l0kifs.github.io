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
        case 'playwright':
          fallbackContent = 'PW';
          fallbackColor = '#2EAD33';
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
        case 'github':
          fallbackContent = 'GH';
          fallbackColor = '#181717';
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
        case 'csharp':
          fallbackContent = 'C#';
          fallbackColor = '#239120';
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
        case 'graylog':
          fallbackContent = 'GL';
          fallbackColor = '#FF3633';
          break;
        case 'jira':
          fallbackContent = 'JR';
          fallbackColor = '#0052CC';
          break;
        case 'qase':
          fallbackContent = 'Q';
          fallbackColor = '#4F46E5';
          break;
        case 'allure':
          fallbackContent = 'AT';
          fallbackColor = '#FF6B35';
          break;
        case 'zephyr':
          fallbackContent = 'Z';
          fallbackColor = '#0052CC';
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