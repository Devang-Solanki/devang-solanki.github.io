// Terminal-style typing effect for the homepage
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add copy code functionality
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code';
        button.textContent = 'Copy';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
        block.parentNode.appendChild(button);
    });

    // Add terminal cursor blink effect
    const terminalElements = document.querySelectorAll('.terminal-prompt');
    terminalElements.forEach(element => {
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '_';
        element.appendChild(cursor);
    });
});

// Add some CSS for the JavaScript enhancements
const style = document.createElement('style');
style.textContent = `
    .copy-code {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--accent-green);
        color: var(--bg-primary);
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-size: 0.8rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    pre:hover .copy-code {
        opacity: 1;
    }
    
    pre {
        position: relative;
    }
    
    .terminal-cursor {
        animation: blink 1s infinite;
        color: var(--accent-green);
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style);