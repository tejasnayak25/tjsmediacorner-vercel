let theme = "light";
let theme_colors = {
    light: "#e2e8f0",
    dark: "#0f172a"
};
let scheme = document.querySelector('meta[name="theme-color"]');

// Check system preference and set initial theme
if (localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  theme = "dark";
  scheme.setAttribute('content', theme_colors.dark);
} else {
  document.documentElement.classList.remove('dark');
  scheme.setAttribute('content', theme_colors.light);
}
    
// Function to toggle dark mode manually
function toggleDarkMode() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
    theme = "light";
    scheme.setAttribute('content', theme_colors.light);
  } else {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    theme = "dark";
    scheme.setAttribute('content', theme_colors.dark);
  }

  location.reload();
}

window.matchMedia('(prefers-color-scheme: dark)').onchange = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        theme = "dark";
        scheme.setAttribute('content', theme_colors.dark);
    } else {
        document.documentElement.classList.remove('dark');
        theme = "light";
        scheme.setAttribute('content', theme_colors.light);
    }
}