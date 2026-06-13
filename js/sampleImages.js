// js/sampleImages.js

// Helper to Base64-encode raw SVG strings (you'll do this offline or in a build step)
// For now, we just store already-encoded strings.
const sampleImages = {
  flat: {
    birthday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#f5f5f5"/>
        <circle cx="40" cy="32" r="16" fill="#ff6b6b"/>
        <rect x="24" y="40" width="32" height="18" fill="#ffa94d"/>
      </svg>`),

    holiday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#f5f5f5"/>
        <polygon points="40,12 50,32 30,32" fill="#4dabf7"/>
        <rect x="34" y="32" width="12" height="24" fill="#228be6"/>
      </svg>`),

    anniversary: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#f5f5f5"/>
        <path d="M28 30 C28 24 34 22 40 26 C46 22 52 24 52 30 C52 36 46 42 40 48 C34 42 28 36 28 30Z"
              fill="#e64980"/>
      </svg>`),

    event: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#f5f5f5"/>
        <rect x="18" y="22" width="44" height="30" rx="4" fill="#51cf66"/>
        <circle cx="30" cy="32" r="4" fill="#ffffff"/>
        <circle cx="40" cy="32" r="4" fill="#ffffff"/>
        <circle cx="50" cy="32" r="4" fill="#ffffff"/>
      </svg>`)
  },

  cartoon: {
    birthday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" rx="12" fill="#f1f3f5"/>
        <rect x="20" y="34" width="40" height="22" rx="6" fill="#ffc9c9"/>
        <circle cx="40" cy="30" r="12" fill="#ff8787"/>
        <circle cx="40" cy="18" r="4" fill="#ffe066"/>
        <path d="M32 40 Q40 46 48 40" stroke="#c92a2a" stroke-width="2" fill="none"/>
      </svg>`),

    holiday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" rx="12" fill="#f1f3f5"/>
        <circle cx="40" cy="30" r="14" fill="#74c0fc"/>
        <rect x="36" y="30" width="8" height="20" rx="3" fill="#1c7ed6"/>
        <path d="M30 48 Q40 54 50 48" stroke="#1864ab" stroke-width="2" fill="none"/>
      </svg>`),

    anniversary: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" rx="12" fill="#f1f3f5"/>
        <path d="M28 30 C28 24 34 22 40 26 C46 22 52 24 52 30 C52 36 46 42 40 48 C34 42 28 36 28 30Z"
              fill="#f06595" stroke="#c2255c" stroke-width="2"/>
      </svg>`),

    event: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" rx="12" fill="#f1f3f5"/>
        <rect x="18" y="24" width="44" height="28" rx="6" fill="#8ce99a" stroke="#2b8a3e" stroke-width="2"/>
        <circle cx="30" cy="34" r="4" fill="#ffffff"/>
        <circle cx="40" cy="34" r="4" fill="#ffffff"/>
        <circle cx="50" cy="34" r="4" fill="#ffffff"/>
      </svg>`)
  },

  mono: {
    birthday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#ffffff"/>
        <circle cx="40" cy="30" r="12" fill="#000000"/>
        <rect x="26" y="38" width="28" height="16" fill="#000000"/>
      </svg>`),

    holiday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#ffffff"/>
        <polygon points="40,14 50,32 30,32" fill="#000000"/>
        <rect x="36" y="32" width="8" height="22" fill="#000000"/>
      </svg>`),

    anniversary: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#ffffff"/>
        <path d="M28 30 C28 24 34 22 40 26 C46 22 52 24 52 30 C52 36 46 42 40 48 C34 42 28 36 28 30Z"
              fill="#000000"/>
      </svg>`),

    event: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#ffffff"/>
        <rect x="18" y="24" width="44" height="28" fill="#000000"/>
        <circle cx="30" cy="34" r="4" fill="#ffffff"/>
        <circle cx="40" cy="34" r="4" fill="#ffffff"/>
        <circle cx="50" cy="34" r="4" fill="#ffffff"/>
      </svg>`)
  },

  emoji: {
    birthday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#fff9db"/>
        <circle cx="40" cy="30" r="14" fill="#ff922b"/>
        <rect x="26" y="40" width="28" height="16" fill="#ffe066"/>
        <circle cx="35" cy="28" r="2" fill="#000000"/>
        <circle cx="45" cy="28" r="2" fill="#000000"/>
      </svg>`),

    holiday: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#e7f5ff"/>
        <circle cx="40" cy="30" r="14" fill="#339af0"/>
        <rect x="36" y="30" width="8" height="20" fill="#1c7ed6"/>
        <circle cx="35" cy="26" r="2" fill="#ffffff"/>
        <circle cx="45" cy="26" r="2" fill="#ffffff"/>
      </svg>`),

    anniversary: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#fff0f6"/>
        <path d="M28 30 C28 24 34 22 40 26 C46 22 52 24 52 30 C52 36 46 42 40 48 C34 42 28 36 28 30Z"
              fill="#f06595"/>
        <circle cx="35" cy="26" r="2" fill="#ffffff"/>
        <circle cx="45" cy="26" r="2" fill="#ffffff"/>
      </svg>`),

    event: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" fill="#ebfbee"/>
        <rect x="18" y="24" width="44" height="28" rx="6" fill="#51cf66"/>
        <circle cx="30" cy="34" r="4" fill="#ffffff"/>
        <circle cx="40" cy="34" r="4" fill="#ffffff"/>
        <circle cx="50" cy="34" r="4" fill="#ffffff"/>
      </svg>`)
  },

  avatars: {
    cartoonMale: "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
        <rect width="80" height="80" rx="16" fill="#f1f3f5"/>
        <circle cx="40" cy="30" r="14" fill="#ffc9a9"/>
        <path d="M28 26 Q40 16 52 26" fill="#343a40"/>
        <circle cx="35" cy="30" r="2" fill="#000000"/>
        <circle cx="45" cy="30" r="2" fill="#000000"/>
        <path d="M34 36 Q40 40 46 36" stroke="#c92a2a" stroke-width="2" fill="none"/>
        <rect x="26" y="44" width="28" height="14" rx="6" fill="#4dabf7"/>
      </svg>`)
  }
};

// Optional helper: default theme
function getDefaultTheme() {
  return "cartoon";
}
