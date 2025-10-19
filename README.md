# Sergei Konovalov - Personal Portfolio & Resume

[![Jekyll](https://img.shields.io/badge/Jekyll-4.x-red.svg)](https://jekyllrb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green.svg)](https://l0kifs.github.io/)

Modern, responsive personal portfolio and resume website built with Jekyll and deployed on GitHub Pages.

## 🚀 Live Site

Visit the live website: [https://l0kifs.github.io/](https://l0kifs.github.io/)

## ✨ Features

- **Modern Dark Theme** with gradient accents and animations
- **Responsive Design** optimized for all devices
- **Technology Stack Visualization** with SVG icons
- **Professional Resume Layout** with detailed experience
- **Export to Markdown** - One-click download of resume in Markdown format
- **Performance Optimized** with fast loading times
- **SEO Friendly** with proper meta tags and structure

## 🛠️ Tech Stack

- **Jekyll** - Static site generator
- **Sass/SCSS** - CSS preprocessing
- **JavaScript** - Interactive features
- **GitHub Pages** - Hosting and deployment
- **Devicons** - Technology logos via CDN

## 🏃‍♂️ Local Development

### Prerequisites

- Ruby 3.0+
- Bundler gem
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/l0kifs/l0kifs.github.io.git
   cd l0kifs.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle config set --local path 'vendor/bundle'
   bundle install
   ```

3. **Run the development server**
   ```bash
   bundle exec jekyll serve --host 0.0.0.0 --port 4000
   ```

4. **Open in browser**
   
   Navigate to `http://localhost:4000`

### Development Commands

```bash
# Serve with live reload (default)
bundle exec jekyll serve

# Serve with drafts
bundle exec jekyll serve --drafts

# Build for production
bundle exec jekyll build

# Clean build files
bundle exec jekyll clean
```

## 📁 Project Structure

```
├── _config.yml          # Jekyll configuration
├── _layouts/            # HTML templates
│   └── resume.html      # Main layout
├── assets/              # Static assets
│   ├── css/
│   │   ├── style.scss   # Main styles
│   │   └── resume.scss  # Resume-specific styles
│   └── js/              # JavaScript files
├── index.md             # Main content
├── Gemfile              # Ruby dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 Customization

### Colors & Theming

The site uses CSS custom properties for easy theming. Main variables are defined in `assets/css/resume.scss`:

```scss
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #121212;
  --accent-primary: #3b82f6;
  --accent-secondary: #8b5cf6;
  // ... more variables
}
```

### Content Updates

- **Personal Info**: Edit `index.md`
- **Experience**: Update the experience sections in `index.md`
- **Skills**: Modify the skills grid in `index.md`
- **Technology Stack**: Add/remove technologies in the tech stack section

### Adding New Technologies

Technology icons are loaded from [Devicons CDN](https://devicon.dev/). To add a new technology:

1. Find the icon on the Devicons website
2. Add a new `tech-item` div with the appropriate image URL
3. Add fallback handling in `assets/js/tech-icons.js`

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px  
- **Mobile**: ≤ 480px

## ⚡ Performance

- **SVG Icons** for crisp display at any resolution
- **CDN Delivery** for external resources
- **Optimized Images** with proper sizing and compression
- **Minified Assets** for faster loading
- **Responsive Loading** with fallbacks for slow connections

## 🚀 Deployment

The site is automatically deployed to GitHub Pages on every push to the `main` branch.

### Manual Deployment

If deploying elsewhere:

```bash
# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Deploy _site/ directory to your hosting service
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📧 Contact

- **Email**: skonovalov.work@gmail.com
- **LinkedIn**: [sergei-konovalov-150766183](https://www.linkedin.com/in/sergei-konovalov-150766183)
- **GitHub**: [@l0kifs](https://github.com/l0kifs)

---

⭐ If you found this project helpful, please give it a star!