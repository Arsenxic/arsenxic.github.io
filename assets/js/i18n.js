// Simple i18n (internationalization) system for the website
let currentLanguage = localStorage.getItem('language') || 'fr';
let translations = {};

// Load translations from JSON file
async function loadTranslations() {
  try {
    const response = await fetch('/assets/js/translations.json');
    translations = await response.json();
    applyLanguage(currentLanguage);
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

// Apply language to all elements with data-i18n attribute
function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Update document language
  document.documentElement.lang = lang;
  
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // Update HTML content (for elements with HTML like <br>)
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const key = element.getAttribute('data-i18n-html');
    if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });
  
  // Update language button styles (highlight active language)
  const frBtn = document.getElementById('lang-fr');
  const enBtn = document.getElementById('lang-en');
  if (frBtn && enBtn) {
    if (lang === 'fr') {
      frBtn.classList.add('active');
      enBtn.classList.remove('active');
    } else {
      frBtn.classList.remove('active');
      enBtn.classList.add('active');
    }
  }
}

// Load translations when page loads
document.addEventListener('DOMContentLoaded', loadTranslations);
