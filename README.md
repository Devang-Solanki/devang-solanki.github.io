# Devang Solanki - Personal Security Blog

A clean, terminal-style personal website showcasing cybersecurity research, bug bounty findings, and CTF writeups.

## Features

- **Clean Design**: Terminal-inspired dark theme with green accents
- **Responsive**: Works perfectly on desktop and mobile
- **Fast Loading**: Pure HTML/CSS/JS - no build process required
- **Security Tools**: Interactive XSS payload tester included

## Structure

```
├── index.html              # Homepage
├── blogs.html              # Blog posts listing
├── writeups.html           # CTF writeups listing
├── bugbounty.html          # Bug bounty reports listing
├── tools.html              # Security tools listing
├── assets/
│   ├── css/custom.css      # Main stylesheet
│   └── js/main.js          # JavaScript functionality
└── tools/
    └── xss-payload-tester.html  # XSS testing tool
```

## Deployment

This is a static HTML site that can be deployed anywhere:

- **GitHub Pages**: Just push to your repository
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **Any web server**: Upload files via FTP

## Customization

### Colors
Edit the CSS variables in `assets/css/custom.css`:
```css
:root {
  --bg-primary: #0a0e1a;
  --accent-green: #10b981;
  /* ... other variables */
}
```

### Content
- Update personal information in `index.html`
- Add new blog posts by creating HTML files and linking them
- Modify navigation in each HTML file

## Local Development

Simply open `index.html` in your browser. No build process required!

## License

MIT License - feel free to use this template for your own portfolio.