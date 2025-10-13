export default function ThemeScript() {
  const themeScript = `
    (function() {
      function getInitialTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
          return storedTheme;
        }

        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
      }

      const theme = getInitialTheme();
      document.documentElement.classList.add(theme);
    })();
  `.trim();

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}