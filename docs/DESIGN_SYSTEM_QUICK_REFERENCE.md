# SaliksikHub Design System - Quick Reference

## 🎨 Color Palette

### Primary Colors
```css
--primary: oklch(0.35 0.08 250)      /* Oxford Blue - Primary actions, links */
--accent: oklch(0.40 0.12 15)        /* Burgundy - Important highlights */
--secondary: oklch(0.95 0.02 85)     /* Parchment - Secondary surfaces */
```

### Semantic Colors
```css
--success: oklch(0.45 0.10 145)      /* Forest Green - Published, approved */
--warning: oklch(0.65 0.15 75)       /* Amber - Under review */
--destructive: oklch(0.50 0.20 25)   /* Crimson - Rejected, errors */
--info: oklch(0.48 0.08 235)         /* Prussian Blue - Information */
```

### Neutral Tones
```css
--foreground: oklch(0.20 0.01 250)   /* Charcoal - Primary text */
--muted-foreground: oklch(0.50 0.02 250)  /* Slate - Secondary text */
--border: oklch(0.88 0.01 250)       /* Pearl - Borders, dividers */
```

---

## ✍️ Typography

### Font Families
```css
--font-serif: 'Merriweather', Georgia, serif      /* Content & headings */
--font-sans: 'Inter', 'Segoe UI', sans-serif      /* UI elements */
--font-mono: 'JetBrains Mono', Consolas, monospace /* Code, DOI, IDs */
```

### Usage
- **Headings (h1-h4)**: Serif, Bold, for article titles and sections
- **Small Headings (h5-h6)**: Sans-serif, Uppercase, for UI labels
- **Body Text**: Serif, for articles, abstracts, content
- **UI Elements**: Sans-serif, for buttons, labels, forms, tables
- **Technical**: Monospace, for DOI, manuscript IDs, code

### Type Scale
```
Display:    48.8px (3.052rem)
H1:         39px (2.441rem)
H2:         31.2px (1.953rem)
H3:         25px (1.563rem)
H4:         20px (1.25rem)
Body Large: 18px (1.125rem)
Body:       16px (1rem)
Body Small: 14px (0.875rem)
Caption:    12px (0.75rem)
```

---

## 📐 Spacing

```css
--space-xs:  4px    /* Tight spacing */
--space-sm:  8px    /* Default gap */
--space-md:  16px   /* Section spacing */
--space-lg:  24px   /* Component separation */
--space-xl:  32px   /* Major sections */
--space-2xl: 48px   /* Page sections */
--space-3xl: 64px   /* Hero spacing */
```

---

## 🔘 Border Radius

```css
--radius: 4px        /* Minimal, traditional */
--radius-md: 3px
--radius-sm: 2px
```

Much smaller than typical SaaS (0.625rem = 10px → 4px)

---

## 🎯 Common Patterns

### Academic Paper Card
```tsx
<Card className="border-border/50 bg-card/50 backdrop-blur-sm">
  <CardHeader>
    <h3 className="font-serif text-xl font-bold">{title}</h3>
    <p className="font-serif italic text-muted-foreground">{authors}</p>
  </CardHeader>
  <CardContent>
    <p className="font-serif leading-relaxed">{abstract}</p>
  </CardContent>
</Card>
```

### Status Badge
```tsx
<Badge className="bg-success/10 text-success border-success/20">
  Published
</Badge>
```

### Data Table
```tsx
<Table className="font-sans text-sm">
  <TableHeader className="bg-muted/50">
    <TableRow>
      <TableHead className="font-semibold">Manuscript ID</TableHead>
    </TableRow>
  </TableHeader>
</Table>
```

### Primary Button
```tsx
<Button variant="default" className="px-6 py-3">
  Submit Manuscript
</Button>
```

### Manuscript Metadata
```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Calendar className="h-4 w-4" />
  <time>{submittedDate}</time>
</div>
```

---

## 🌓 Dark Mode

Colors automatically adjust via CSS variables.
- Warm dark tones (not pure black)
- Reduced contrast for comfortable reading
- Maintains scholarly aesthetic

Toggle: `document.documentElement.classList.toggle('dark')`

---

## ♿ Accessibility

- **Min font size**: 16px
- **Text contrast**: 4.5:1 minimum
- **Focus ring**: 2px Oxford Blue
- **Line height**: 1.5+ for body text
- **Max line width**: 65-75 characters

---

## 📦 Component Library

Located in: `resources/js/components/`

### UI Components (shadcn)
- All in `components/ui/` - pre-themed with scholarly colors
- Use directly: `import { Button } from '@/components/ui/button'`

### Academic Components
- Custom scholarly components in `components/academic/`
- `ManuscriptCard` - Academic paper card
- `ManuscriptCardCompact` - List view variant
- More to come...

---

## 🚀 Getting Started

1. **Fonts loaded** ✓ (in app.blade.php)
2. **CSS updated** ✓ (in app.css)
3. **Build assets**: `npm run build` or `npm run dev`
4. **Use components**: Import and apply scholarly patterns

---

## 📚 Resources

- **Full Documentation**: `docs/DESIGN_SYSTEM.md`
- **Implementation Guide**: `docs/DESIGN_IMPLEMENTATION_GUIDE.md`
- **Color Palette Demo**: `docs/design-system-palette.html`
- **Academic Components**: `resources/js/components/academic/`

---

## 🎨 Visual Identity

**Before (SaaS):**
- Bright, saturated colors
- Large rounded corners (10px+)
- Sans-serif everywhere
- Gradient backgrounds
- Modern, playful

**After (Scholarly):**
- Muted, authoritative tones
- Minimal rounded corners (4px)
- Serif for content
- Solid, warm backgrounds
- Classic, professional

---

## ✅ Component Checklist

When creating/updating:
- [ ] Serif fonts for content/headings
- [ ] Sans-serif for UI elements
- [ ] Minimal border radius (≤4px)
- [ ] Scholarly color palette
- [ ] Sufficient spacing
- [ ] Test dark mode
- [ ] Verify accessibility
- [ ] Check contrast ratios

---

*Design System v1.0 - December 24, 2025*
