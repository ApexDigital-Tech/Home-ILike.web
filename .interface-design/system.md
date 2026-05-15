# I Like Home Visual System

## Direction And Feel

I Like Home should feel like a real visit to a desirable home: warm light, thoughtful rooms, clear decisions, and calm commercial confidence. The brand is not a cold property portal. It is an expert guide for people buying or selling a place where life will happen.

Use language that is direct, human, and sales-oriented without pressure. Prefer phrases around home, visits, valuation, neighborhood fit, offer, presentation, and next step.

## Domain Concepts

- Home visits
- Neighborhood fit
- Valuation and defensible pricing
- Property presentation
- Buyer confidence
- Seller strategy
- Patio, porch, terrace, garden, key, door, room flow

## Color World

Colors should come from a lived-in, premium home environment:

- Limewashed wall: warm off-white canvas
- Linen: clean light surfaces
- Cedar and walnut: structure, trust, editorial depth
- Olive door: primary grounded action color
- Terracotta key: warm commercial accent for highlights and calls to action
- Porch beige: soft secondary surface

Official palette tokens:

```css
--brown-luxury: #2f241f;
--olive-premium: #6b7c5e;
--accent-gold: #c67a46;
--soft-ivory: #f7f3ee;
--ivory-raised: #fffaf4;
--brown-soft: rgba(47, 36, 31, 0.12);
--brown-line: rgba(47, 36, 31, 0.18);
--brown-strong: rgba(47, 36, 31, 0.32);
```

## Depth Strategy

Use subtle shadows and soft translucent borders. The brand should feel premium and tactile, not flat, but shadows must stay quiet.

- Hero overlay can be deep and cinematic when placed over real property photography.
- Cards use soft lift with warm brown shadows.
- Forms and search panels may use glass-like warm linen surfaces over imagery.
- Borders should be low-contrast brown rgba, never harsh gray or black.

## Typography

Use Montserrat for the brand system. Headlines and brand moments may use Extra Bold Italic. Navigation, labels, buttons, metadata, and form controls use Montserrat Medium/Bold.

Headlines should be large, confident, and editorial. Supporting copy should be calm and readable. Labels should be compact, uppercase, and practical.

## Spacing And Radius

Base spacing unit: `8px`.

Use generous vertical spacing for marketing sections, with compact internal spacing inside forms and cards. Common section width is `min(1180px, calc(100% - 40px))`.

Radius scale:

```css
--radius-small: 10px;
--radius-medium: 18px;
--radius-large: 28px;
```

Use pill radius only for navigation capsules, segmented controls, and primary buttons.

## Signature Pattern

The signature element is a split buying/selling experience anchored by a warm property image and a practical finder card. The landing should immediately let visitors self-identify as buyers or sellers.

Repeat the signature through:

- Segmented Comprar/Vender controls
- Paired CTAs for "Quiero comprar" and "Quiero vender"
- Buyer journey steps
- Seller valuation band
- Contact form with intent selection

## Component Patterns

### Header

Use a fixed, rounded, translucent header over the hero. Brand mark can be a compact circular monogram. Navigation stays minimal: Comprar, Vender, Propiedades, Contacto.

### Hero

The first viewport must show the brand name prominently, a real home/property image, and the next action. Avoid abstract gradients or decorative illustrations. Hero text should sit directly over imagery, not inside a card.

### Finder Card

Use a warm linen glass panel with a Comprar/Vender segmented control, location field, property type, budget, and a single action button.

### Property Cards

Cards should show real property imagery, title, area/context, key traits, and price. Keep card corners moderate and use warm shadows. One featured card may be lifted slightly on desktop.

### Seller Band

Use a strong cedar/walnut full-width band for seller conversion. The CTA should be concise and valuation-focused.

### Forms

Forms should feel simple and approachable. Use soft inset controls, olive action buttons, and brief confirmation feedback when submitted.

## Defaults To Avoid

- Generic blue real estate palette
- Cold white/gray property marketplace styling
- Overly glossy luxury black-and-gold treatment
- Decorative icons that do not help decision-making
- Generic hero split with text card on one side and image card on the other
- One-note beige-only pages without olive or terracotta contrast
