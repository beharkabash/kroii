#!/usr/bin/env python3
"""
Final car scraper - uses multiple strategies to extract all cars
"""

import asyncio
import json
import re
from pathlib import Path
from urllib.parse import urljoin
import aiohttp
from playwright.async_api import async_playwright

class KroiAutoScraperFinal:
    def __init__(self):
        self.base_url = "https://kroiautocenter.fi"
        self.cars_data = []
        self.image_dir = Path("/home/behar/kroi-auto-center/public/cars")
        self.image_dir.mkdir(parents=True, exist_ok=True)

    async def download_image(self, session, url, filename):
        """Download a single image"""
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    content = await response.read()
                    filepath = self.image_dir / filename
                    with open(filepath, 'wb') as f:
                        f.write(content)
                    print(f"  ✓ {filename}")
                    return True
        except Exception as e:
            print(f"  ✗ {filename}: {e}")
        return False

    def sanitize_filename(self, name):
        """Create safe filename"""
        safe_name = re.sub(r'[^\w\s-]', '', name)
        safe_name = re.sub(r'[-\s]+', '-', safe_name)
        return safe_name.lower()[:50]

    async def scrape_homepage(self):
        """Scrape from homepage which shows all cars"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
            page = await context.new_page()
            page.set_default_timeout(60000)

            try:
                print("🌐 Loading homepage...")
                await page.goto(self.base_url, wait_until='domcontentloaded', timeout=60000)
                await page.wait_for_timeout(5000)

                # Scroll to load content
                for i in range(10):
                    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                    await page.wait_for_timeout(1500)

                print("📊 Extracting car data...")

                # Try to find car grid/section
                html = await page.content()

                # Look for car sections with images and text
                car_sections = await page.query_selector_all('[class*="u-repeater"], [class*="card"], [data-id]')
                print(f"Found {len(car_sections)} potential sections")

                # Process each section
                for idx, section in enumerate(car_sections):
                    try:
                        text = await section.inner_text()
                        text = text.strip()

                        # Check if this looks like a car listing
                        has_car_brand = any(brand in text for brand in [
                            'BMW', 'Audi', 'Mercedes', 'Skoda', 'VW', 'Volkswagen',
                            'Toyota', 'Mazda', 'Nissan', 'Ford', 'Honda', 'Volvo'
                        ])

                        has_price = '€' in text or 'EUR' in text
                        has_year = bool(re.search(r'\b(19|20)\d{2}\b', text))

                        if has_car_brand and (has_price or has_year):
                            car_data = await self.extract_from_section(section, idx)
                            if car_data and car_data.get('name'):
                                self.cars_data.append(car_data)
                                print(f"✓ [{len(self.cars_data)}] {car_data['name']} - {car_data.get('price', 'N/A')}")

                    except Exception as e:
                        pass

                # If we didn't find enough cars, parse from HTML directly
                if len(self.cars_data) < 5:
                    print("\n⚠ Few cars found, parsing HTML directly...")
                    await self.parse_from_html(html, page)

                print(f"\n✓ Total cars extracted: {len(self.cars_data)}")

                # Download images
                await self.download_all_images()

            except Exception as e:
                print(f"✗ Error: {e}")
                import traceback
                traceback.print_exc()
            finally:
                await browser.close()

    async def extract_from_section(self, section, idx):
        """Extract car data from a section"""
        car_data = {
            'name': '',
            'price': '',
            'year': '',
            'fuel': '',
            'transmission': '',
            'km': '',
            'images': [],
            'imageUrls': [],
            'mainImage': ''
        }

        try:
            text = await section.inner_text()

            # Extract name (first line usually)
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            for line in lines:
                if any(brand in line for brand in ['BMW', 'Audi', 'Mercedes', 'Skoda', 'VW']):
                    car_data['name'] = line
                    break

            # Extract price
            price_match = re.search(r'€\s*[\d,.\s]+|[\d,.\s]+\s*€', text)
            if price_match:
                car_data['price'] = price_match.group().strip()

            # Extract year
            year_match = re.search(r'\b(19|20)\d{2}\b', text)
            if year_match:
                car_data['year'] = year_match.group()

            # Extract fuel
            if 'diesel' in text.lower():
                car_data['fuel'] = 'Diesel'
            elif 'bensiini' in text.lower() or 'petrol' in text.lower():
                car_data['fuel'] = 'Bensiini'
            elif 'sähkö' in text.lower() or 'electric' in text.lower():
                car_data['fuel'] = 'Sähkö'

            # Extract transmission
            if 'automaatt' in text.lower():
                car_data['transmission'] = 'Automaattinen'
            elif 'manuaal' in text.lower():
                car_data['transmission'] = 'Manuaalinen'

            # Extract km
            km_match = re.search(r'[\d\s]+\s*km', text.lower())
            if km_match:
                car_data['km'] = km_match.group().strip()

            # Extract images
            imgs = await section.query_selector_all('img')
            safe_name = self.sanitize_filename(car_data.get('name', f'car-{idx}'))

            for img_idx, img in enumerate(imgs):
                src = await img.get_attribute('src') or await img.get_attribute('data-src')
                if src and not any(skip in src.lower() for skip in ['logo', 'icon', 'placeholder']):
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = urljoin(self.base_url, src)

                    filename = f"{safe_name}-{img_idx + 1}.jpg"
                    car_data['imageUrls'].append(src)
                    car_data['images'].append(filename)

            if car_data['images']:
                car_data['mainImage'] = car_data['images'][0]

        except Exception as e:
            print(f"✗ Error extracting from section: {e}")

        return car_data

    async def parse_from_html(self, html, page):
        """Parse cars directly from HTML when selectors fail"""
        # Find all image URLs that look like car photos
        img_pattern = r'https://kroiautocenter\.fi/wp-content/uploads/[^"\']+\.(?:jpg|jpeg|png)'
        image_urls = list(set(re.findall(img_pattern, html)))

        print(f"Found {len(image_urls)} potential car images")

        # Look for car data in text blocks
        # Pattern: Brand Model + details
        text_blocks = re.findall(r'((?:BMW|Skoda|Audi|Mercedes|VW|Volkswagen|Toyota|Mazda)[^<>]{20,200})', html)

        print(f"Found {len(text_blocks)} text blocks with car brands")

        # Try to match cars with images
        car_index = len(self.cars_data)

        for i, block in enumerate(text_blocks):
            # Clean the text
            block = re.sub(r'&nbsp;', ' ', block)
            block = re.sub(r'\s+', ' ', block)

            # Extract car name
            name_match = re.search(r'((?:BMW|Skoda|Audi|Mercedes|VW)[^€\d]{3,50})', block)
            if not name_match:
                continue

            car_data = {
                'name': name_match.group(1).strip(),
                'price': '',
                'year': '',
                'fuel': '',
                'transmission': '',
                'km': '',
                'images': [],
                'imageUrls': [],
                'mainImage': ''
            }

            # Extract other details
            price_match = re.search(r'€[\d,.\s]+|[\d,.\s]+€', block)
            if price_match:
                car_data['price'] = price_match.group().strip()

            year_match = re.search(r'\b(19|20)\d{2}\b', block)
            if year_match:
                car_data['year'] = year_match.group()

            if 'diesel' in block.lower():
                car_data['fuel'] = 'Diesel'
            if 'automaatt' in block.lower():
                car_data['transmission'] = 'Automaattinen'

            km_match = re.search(r'([\d\s]+)\s*/?\s*(?=Diesel|Bensiini)', block)
            if km_match:
                car_data['km'] = km_match.group(1).strip() + ' km'

            # Assign images (simplified - assign in order)
            if i < len(image_urls):
                safe_name = self.sanitize_filename(car_data['name'])
                filename = f"{safe_name}-1.jpg"
                car_data['imageUrls'].append(image_urls[i])
                car_data['images'].append(filename)
                car_data['mainImage'] = filename

            # Only add if we have essential data
            if car_data['name'] and len(car_data['name']) > 3:
                # Check if not duplicate
                if not any(c['name'] == car_data['name'] for c in self.cars_data):
                    self.cars_data.append(car_data)
                    print(f"✓ Parsed: {car_data['name']}")

    async def download_all_images(self):
        """Download all car images"""
        all_images = []
        for car in self.cars_data:
            for i, url in enumerate(car.get('imageUrls', [])):
                filename = car['images'][i]
                all_images.append((url, filename))

        if all_images:
            print(f"\n📥 Downloading {len(all_images)} images...")
            async with aiohttp.ClientSession() as session:
                tasks = [self.download_image(session, url, fname) for url, fname in all_images]
                await asyncio.gather(*tasks)

    def save_data(self):
        """Save to JSON"""
        output_file = "/home/behar/kroi-auto-center/public/cars/cars-data.json"

        cleaned_data = []
        for car in self.cars_data:
            if car.get('name') and len(car['name']) > 3:
                cleaned_data.append({
                    'name': car['name'],
                    'price': car['price'],
                    'year': car['year'],
                    'fuel': car['fuel'],
                    'transmission': car['transmission'],
                    'km': car['km'],
                    'images': car['images'],
                    'mainImage': car['mainImage']
                })

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

        print(f"\n{'='*60}")
        print(f"✅ COMPLETE!")
        print(f"{'='*60}")
        print(f"✓ Data saved: {output_file}")
        print(f"✓ Total cars: {len(cleaned_data)}")
        print(f"✓ Total images: {sum(len(car['images']) for car in cleaned_data)}")
        print(f"{'='*60}\n")

        # Print summary
        for i, car in enumerate(cleaned_data, 1):
            print(f"{i}. {car['name']} - {car['price']}")

async def main():
    scraper = KroiAutoScraperFinal()
    await scraper.scrape_homepage()
    scraper.save_data()

if __name__ == '__main__':
    asyncio.run(main())