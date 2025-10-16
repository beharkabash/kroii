# KROI Auto Center UI Component Library

Kattava, ammattimainen UI-komponenttikirjasto joka on rakennettu KROI Auto Centerin brändin mukaisesti. Sisältää kaikki tarvittavat komponentit modernin autoliikkeen verkkosivuston rakentamiseen.

## 🎨 Ominaisuudet

- **React 19 & Next.js 15** - Uusimmat teknologiat
- **TypeScript** - Täysi tyyppiturvallisuus
- **Framer Motion** - Sujuvat animaatiot
- **Tailwind CSS** - Moderni tyylittely
- **Suomenkielinen** - Kaikki tekstit suomeksi
- **Purple/Pink brändäys** - KROI Auto Centerin värimaailma
- **Mobile-first** - Responsiivinen suunnittelu
- **Saavutettavuus** - WCAG 2.1 AA standardien mukainen

## 📦 Komponentit

### Lomakekomponentit

#### Input
```tsx
import { Input } from '@/app/components/ui';

<Input
  label="Sähköposti"
  type="email"
  placeholder="sähköpostisi@email.com"
  required
  error="Virheellinen sähköpostiosoite"
/>
```

#### Select
```tsx
import { Select } from '@/app/components/ui';

<Select
  label="Valitse auto"
  options={[
    { value: 'bmw', label: 'BMW' },
    { value: 'audi', label: 'Audi' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
  ]}
  placeholder="Valitse merkki..."
/>
```

### Napit

#### Button
```tsx
import { Button } from '@/app/components/ui';

<Button variant="primary" size="lg" loading={isLoading}>
  Lähetä viesti
</Button>
```

### Layout-komponentit

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>BMW 320d</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Hieno auto hyvässä kunnossa</p>
  </CardContent>
</Card>
```

#### Modal
```tsx
import { Modal, ModalBody, ModalFooter } from '@/app/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Ota yhteyttä"
  size="lg"
>
  <ModalBody>
    <p>Täytä lomake alle</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Sulje</Button>
  </ModalFooter>
</Modal>
```

#### OptimizedImage
```tsx
import { OptimizedImage } from '@/app/components/ui';

<OptimizedImage
  src="/images/car.jpg"
  alt="BMW 320d"
  width={800}
  height={600}
  zoomable
  downloadable
  lazy
/>
```

### Palautekomponentit

#### Badge
```tsx
import { Badge, StatusBadge, CountBadge } from '@/app/components/ui';

<Badge variant="success">Myyty</Badge>
<StatusBadge status="active" />
<CountBadge count={5} />
```

#### Tooltip
```tsx
import { Tooltip, SimpleTooltip } from '@/app/components/ui';

<Tooltip content="Tämä on tooltip" position="top">
  <button>Hover me</button>
</Tooltip>

<SimpleTooltip text="Yksinkertainen tooltip">
  <span>?</span>
</SimpleTooltip>
```

#### Loading States
```tsx
import {
  LoadingSpinner,
  PageLoading,
  CarSkeleton,
  FormSkeleton
} from '@/app/components/ui';

// Yksinkertainen spinner
<LoadingSpinner size="lg" />

// Koko sivun lataus
<PageLoading title="Ladataan autoja..." />

// Auto-kortit skeleton
<CarSkeleton count={6} />

// Lomakkeen skeleton
<FormSkeleton />
```

#### Error Handling
```tsx
import { ErrorBoundary, ErrorFallback } from '@/app/components/ui';

// Wrap components with error boundary
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// Custom error fallback
<ErrorFallback
  error={error}
  reset={() => window.location.reload()}
/>
```

## 🎨 Teeman käyttö

### Värit
```tsx
import { colors, getColor } from '@/app/components/ui';

// Suora käyttö
const primaryColor = colors.primary[600]; // #9333ea

// Apufunktio
const secondaryColor = getColor('secondary', 500); // #ec4899
```

### Käännökset
```tsx
import { translations, t } from '@/app/components/ui';

// Suora käyttö
const saveText = translations.save; // "Tallenna"

// Apufunktio
const loadingText = t('loading'); // "Ladataan..."
```

### Responsiivisuus
```tsx
import { breakpoints, getBreakpoint } from '@/app/components/ui';

// Tailwind CSS luokkien kanssa
<div className="w-full md:w-1/2 lg:w-1/3">

// JavaScript-koodissa
const tabletBreakpoint = getBreakpoint('md'); // "768px"
```

## 📱 Responsiivinen suunnittelu

Kaikki komponentit on suunniteltu mobile-first periaatteella:

```tsx
// Automaattisesti responsiivinen
<Input fullWidth /> // 100% leveä mobiilissa, sopiva desktop-koossa

// Grid-layout autojen näyttämiseen
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {cars.map(car => <CarCard key={car.id} car={car} />)}
</div>
```

## 🌟 Animaatiot

Kaikki komponentit sisältävät Framer Motion animaatiot:

```tsx
// Automaattiset hover-animaatiot
<Button>Animoitu nappi</Button>

// Card hover-efektit
<Card hoverable>Hover minua</Card>

// Modal entrance/exit animaatiot
<Modal>Animoitu modal</Modal>
```

## 🔧 Mukautus

### Tyylien ylikirjoittaminen
```tsx
// Tailwind CSS luokilla
<Button className="bg-green-500 hover:bg-green-600">
  Vihreä nappi
</Button>

// Custom CSS muuttujilla
<div style={{ '--primary-color': '#custom-color' }}>
  <Button>Custom väri</Button>
</div>
```

### Uusien varianttien lisääminen
```tsx
// Laajenna Button-komponenttia
<Button variant="custom" className="bg-gradient-to-r from-blue-500 to-purple-500">
  Custom gradientti
</Button>
```

## 📋 Parhaita käytäntöjä

1. **Käytä aina TypeScriptia** - Kaikki propsit on tyypitetty
2. **Testaa mobile-koossa** - Mobile-first suunnittelu
3. **Käytä semanttisia HTML-tageja** - Saavutettavuus
4. **Optimoi kuvat** - Käytä OptimizedImage-komponenttia
5. **Käsittele virheet** - Käytä ErrorBoundary-komponenttia

## 🚀 Esimerkkisovellus

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Badge
} from '@/app/components/ui';

function CarCard({ car }) {
  return (
    <Card variant="elevated" hoverable>
      <CardHeader>
        <CardTitle>{car.name}</CardTitle>
        <Badge variant="success">{car.price}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <OptimizedImage
            src={car.image}
            alt={car.name}
            zoomable
          />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Vuosi: {car.year}</span>
            <span>Polttoaine: {car.fuel}</span>
          </div>
          <Button fullWidth variant="primary">
            Ota yhteyttä
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 📞 Tuki

Jos tarvitset apua komponenttikirjaston kanssa:

- **Sähköposti**: kroiautocenter@gmail.com
- **Puhelin**: +358 41 3188214
- **Dokumentaatio**: Katso tämä README.md

---

**KROI Auto Center UI Component Library v1.0.0**
Rakennettu ❤️:llä Suomessa