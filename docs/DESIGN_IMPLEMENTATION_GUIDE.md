# Design System Implementation Guide

This guide helps you implement the Scholarly Design System in Saliksikhub.

## Quick Start

### 1. Fonts Are Loaded ✓

The scholarly fonts are already loaded in `resources/views/app.blade.php`:
- **Merriweather** (Serif) - For content and headings
- **Inter** (Sans-serif) - For UI elements
- **JetBrains Mono** (Monospace) - For code/technical content

### 2. CSS Variables Are Updated ✓

Your `resources/css/app.css` now includes:
- Scholarly color palette (Oxford Blue, Burgundy, Parchment)
- Typography system with serif/sans-serif distinction
- Minimal border radius (4px instead of 10px)
- Warm, academic color tones

### 3. Build Your CSS

```bash
npm run build
# or for development
npm run dev
```

## Using the Design System

### Typography

**In Components:**

```tsx
// Headings - automatically serif, bold
<h1>Research Article Title</h1>          // Large serif heading
<h2>Section Heading</h2>                 // Serif, bold
<h5>UI Section Label</h5>                // Sans-serif, uppercase

// Body text - serif for content
<article className="prose">
    <p>Research content goes here...</p>
</article>

// UI elements - sans-serif
<button>Submit Manuscript</button>
<label>Manuscript Title</label>

// Code/Technical - monospace
<code>DOI: 10.1234/example</code>
```

### Colors

**Using Tailwind Classes:**

```tsx
// Primary (Oxford Blue)
<button className="bg-primary text-primary-foreground">
    Primary Action
</button>

// Accent (Burgundy)
<Badge className="bg-accent text-accent-foreground">
    Important
</Badge>

// Semantic colors
<Alert className="bg-success">Published</Alert>
<Alert className="bg-warning">Under Review</Alert>
<Alert className="bg-destructive">Rejected</Alert>

// Borders and backgrounds
<Card className="border-border bg-card">
    Content
</Card>
```

**Custom CSS Variables:**

```tsx
// In your custom styles
<div style={{ color: 'oklch(var(--primary))' }}>
    Custom styled element
</div>
```

### Academic Components

**Using ManuscriptCard:**

```tsx
import { ManuscriptCard, ManuscriptCardCompact } from '@/components/academic';

// Full card with abstract
<ManuscriptCard
    id={manuscript.id}
    title={manuscript.title}
    authors={manuscript.authors}
    abstract={manuscript.abstract}
    keywords={['machine learning', 'neural networks']}
    submittedDate={manuscript.submitted_at}
    status={manuscript.status}
    manuscriptId={manuscript.manuscript_id}
    href={`/manuscripts/${manuscript.id}`}
    showAbstract={true}
/>

// Compact variant for lists
<ManuscriptCardCompact
    id={manuscript.id}
    title={manuscript.title}
    authors={manuscript.authors}
    submittedDate={manuscript.submitted_at}
    status={manuscript.status}
    href={`/manuscripts/${manuscript.id}`}
/>
```

### Spacing

```tsx
// Use the academic spacing scale
<div className="space-y-md">     {/* 16px gap */}
    <Section />
    <Section />
</div>

// Generous margins for readability
<article className="max-w-3xl mx-auto px-xl py-2xl">
    Content with breathing room
</article>
```

### Buttons

```tsx
// Primary action - Oxford Blue
<Button variant="default">
    Submit Manuscript
</Button>

// Secondary action - outlined
<Button variant="outline">
    Cancel
</Button>

// Destructive action - crimson
<Button variant="destructive">
    Reject Manuscript
</Button>

// Accent action - burgundy
<Button className="bg-accent hover:bg-accent/90">
    Featured Action
</Button>
```

### Cards

```tsx
// Academic paper card style
<Card className="border-border/50 bg-card/50 backdrop-blur-sm">
    <CardHeader>
        <h3 className="font-serif text-xl font-bold">
            Card Title in Serif
        </h3>
    </CardHeader>
    <CardContent>
        Content here
    </CardContent>
</Card>
```

### Tables

```tsx
// Data-dense academic tables
<Table className="font-sans text-sm">
    <TableHeader className="bg-muted/50">
        <TableRow>
            <TableHead className="font-semibold">
                Manuscript ID
            </TableHead>
            <TableHead>Title</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {manuscripts.map((m) => (
            <TableRow key={m.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs">
                    {m.manuscript_id}
                </TableCell>
                <TableCell className="font-serif">
                    {m.title}
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>
```

## Converting Existing Components

### Before (SaaS Style)

```tsx
<div className="rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 shadow-xl">
    <h2 className="font-sans text-4xl font-black">
        Submit Your Research
    </h2>
    <button className="rounded-full bg-white text-black px-8 py-4">
        Get Started →
    </button>
</div>
```

### After (Scholarly Style)

```tsx
<Card className="border-border bg-card">
    <CardHeader>
        <h2 className="font-serif text-3xl font-bold text-foreground">
            Submit Your Research
        </h2>
    </CardHeader>
    <CardContent>
        <Button variant="default" className="px-6 py-3">
            Get Started
        </Button>
    </CardContent>
</Card>
```

## Component Checklist

When creating or updating components:

- [ ] Use serif fonts for content/headings
- [ ] Use sans-serif for UI elements
- [ ] Apply minimal border radius (4px or less)
- [ ] Use scholarly color palette
- [ ] Ensure sufficient spacing for readability
- [ ] Test in both light and dark modes
- [ ] Verify accessibility (keyboard nav, focus states)
- [ ] Check color contrast ratios

## Common Patterns

### Article Display

```tsx
<article className="prose prose-lg max-w-3xl mx-auto">
    <h1 className="font-serif text-4xl font-bold mb-4">
        Article Title
    </h1>
    
    <p className="font-serif italic text-lg text-muted-foreground mb-8">
        Author Name, Co-author Name
    </p>
    
    <Separator className="my-8" />
    
    <div className="font-serif text-base leading-relaxed">
        <p>Article content...</p>
    </div>
</article>
```

### Dashboard Metrics

```tsx
<Card>
    <CardHeader>
        <h5 className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
            Total Submissions
        </h5>
    </CardHeader>
    <CardContent>
        <div className="font-serif text-4xl font-bold">
            1,234
        </div>
        <p className="font-sans text-sm text-muted-foreground mt-2">
            +12% from last month
        </p>
    </CardContent>
</Card>
```

### Status Badges

```tsx
// Create a status badge component
function StatusBadge({ status }: { status: string }) {
    const variants = {
        submitted: 'bg-info/10 text-info border-info/20',
        under_review: 'bg-warning/10 text-warning border-warning/20',
        accepted: 'bg-success/10 text-success border-success/20',
        rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    
    return (
        <Badge className={variants[status] + ' font-sans text-xs'}>
            {status.replace('_', ' ').toUpperCase()}
        </Badge>
    );
}
```

## Dark Mode

Dark mode is automatically handled via CSS variables. Test both modes:

```tsx
// Toggle dark mode (example)
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}
```

The design system ensures:
- Warm dark tones (not pure black)
- Reduced contrast for comfortable reading
- Appropriate color adjustments for all elements

## Accessibility

**Built-in:**
- Semantic HTML5 elements
- ARIA labels via Radix UI components
- Focus states with Oxford Blue ring
- Color contrast ratios meeting WCAG AA

**Test:**
```bash
# Install axe for accessibility testing
npm install --save-dev @axe-core/react
```

## Next Steps

1. **Update existing pages** to use scholarly typography
2. **Create academic-specific components** as needed
3. **Test color combinations** in both modes
4. **Gather user feedback** from editors/authors
5. **Refine** based on actual usage

## Resources

- [Full Design System Documentation](./DESIGN_SYSTEM.md)
- [Merriweather Font](https://fonts.google.com/specimen/Merriweather)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## Need Help?

Check the design system documentation or create an issue for:
- New component requests
- Color palette questions
- Typography decisions
- Accessibility concerns
