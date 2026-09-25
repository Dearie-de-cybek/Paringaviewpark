/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./about.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'forest-ink': '#07503f',
        'vivid-lime': '#e8fe85',
        'bone': '#f1efdf',
        'pure-white': '#ffffff',
        'ash-gray': '#efefef',
        'charcoal': '#212529',
        'graphite': '#353535',
        'pewter': '#6d6d6d',
        'sky-card': '#b2cee7',
        'peach-card': '#fceace',
        'sage-card': '#e6ecd5',
        'moss': '#c3cda7',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        reckless: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        'cards': '20px',
        'links': '26px',
        'inputs': '33px',
        'buttons': '100px',
        'nav-pills': '110px',
        'hero-cards': '30px',
      },
      maxWidth: {
        'page': '1200px',
      },
      letterSpacing: {
        'display-tight': '-0.037em',
        'heading-tight': '-0.012em',
      },
      spacing: {
        '15': '3.75rem',
      }
    }
  },
  plugins: [],
}
