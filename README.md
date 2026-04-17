# Photocard Studio

A Next.js-based Bengali news photocard generator with multiple templates, live preview, and PNG export.

## Features

- **6 built-in templates**: Dual Classic, Single News, Full Overlay, Side Story, Minimal White, Mosaic
- **Multiple layouts**: 1 photo, 2 photos, 3 photos (mosaic)
- **Fully editable**: Colors, typography, fonts, padding, accent bars, overlays
- **Custom templates**: Create, duplicate, rename, delete templates
- **Live preview** with zoom controls
- **Export to PNG** at 3× resolution (3240×3240px)
- **Bengali font support**: Noto Serif Bengali, Noto Sans Bengali
- **Persistent state**: Settings saved to localStorage via Zustand persist

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

### Using Templates
1. Pick a template from the left sidebar
2. Templates show a layout thumbnail and description
3. Click the duplicate icon to copy a template for customization

### Creating a New Template
1. Click the **+** button in the template sidebar header
2. Give it a name and choose a layout
3. The new template appears with default styling — customize from the editor

### Editing a Card
The **Edit Card** panel (middle column) has sections for:
- **Photos**: Upload files or paste URLs; adjust fit/scale per photo
- **Content**: Headline and subheadline (Bengali input supported)
- **Branding**: Channel name, handle, website, show/hide brand bar
- **Colors**: Accent, background, text, brand, divider colors
- **Typography**: Font family, headline size, subheadline size, weight
- **Layout**: Accent bar position/height, padding, border radius, overlay opacity

### Exporting
Click **Export PNG** in the top-right of the preview. Output is 3240×3240px (3× the 1080×1080 card).

## Project Structure

```
src/
  app/           Next.js app router
  components/
    CardPreview.tsx      — The actual card renderer (all layouts)
    EditorPanel.tsx      — All editing controls
    PreviewCanvas.tsx    — Preview area + export
    TemplateSidebar.tsx  — Template list + add/manage
  lib/
    types.ts             — All TypeScript types + built-in templates
  store/
    useStore.ts          — Zustand store (state + actions)
```

## Adding More Templates

Edit `src/lib/types.ts` — add entries to `BUILT_IN_TEMPLATES`:

```ts
{
  id: 'my-template',
  name: 'My Template',
  description: 'Custom layout',
  layout: 'single-top',   // see TemplateLayout type
  photoCount: 1,
  isBuiltIn: true,
  style: {
    ...DEFAULT_STYLE,
    accentColor: '#ff6b35',
    backgroundColor: '#ff6b35',
    // override any style property
  }
}
```

## Available Layouts

| Layout | Photos | Description |
|--------|--------|-------------|
| `dual-top` | 2 | Two photos top, headline below |
| `single-top` | 1 | One photo top, headline below |
| `single-bottom` | 1 | Headline top, photo below |
| `full-overlay` | 1 | Photo full bleed, text overlaid |
| `dual-side` | 1 | Photo left, text right |
| `dual-side-reverse` | 1 | Text left, photo right |
| `triple-mosaic` | 3 | 3-photo mosaic, headline below |

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management + localStorage persistence)
- **html2canvas** (PNG export)
- **Lucide React** (icons)
- **Google Fonts** (Bengali + Playfair Display)
