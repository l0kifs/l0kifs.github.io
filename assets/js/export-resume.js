/**
 * Resume Export to Markdown
 * 
 * This module provides functionality to export the resume page to a clean Markdown file.
 * It uses the Turndown library for HTML to Markdown conversion with custom rules
 * optimized for resume structure.
 */

class ResumeExporter {
    constructor() {
        this.turndownService = null;
        this.initButton();
        this.loadTurndown();
    }

    /**
     * Load Turndown library from CDN
     */
    loadTurndown() {
        // Check if Turndown is already loaded
        if (typeof TurndownService !== 'undefined') {
            this.initTurndownService();
            return;
        }

        // Load Turndown from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/turndown@7.2.0/dist/turndown.js';
        script.onload = () => {
            this.initTurndownService();
        };
        script.onerror = () => {
            console.error('Failed to load Turndown library');
            this.showNotification('Failed to load export library', 'error');
        };
        document.head.appendChild(script);
    }

    /**
     * Initialize Turndown service with custom rules for resume
     */
    initTurndownService() {
        this.turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            fence: '```',
            emDelimiter: '*',
            strongDelimiter: '**',
            linkStyle: 'inlined'
        });

        // Add custom rules for resume-specific elements
        this.addCustomRules();
    }

    /**
     * Add custom conversion rules optimized for resume structure
     */
    addCustomRules() {
        // Remove unwanted elements (buttons, popups, navigation)
        this.turndownService.remove(['script', 'style', 'noscript', 'button', 'nav', 'footer']);

        // Handle tech badges with icons
        this.turndownService.addRule('techBadge', {
            filter: node => {
                return node.classList && (
                    node.classList.contains('tech-badge') ||
                    node.classList.contains('tech-item') ||
                    node.classList.contains('tech-icon')
                );
            },
            replacement: (content, node) => {
                // Extract just the text content, removing icon images
                const text = node.textContent.trim();
                if (!text) return '';
                
                // For inline tech badges, use backticks
                return `\`${text}\``;
            }
        });

        // Handle experience items
        this.turndownService.addRule('experienceItem', {
            filter: node => {
                return node.classList && node.classList.contains('experience-item');
            },
            replacement: (content, node) => {
                return '\n\n' + content + '\n\n---\n\n';
            }
        });

        // Handle skill categories
        this.turndownService.addRule('skillCategory', {
            filter: node => {
                return node.classList && node.classList.contains('skill-category');
            },
            replacement: (content, node) => {
                return '\n' + content + '\n';
            }
        });

        // Handle hero section
        this.turndownService.addRule('hero', {
            filter: node => {
                return node.classList && node.classList.contains('hero');
            },
            replacement: (content, node) => {
                return content + '\n\n---\n\n';
            }
        });

        // Handle contact info section
        this.turndownService.addRule('contactInfo', {
            filter: node => {
                return node.classList && node.classList.contains('contact-info');
            },
            replacement: (content, node) => {
                return '\n\n## Contact Information\n\n' + content + '\n\n';
            }
        });

        // Remove SVG icons from links but keep the text
        this.turndownService.addRule('removeSvg', {
            filter: 'svg',
            replacement: () => ''
        });

        // Clean up images (keep tech icons but remove decorative ones)
        this.turndownService.addRule('cleanImages', {
            filter: node => {
                return node.nodeName === 'IMG' && node.getAttribute('width') === '16';
            },
            replacement: (content, node) => {
                // These are likely tech icons, skip them
                return '';
            }
        });
    }

    /**
     * Create and style the export button
     */
    initButton() {
        const button = document.createElement('button');
        button.id = 'export-resume-btn';
        button.innerHTML = '📥 Export to Markdown';
        button.className = 'export-resume-button';
        button.setAttribute('aria-label', 'Export resume to Markdown');
        
        button.addEventListener('click', () => this.exportResume());
        
        document.body.appendChild(button);
        
        // Add styles
        this.addStyles();
    }

    /**
     * Add CSS styles for the export button
     */
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .export-resume-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9998;
                padding: 12px 20px;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-family: 'Roboto Mono', monospace;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .export-resume-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                background: linear-gradient(135deg, #2563eb, #7c3aed);
            }
            
            .export-resume-button:active {
                transform: translateY(0);
            }

            .export-resume-button:focus {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }

            /* Notification styles */
            .export-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-family: 'Roboto Mono', monospace;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideIn 0.3s ease;
            }

            .export-notification.success {
                background: linear-gradient(135deg, #10b981, #059669);
            }

            .export-notification.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .export-resume-button {
                    bottom: 20px;
                    right: 20px;
                    padding: 10px 16px;
                    font-size: 13px;
                }

                .export-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `export-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Get the main content area for export
     */
    getMainContent() {
        // Try to find the main content container
        const main = document.querySelector('main');
        
        if (!main) {
            console.error('Main content not found');
            return null;
        }

        // Clone the content to avoid modifying the original page
        const clone = main.cloneNode(true);

        // Remove unwanted elements from clone
        const elementsToRemove = [
            '.github-popup-overlay',
            '.export-resume-button',
            'script',
            'style',
            'noscript'
        ];

        elementsToRemove.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });

        return clone;
    }

    /**
     * Clean and format the markdown output
     */
    cleanMarkdown(markdown) {
        // Remove excessive newlines (more than 2 consecutive)
        let cleaned = markdown.replace(/\n{3,}/g, '\n\n');
        
        // Remove leading/trailing whitespace
        cleaned = cleaned.trim();
        
        // Fix spacing around headings
        cleaned = cleaned.replace(/\n(#{1,6} )/g, '\n\n$1');
        
        // Fix spacing after headings
        cleaned = cleaned.replace(/(#{1,6} .+)\n([^\n])/g, '$1\n\n$2');
        
        // Remove spaces before list items
        cleaned = cleaned.replace(/\n +(-|\*|\d+\.)/g, '\n$1');
        
        // Ensure proper spacing around horizontal rules
        cleaned = cleaned.replace(/\n*---\n*/g, '\n\n---\n\n');
        
        // Remove multiple spaces
        cleaned = cleaned.replace(/ {2,}/g, ' ');
        
        // Fix code blocks
        cleaned = cleaned.replace(/```\n+/g, '```\n');
        cleaned = cleaned.replace(/\n+```/g, '\n```');
        
        return cleaned;
    }

    /**
     * Generate filename from page title
     */
    generateFilename() {
        // Get title from h1 or document title
        const h1 = document.querySelector('h1');
        const title = h1 ? h1.textContent : document.title;
        
        // Clean and format filename
        const cleanTitle = title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50); // Limit length
        
        return `${cleanTitle}-resume.md`;
    }

    /**
     * Add metadata header to markdown
     */
    addMetadata(markdown) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const metadata = `---
title: ${document.title}
exported: ${dateStr}
source: ${window.location.href}
---

`;
        
        return metadata + markdown;
    }

    /**
     * Main export function
     */
    async exportResume() {
        try {
            // Check if Turndown is ready
            if (!this.turndownService) {
                this.showNotification('Export library is loading, please wait...', 'error');
                return;
            }

            // Get main content
            const content = this.getMainContent();
            if (!content) {
                this.showNotification('Could not find resume content', 'error');
                return;
            }

            // Convert to markdown
            let markdown = this.turndownService.turndown(content);
            
            // Clean and format
            markdown = this.cleanMarkdown(markdown);
            
            // Add metadata
            markdown = this.addMetadata(markdown);
            
            // Generate filename
            const filename = this.generateFilename();
            
            // Create and download file
            this.downloadFile(markdown, filename);
            
            // Show success notification
            this.showNotification('Resume exported successfully!', 'success');
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Export failed. Please try again.', 'error');
        }
    }

    /**
     * Download markdown file
     */
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on resume page
    if (document.querySelector('main')) {
        window.resumeExporter = new ResumeExporter();
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeExporter;
}
