# 🌐 Website Language Support (FR/EN)

Your website now supports both **French** and **English**! Here's how it works:

## 🎯 How It Works

The language switcher is now visible in the top of your sidebar. Users can click **FR** or **EN** to toggle languages. Their choice is automatically saved in the browser.

### Technical Details
- **File**: `/assets/js/translations.json` - Contains all text in French and English
- **Script**: `/assets/js/i18n.js` - Handles language switching and storage
- **Data Attributes**: HTML elements use `data-i18n="key"` to reference translations

## 📝 How to Add More Translations

If you want to translate more content, follow these 3 simple steps:

### Step 1: Add the translation key to `translations.json`
Open `/assets/js/translations.json` and add your key to both "fr" and "en" sections:

```json
{
  "fr": {
    "my-new-key": "Texte en français"
  },
  "en": {
    "my-new-key": "Text in English"
  }
}
```

### Step 2: Add the attribute to your HTML
For simple text content, use `data-i18n`:
```html
<p data-i18n="my-new-key">Texte en français</p>
```

For HTML content (like `<br>` tags), use `data-i18n-html`:
```html
<p data-i18n-html="my-text-with-html">Text with <br> break</p>
```

### Step 3: That's it!
The language switcher will automatically translate it.

## 📋 Current Translations

These pages/elements are currently translated:
- Sidebar menu (Home, Commissions, Personal Work, etc.)
- Contact information (Name, Job title, Location)
- Page titles (News, Commissions, Personal Work, Collective)
- Project descriptions and links

## 🔧 Troubleshooting

**The language switcher doesn't appear?**
- Make sure you added `<script src="/assets/js/i18n.js" defer></script>` to your HTML file before `script.js`

**Translations not working?**
- Check that your HTML uses `data-i18n="key"` (not `data-i18n-html`)
- Check that the key exists in both "fr" and "en" sections of `translations.json`
- Open browser console (F12) to see any errors

**How does the browser remember my language choice?**
- It's saved in `localStorage`, so the browser remembers it across visits

## 🎨 Styling the Language Button

The language switcher button can be customized in `/assets/css/style.css`. Look for the `.language-switcher` and `.lang-btn` classes.

---

**Questions?** Feel free to expand the translations as needed!
