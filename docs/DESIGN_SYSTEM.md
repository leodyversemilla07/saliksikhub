# SaliksikHub Design System
## Library & Scholarly Aesthetic

> A comprehensive design system for academic journal management, inspired by traditional library and scholarly publishing aesthetics while maintaining modern usability.

---

## Design Philosophy

**Core Principles:**
1. **Readability First** - Text-heavy interfaces demand excellent typography
2. **Information Density** - Academic users need to see lots of data efficiently
3. **Timeless Aesthetic** - Classic, professional appearance that ages well
4. **Trust & Authority** - Visual language that conveys scholarly credibility
5. **Accessibility** - WCAG 2.1 AA compliance for institutional requirements

**Visual References:**
- Traditional library card catalogs and archive systems
- Academic press websites (Oxford, Cambridge, MIT Press)
- Established journals (Nature, PLOS, JSTOR interface)
- Classic textbook layouts

---

## Color Palette

### Primary Colors - Scholarly Tones

**Primary: Oxford Blue**
```
Light Mode:  oklch(0.35 0.08 250)  /* Deep, authoritative blue */
Dark Mode:   oklch(0.60 0.10 250)  /* Softer blue for dark backgrounds */
```
Usage: Primary actions, links, emphasis in academic contexts

**Secondary: Parchment**
```
Light Mode:  oklch(0.95 0.02 85)   /* Warm off-white, like aged paper */
Dark Mode:   oklch(0.20 0.02 85)   /* Dark warm gray */
```
Usage: Secondary surfaces, subtle backgrounds

**Accent: Burgundy**
```
Light Mode:  oklch(0.40 0.12 15)   /* Rich burgundy, academic robes */
Dark Mode:   oklch(0.55 0.12 15)   /* Lighter burgundy */
```
Usage: Status highlights, important markers, calls-to-action

### Neutral Palette - Archive Gray

**Charcoal (Text)**
```
Light Mode:  oklch(0.20 0.01 250)  /* Almost black with slight warmth */
Dark Mode:   oklch(0.95 0.01 250)  /* Off-white */
```

**Slate (Secondary Text)**
```
Light Mode:  oklch(0.50 0.02 250)  /* Medium gray */
Dark Mode:   oklch(0.70 0.02 250)  /* Light gray */
```

**Pearl (Borders & Dividers)**
```
Light Mode:  oklch(0.88 0.01 250)  /* Subtle, refined borders */
Dark Mode:   oklch(0.28 0.01 250)  /* Dark borders */
```

### Semantic Colors

**Success: Forest Green**
```
oklch(0.45 0.10 145)  /* Published, approved */
```

**Warning: Amber**
```
oklch(0.65 0.15 75)   /* Under review, pending */
```

**Error: Crimson**
```
oklch(0.50 0.20 25)   /* Rejected, errors */
```

**Info: Prussian Blue**
```
oklch(0.48 0.08 235)  /* Information, notes */
```

---

## Typography

### Font Families

**Serif (Primary) - For Content & Headings**
```css
--font-serif: 'Merriweather', 'Georgia', 'Times New Roman', serif;
```
- **Usage**: Body text, article titles, manuscript content
- **Rationale**: Superior readability, traditional scholarly appearance
- **Weights**: 300 (Light), 400 (Regular), 700 (Bold), 900 (Black)

**Sans-Serif (Secondary) - For UI Elements**
```css
--font-sans: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif;
```
- **Usage**: Buttons, labels, navigation, tables
- **Rationale**: Clean UI elements, data display
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Monospace - For Code & Metadata**
```css
--font-mono: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
```
- **Usage**: DOI numbers, citation keys, technical data
- **Weights**: 400 (Regular), 600 (Semibold)

### Type Scale

Based on traditional book typography (1.25 ratio for better readability):

| Element | Size | Line Height | Weight | Family |
|---------|------|-------------|--------|--------|
| Display | 3.052rem (48.8px) | 1.1 | 900 | Serif |
| H1 | 2.441rem (39px) | 1.2 | 700 | Serif |
| H2 | 1.953rem (31.2px) | 1.2 | 700 | Serif |
| H3 | 1.563rem (25px) | 1.3 | 600 | Serif |
| H4 | 1.25rem (20px) | 1.4 | 600 | Serif |
| H5 | 1rem (16px) | 1.5 | 600 | Sans |
| Body Large | 1.125rem (18px) | 1.7 | 400 | Serif |
| Body | 1rem (16px) | 1.7 | 400 | Serif |
| Body Small | 0.875rem (14px) | 1.6 | 400 | Sans |
| Caption | 0.75rem (12px) | 1.5 | 400 | Sans |

### Text Styling

**Emphasis Patterns:**
- **Bold** for primary emphasis
- *Italic* for secondary emphasis, citations, journal titles
- SMALL CAPS for section headers, author names in references
- Underline reserved for links only

---

## Spacing & Layout

### Grid System

**Column-Based Layout** (inspired by traditional manuscripts)
- **Main Content**: 65-75 characters per line (optimal readability)
- **Max Width**: 1400px for dashboard, 800px for reading
- **Margins**: Generous whitespace (like book margins)

### Spacing Scale

Based on 8px base unit (modified for academic density):

```
--space-xs:  0.25rem  (4px)   /* Tight spacing */
--space-sm:  0.5rem   (8px)   /* Default gap */
--space-md:  1rem     (16px)  /* Section spacing */
--space-lg:  1.5rem   (24px)  /* Component separation */
--space-xl:  2rem     (32px)  /* Major sections */
--space-2xl: 3rem     (48px)  /* Page sections */
--space-3xl: 4rem     (64px)  /* Hero spacing */
```

### Density Levels

**Comfortable** (Default for reading)
- Padding: md-lg
- Line height: 1.7
- Use: Article display, manuscript viewing

**Compact** (Data tables)
- Padding: xs-sm
- Line height: 1.5
- Use: Manuscript lists, review tables, dashboards

**Dense** (Information-heavy)
- Padding: xs
- Line height: 1.4
- Use: Metadata displays, reference lists

---

## Components

### Cards

**Academic Paper Card**
```
Border: 1px solid pearl
Shadow: Subtle, soft (no harsh shadows)
Padding: lg-xl
Border Radius: 4px (minimal, traditional)
Background: White/Parchment
```

**Visual Style**: Like an index card or journal abstract

### Buttons

**Primary**
- Background: Oxford Blue
- Text: White
- Padding: 12px 24px
- Border Radius: 4px
- Font: Sans-serif, 500 weight
- Hover: Darken 10%

**Secondary**
- Border: 1.5px solid Oxford Blue
- Text: Oxford Blue
- Background: Transparent
- Hover: Light blue background

**Tertiary/Text**
- Text: Oxford Blue
- Underline on hover
- No background

### Tables

**Academic Data Table**
```
Header: Slate background, bold sans-serif
Rows: Alternating subtle parchment/white
Borders: Pearl, 1px
Padding: Compact (sm)
Hover: Slight darkening
```

**Features:**
- Sortable columns with subtle indicators
- Fixed header on scroll
- Condensed but readable spacing
- Citation-style metadata display

### Forms

**Input Fields**
```
Border: 1.5px solid pearl
Focus: Oxford blue border, subtle glow
Padding: md
Font: Sans-serif
Background: White
Border Radius: 2px (minimal)
```

**Labels**
- Small caps or semibold
- Above inputs (traditional form style)
- Required fields marked with asterisk

### Status Badges

**Manuscript Status**
```
Submitted:        Prussian blue background
Under Review:     Amber background
Revision Needed:  Orange background
Accepted:         Forest green background
Published:        Dark green with checkmark
Rejected:         Crimson background
```

**Style**: Rounded rectangle, sans-serif text, medium weight

### Navigation

**Sidebar (Library Shelf Metaphor)**
- Vertical sections like library categories
- Subtle dividers between sections
- Icons minimal, line-style (not filled)
- Hover: Subtle background change
- Active: Burgundy accent on left border

**Breadcrumbs**
- Serif font for page names
- Subtle separators (›)
- Muted color except current page

---

## Iconography

**Style Guide:**
- **Line icons** (not filled) - more scholarly, less playful
- **Consistent stroke width** (1.5-2px)
- **16px, 20px, 24px sizes**
- **Lucide React** library (already installed) works well

**Icon Usage:**
- Minimal use - text labels preferred
- Used for actions (submit, download, delete)
- Not decorative - functional only

---

## Motion & Animation

**Principle: Subtle & Purposeful**

Academic interfaces should feel stable and trustworthy, not flashy.

**Timing Functions:**
```
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1)
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1)
```

**Durations:**
- Micro interactions: 150ms (hover states)
- Transitions: 250ms (tab changes, reveals)
- Modal/drawer: 300ms (page overlays)
- Page transitions: 400ms (route changes)

**Animation Types:**
- **Fade**: Opacity changes for content loading
- **Slide**: Drawers, modals (gentle, not aggressive)
- **Expand/Collapse**: Accordion sections
- **Avoid**: Bounces, spins, complex transformations

---

## Patterns

### Manuscript Display

**Title Block**
```
Title: H1, Serif, Bold
Authors: Body, Italic
Metadata: Small, Sans-serif, muted
Abstract: Body, Serif, comfortable line height
Keywords: Small caps, comma-separated
```

### Review Interface

**Two-Column Layout**
- Left: Manuscript PDF viewer (60%)
- Right: Review form, annotations (40%)
- Sticky toolbar at top

### Dashboard Cards

**Metrics Card**
```
Number: Display size, bold
Label: Small, uppercase, muted
Trend: Small indicator with icon
Background: Subtle parchment
Border: Pearl, 1px
```

### Citation Display

**APA-Style Blocks**
- Hanging indent
- Monospace for DOI
- Italic for journal names
- Proper spacing between entries

---

## Dark Mode Adaptation

**Philosophy**: Like reading in a library at night, not a nightclub

**Adjustments:**
- Background: Very dark charcoal (not pure black)
- Text: Warm off-white (not pure white) for reduced eye strain
- Reduce contrast slightly from light mode
- Warmer temperature overall
- Keep parchment/warm tones

**Avoid:**
- Pure black backgrounds
- Bright neon accents
- High contrast that causes eye fatigue

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

**Interaction:**
- All interactive elements keyboard accessible
- Focus states clearly visible (Oxford blue ring, 2px)
- Skip links for main content
- Proper heading hierarchy

**Typography:**
- Minimum 16px base font size
- Resizable up to 200% without breaking layout
- Clear line height (1.5+)
- No justified text (causes reading issues)

### Screen Reader Support

- Semantic HTML5 elements
- ARIA labels where needed
- Alternative text for all images
- Status announcements for dynamic content

---

## Implementation Guidelines

### CSS Variables Setup

See the updated `resources/css/app.css` for full implementation.

### Component Development

**When creating new components:**
1. Start with semantic HTML
2. Apply utility classes for spacing/layout
3. Use design tokens (CSS variables) for colors
4. Test in both light and dark modes
5. Verify accessibility with keyboard navigation
6. Check with screen reader

### File Organization

```
components/
  ├── ui/               # Base shadcn components (scholarly themed)
  ├── academic/         # Academic-specific components
  │   ├── manuscript-card.tsx
  │   ├── citation-block.tsx
  │   ├── author-list.tsx
  │   ├── review-panel.tsx
  │   └── status-timeline.tsx
  └── layouts/          # Page layouts
```

---

## Resources

### Fonts to Install

**Google Fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

**NPM Packages:**
```bash
# Already installed
npm install @radix-ui/react-* lucide-react
```

### Design Tools

- **Figma Community**: Academic UI kits
- **Coolors.co**: Palette refinement
- **WebAIM Contrast Checker**: Accessibility verification
- **Type Scale Calculator**: Typography validation

---

## Examples

### Before & After

**Current (SaaS Style):**
- Bright primary colors
- Sans-serif everywhere
- Rounded corners (large radius)
- Gradient backgrounds
- Bold shadows

**New (Scholarly Style):**
- Muted, authoritative colors
- Serif for content
- Minimal rounded corners
- Solid, warm backgrounds
- Subtle shadows

---

## Version History

- **v1.0** (2025-12-24): Initial scholarly design system
- Based on traditional academic publishing aesthetics
- Optimized for research journal management workflows

---

## Contributing

When proposing design changes:
1. Ensure alignment with scholarly aesthetic
2. Provide accessibility documentation
3. Test in both light and dark modes
4. Include usage examples
5. Consider information density needs

---

*This design system is maintained by the SaliksikHub team and is open for community contributions.*
