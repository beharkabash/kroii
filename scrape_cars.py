#!/usr/bin/env python3
"""
Complete car inventory scraper for kroiautocenter.fi
Extracts all cars from all pages with full details and images
"""

import asyncio
import json
import os
import re
from pathlib import Path
from urllib.parse import urljoin
import aiohttp
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

class KroiAutoScraper:
    def __init__(self):
        self.base_url = "https://kroiautocenter.fi"
        self.all_cars_url = "https://kroiautocenter.fi/kaikki-autot/"
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
                    print(f"✓ Downloaded: {filename}")
                    return True
        except Exception as e:
            print(f"✗ Failed to download {filename}: {e}")
        return False

    async def download_images(self, images):
        """Download multiple images concurrently"""
        async with aiohttp.ClientSession() as session:
            tasks = []
            for img_url, filename in images:
                tasks.append(self.download_image(session, img_url, filename))
            await asyncio.gather(*tasks)

    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        return " ".join(text.strip().split())

    def sanitize_filename(self, name):
        """Create safe filename from car name"""
        # Remove special characters and spaces
        safe_name = re.sub(r'[^\w\s-]', '', name)
        safe_name = re.sub(r'[-\s]+', '-', safe_name)
        return safe_name.lower()[:50]  # Limit length

    async def scrape_all_cars(self):
        """Main scraping function"""
        async with async_playwright() as p:
            # Launch browser
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
            page = await context.new_page()

            try:
                print(f"🌐 Navigating to: {self.all_cars_url}")
                await page.goto(self.all_cars_url, wait_until='networkidle', timeout=30000)
                await page.wait_for_timeout(2000)  # Wait for dynamic content

                # Check for pagination or load more buttons
                page_num = 1
                all_images_to_download = []

                while True:
                    print(f"\n📄 Processing page {page_num}...")

                    # Extract cars from current page
                    cars = await page.query_selector_all('.car-item, .vehicle-item, article, .product, .car-listing, .vehicle-card')

                    # If no cars found with common selectors, try to find the actual structure
                    if not cars:
                        print("⚠ Analyzing page structure...")
                        # Take screenshot for debugging
                        await page.screenshot(path='/home/behar/kroi-auto-center/page-structure.png')

                        # Try to find all links that might be cars
                        all_links = await page.query_selector_all('a[href*="auto"], a[href*="car"], a[href*="vehicle"]')
                        print(f"Found {len(all_links)} potential car links")

                        # Try generic article/div structures
                        cars = await page.query_selector_all('article, .entry, .item, .listing, div[class*="car"], div[class*="vehicle"], div[class*="product"]')

                    print(f"Found {len(cars)} potential car elements on page {page_num}")

                    if not cars:
                        # Last resort: extract all content and parse
                        print("🔍 Using fallback extraction method...")
                        html_content = await page.content()

                        # Save HTML for manual inspection if needed
                        with open('/home/behar/kroi-auto-center/page-source.html', 'w', encoding='utf-8') as f:
                            f.write(html_content)

                        break

                    # Process each car
                    for idx, car_elem in enumerate(cars):
                        try:
                            car_data = await self.extract_car_data(car_elem, page, idx, page_num)
                            if car_data and car_data.get('name'):
                                self.cars_data.append(car_data)
                                print(f"✓ Extracted: {car_data['name']}")

                                # Collect images for batch download
                                if car_data.get('imageUrls'):
                                    for img_idx, img_url in enumerate(car_data['imageUrls']):
                                        filename = car_data['images'][img_idx]
                                        all_images_to_download.append((img_url, filename))
                        except Exception as e:
                            print(f"✗ Error extracting car {idx}: {e}")

                    # Check for next page / load more
                    next_button = await page.query_selector('a.next, button.load-more, .pagination .next, [class*="next-page"]')

                    if next_button:
                        print("→ Found next page button, clicking...")
                        await next_button.click()
                        await page.wait_for_timeout(3000)  # Wait for new content
                        page_num += 1
                    else:
                        # Try scrolling to trigger infinite scroll
                        previous_height = await page.evaluate('document.body.scrollHeight')
                        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                        await page.wait_for_timeout(2000)
                        new_height = await page.evaluate('document.body.scrollHeight')

                        if new_height > previous_height:
                            print("→ Loaded more content via scroll")
                            page_num += 1
                        else:
                            print("✓ No more pages found")
                            break

                print(f"\n✓ Total cars extracted: {len(self.cars_data)}")

                # Download all images
                if all_images_to_download:
                    print(f"\n📥 Downloading {len(all_images_to_download)} images...")
                    await self.download_images(all_images_to_download)

            except Exception as e:
                print(f"✗ Error during scraping: {e}")
                import traceback
                traceback.print_exc()
            finally:
                await browser.close()

    async def extract_car_data(self, car_elem, page, idx, page_num):
        """Extract data from a single car element"""
        car_data = {
            'name': '',
            'price': '',
            'year': '',
            'fuel': '',
            'transmission': '',
            'km': '',
            'images': [],
            'imageUrls': [],
            'mainImage': '',
            'details': {}
        }

        # Extract car name/title
        for selector in ['h2', 'h3', '.title', '.name', '.car-name', 'a[title]']:
            try:
                elem = await car_elem.query_selector(selector)
                if elem:
                    text = await elem.inner_text()
                    if text and len(text.strip()) > 3:
                        car_data['name'] = self.clean_text(text)
                        break
            except:
                pass

        # If still no name, try getting from link title
        if not car_data['name']:
            try:
                link = await car_elem.query_selector('a[title]')
                if link:
                    car_data['name'] = await link.get_attribute('title')
            except:
                pass

        # Extract price
        for selector in ['.price', '[class*="price"]', '[class*="hinta"]']:
            try:
                elem = await car_elem.query_selector(selector)
                if elem:
                    text = await elem.inner_text()
                    if '€' in text or 'eur' in text.lower():
                        car_data['price'] = self.clean_text(text)
                        break
            except:
                pass

        # Extract specifications
        try:
            spec_elements = await car_elem.query_selector_all('.spec, .detail, [class*="spec"]')
            for spec in spec_elements:
                text = await spec.inner_text()
                text = self.clean_text(text)

                # Year detection
                if re.search(r'\b(19|20)\d{2}\b', text):
                    car_data['year'] = re.search(r'\b(19|20)\d{2}\b', text).group()

                # Fuel type
                if any(fuel in text.lower() for fuel in ['bensiini', 'diesel', 'sähkö', 'hybridi', 'petrol', 'electric']):
                    car_data['fuel'] = text

                # Transmission
                if any(trans in text.lower() for trans in ['automaatti', 'manuaali', 'automatic', 'manual']):
                    car_data['transmission'] = text

                # Mileage
                if 'km' in text.lower():
                    car_data['km'] = text
        except:
            pass

        # Extract images
        try:
            img_elements = await car_elem.query_selector_all('img')
            safe_name = self.sanitize_filename(car_data.get('name', f'car-{page_num}-{idx}'))

            for img_idx, img in enumerate(img_elements):
                img_url = await img.get_attribute('src')
                if not img_url:
                    img_url = await img.get_attribute('data-src')

                if img_url and not any(skip in img_url for skip in ['logo', 'icon', 'placeholder']):
                    # Make absolute URL
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    elif img_url.startswith('/'):
                        img_url = urljoin(self.base_url, img_url)

                    filename = f"{safe_name}-{img_idx + 1}.jpg"
                    car_data['imageUrls'].append(img_url)
                    car_data['images'].append(filename)

            if car_data['images']:
                car_data['mainImage'] = car_data['images'][0]
        except Exception as e:
            print(f"✗ Error extracting images: {e}")

        return car_data

    def save_data(self):
        """Save extracted data to JSON"""
        output_file = "/home/behar/kroi-auto-center/public/cars/cars-data.json"

        # Clean data before saving
        cleaned_data = []
        for car in self.cars_data:
            if car.get('name'):  # Only include cars with at least a name
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

        print(f"\n✓ Data saved to: {output_file}")
        print(f"✓ Total cars: {len(cleaned_data)}")
        print(f"✓ Total images: {sum(len(car['images']) for car in cleaned_data)}")

async def main():
    scraper = KroiAutoScraper()
    await scraper.scrape_all_cars()
    scraper.save_data()

    print("\n" + "="*60)
    print("SCRAPING COMPLETE!")
    print("="*60)

if __name__ == '__main__':
    asyncio.run(main())