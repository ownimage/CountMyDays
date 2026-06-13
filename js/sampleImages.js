// js/sampleImages.js
// Converted to the new flat array format your app expects.

const sampleImages = [
  // FLAT THEME
  {
    category: "Birthday",
    data: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
        <rect width='80' height='80' fill='#f5f5f5'/>
        <circle cx='40' cy='32' r='16' fill='#ff6b6b'/>
        <rect x='24' y='40' width='32' height='18' fill='#ffa94d'/>
      </svg>
    `)
  },
  {
    category: "Holiday",
    data: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
        <rect width='80' height='80' fill='#f5f5f5'/>
        <polygon points='40,12 50,32 30,32' fill='#4dabf7'/>
        <rect x='34' y='32' width='12' height='24' fill='#228be6'/>
      </svg>
    `)
  },
  {
    category: "Anniversary",
    data: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
        <rect width='80' height='80' fill='#f5f5f5'/>
        <path d='M28 30 C28 24 34 22 40 26 C46 22 52 24 52 30 C52 36 46 42 40 48 C34 42 28 36 28 30Z'
              fill='#e64980'/>
      </svg>
    `)
  },
  {
    category: "Event",
    data: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
        <rect width='80' height='80' fill='#f5f5f5'/>
        <rect x='18' y='22' width='44' height='30' rx='4' fill='#51cf66'/>
        <circle cx='30' cy='32' r='4' fill='#ffffff'/>
        <circle cx='40' cy='32' r='4' fill='#ffffff'/>
        <circle cx='50' cy='32' r='4' fill='#ffffff'/>
      </svg>
    `)
  }
];

// Default theme (not used anymore but kept for compatibility)
function getDefaultTheme() {
  return "cartoon";
}
