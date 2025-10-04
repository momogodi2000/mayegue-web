# PWA Icons

This directory contains PWA icons for the Ma'a yegue application.

## Icon Files

- `icon-192x192.png` - App icon for PWA (192x192 pixels)
- `icon-512x512.png` - App icon for PWA (512x512 pixels)
- `apple-touch-icon.png` - Apple touch icon (180x180 pixels)
- `favicon.ico` - Browser favicon

## Generating Icons

To generate these icons from the app logo:

1. Start with the source logo at `src/assets/logo/logo.jpg`
2. Use an image converter tool or online service like:
   - https://realfavicongenerator.net/
   - https://favicon.io/favicon-converter/
3. Generate the following sizes:
   - 192x192 (PWA Icon)
   - 512x512 (PWA Icon)
   - 180x180 (Apple Touch Icon)
   - 32x32 (Favicon ICO)

## Manual Generation Instructions

If you have the logo ready, you can generate these icons using:
- Online tools mentioned above
- Image editing software (Photoshop, GIMP, etc.)
- Command-line tools like ImageMagick:
  ```bash
  convert logo.jpg -resize 192x192 icon-192x192.png
  convert logo.jpg -resize 512x512 icon-512x512.png
  convert logo.jpg -resize 180x180 apple-touch-icon.png
  ```

## Note for Users

**IMPORTANT:** The actual PNG icon files need to be generated from `src/assets/logo/logo.jpg`.
Place the generated files in this directory (`public/assets/icons/`) with the exact filenames listed above.

Until the PNG icons are generated, the app will use default icons.