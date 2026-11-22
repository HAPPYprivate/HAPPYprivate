/* HAPPY — the ONLY place to edit external URLs.
   Leave a value as '' and its button stays a disabled "Coming soon" label (no fake links).
   Use full https:// URLs. */
window.HAPPY_CONFIG = {
  discordUrl: 'https://discord.gg/Y5r4f4BYtm',
  links: {
    sheetStudioBuy:  'https://github.com/HAPPYprivate/HAPPYprivate/releases/download/AutoUpdate/Sheet_Studio.exe',  // Buy Sheet Studio
    happyMacro:      '',  // Get Happy Macro
    generate:        '',  // Download / open Generate (free)
    checkDisplayBuy: '',  // Buy Check Display for MIDI
    support:         ''   // Extra support page (optional)
  },
  // Editable content displayed by the Sheet Studio Learn more modal.
  // Use \n\n inside content to separate paragraphs.
  sheetStudioInfo: {
    eyebrow: 'HAPPY MIDI / PRODUCT DETAILS',
    title: 'Sheet Studio',
    content: 'Sheet Studio is the core composition and editing tool in HAPPY Midi. Use it to create and edit musical pieces, work with MIDI, and prepare finished pieces for Happy Macro.\n\nSheet Studio is also the official tool for exporting complete .happy files. A standard MIDI file is not automatically a .happy file.',
    highlights: [
      'Compose and edit musical pieces',
      'Work with MIDI',
      'Prepare pieces for Happy Macro',
      'Export complete .happy files'
    ]
  }
};
