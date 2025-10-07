#!/usr/bin/env python3
"""
Enhanced car inventory scraper with better timeout handling
"""

import asyncio
import json
import os
import re
from pathlib import Path
from urllib.parse import urljoin
import aiohttp
from playwright.async_api import async_playwright

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
        safe_name = re.sub(r'[^\w\s-]', '', name)
        safe_name = re.sub(r'[-\s]+', '-', safe_name)
        return safe_name.lower()[:50]

    async def scrape_all_cars(self):
        """Main scraping function with improved timeout handling"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=['--disable-blink-features=AutomationControlled']
            )
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            )
            page = await context.new_page()
            page.set_default_timeout(60000)  # 60 second timeout

            try:
                print(f"🌐 Navigating to: {self.all_cars_url}")

                # Try to load the page with more lenient settings
                try:
                    await page.goto(self.all_cars_url, wait_until='domcontentloaded', timeout=60000)
                    print("✓ Initial page load complete")
                except Exception as e:
                    print(f"⚠ Timeout on networkidle, trying with domcontentloaded: {e}")

                # Wait for content to appear
                await page.wait_for_timeout(5000)

                # Take screenshot to see what we got
                await page.screenshot(path='/home/behar/kroi-auto-center/page-loaded.png', full_page=True)
                print("✓ Screenshot saved")

                # Scroll to load all content
                print("📜 Scrolling to load all content...")
                for i in range(5):
                    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                    await page.wait_for_timeout(2000)
                    print(f"  Scroll {i+1}/5")

                # Get page HTML
                html = await page.content()
                with open('/home/behar/kroi-auto-center/page-full.html', 'w', encoding='utf-8') as f:
                    f.write(html)
                print("✓ HTML saved for inspection")

                # Try multiple selector strategies
                selectors_to_try = [
                    'article',
                    '.car-item',
                    '.vehicle-item',
                    '.product',
                    '.listing',
                    '[class*="car"]',
                    '[class*="vehicle"]',
                    '[class*="auto"]',
                    'div[class*="grid"] > div',
                    '.grid-item',
                    '.card'
                ]

                all_cars = []
                for selector in selectors_to_try:
                    try:
                        elements = await page.query_selector_all(selector)
                        if elements and len(elements) > 0:
                            print(f"✓ Found {len(elements)} elements with selector: {selector}")
                            all_cars.extend(elements)
                            # If we found a good number, use this selector
                            if len(elements) >= 5:
                                all_cars = elements
                                break
                    except:
                        pass

                # Remove duplicates
                all_cars = list(set(all_cars))
                print(f"\n📊 Total unique elements found: {len(all_cars)}")

                # Extract data from each car
                all_images_to_download = []
                car_index = 0

                for idx, car_elem in enumerate(all_cars):
                    try:
                        car_data = await self.extract_car_data_enhanced(car_elem, page, car_index)
                        if car_data and car_data.get('name'):
                            self.cars_data.append(car_data)
                            print(f"✓ [{car_index + 1}] {car_data['name']} - {car_data.get('price', 'N/A')}")
                            car_index += 1

                            # Collect images
                            if car_data.get('imageUrls'):
                                for img_idx, img_url in enumerate(car_data['imageUrls']):
                                    filename = car_data['images'][img_idx]
                                    all_images_to_download.append((img_url, filename))
                    except Exception as e:
                        pass  # Skip problematic elements

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

    async def extract_car_data_enhanced(self, car_elem, page, idx):
        """Enhanced car data extraction"""
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
            # Get all text content
            text_content = await car_elem.inner_text()
            html_content = await car_elem.inner_html()

            # Extract name from multiple sources
            for selector in ['h1', 'h2', 'h3', 'h4', '.title', '.name', '[class*="title"]', '[class*="name"]', 'a']:
                try:
                    elem = await car_elem.query_selector(selector)
                    if elem:
                        text = await elem.inner_text()
                        text = self.clean_text(text)
                        if text and len(text) > 5 and len(text) < 100:
                            # Check if it looks like a car name
                            if any(brand in text.upper() for brand in ['BMW', 'AUDI', 'VW', 'MERCEDES', 'TOYOTA', 'NISSAN', 'MAZDA', 'FORD', 'HONDA', 'VOLVO', 'PEUGEOT', 'RENAULT', 'SEAT', 'SKODA', 'KIA', 'HYUNDAI', 'LEXUS', 'OPEL', 'CITROEN', 'FIAT']):
                                car_data['name'] = text
                                break
                            elif not car_data['name']:
                                car_data['name'] = text
                except:
                    pass

            # Extract price
            price_patterns = [r'€\s*[\d\s,.]+', r'[\d\s,.]+\s*€', r'[\d\s,.]+\s*EUR']
            for pattern in price_patterns:
                match = re.search(pattern, text_content)
                if match:
                    car_data['price'] = match.group().strip()
                    break

            # Extract year
            year_match = re.search(r'\b(19|20)\d{2}\b', text_content)
            if year_match:
                car_data['year'] = year_match.group()

            # Extract fuel type
            fuel_keywords = ['bensiini', 'diesel', 'sähkö', 'hybridi', 'petrol', 'electric', 'gas']
            for fuel in fuel_keywords:
                if fuel in text_content.lower():
                    car_data['fuel'] = fuel.capitalize()
                    break

            # Extract transmission
            trans_keywords = ['automaatti', 'manuaali', 'automatic', 'manual']
            for trans in trans_keywords:
                if trans in text_content.lower():
                    car_data['transmission'] = trans.capitalize()
                    break

            # Extract mileage
            km_match = re.search(r'[\d\s,.]+\s*km', text_content.lower())
            if km_match:
                car_data['km'] = km_match.group().strip()

            # Extract images
            img_elements = await car_elem.query_selector_all('img')
            safe_name = self.sanitize_filename(car_data.get('name', f'car-{idx}'))

            for img_idx, img in enumerate(img_elements):
                img_url = await img.get_attribute('src') or await img.get_attribute('data-src') or await img.get_attribute('data-lazy-src')

                if img_url and not any(skip in img_url.lower() for skip in ['logo', 'icon', 'placeholder', 'avatar']):
                    # Make absolute URL
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    elif img_url.startswith('/'):
                        img_url = urljoin(self.base_url, img_url)
                    elif not img_url.startswith('http'):
                        img_url = urljoin(self.base_url, img_url)

                    filename = f"{safe_name}-{img_idx + 1}.jpg"
                    car_data['imageUrls'].append(img_url)
                    car_data['images'].append(filename)

            if car_data['images']:
                car_data['mainImage'] = car_data['images'][0]

        except Exception as e:
            print(f"✗ Error in extract_car_data_enhanced: {e}")

        return car_data

    def save_data(self):
        """Save extracted data to JSON"""
        output_file = "/home/behar/kroi-auto-center/public/cars/cars-data.json"

        cleaned_data = []
        for car in self.cars_data:
            if car.get('name'):
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
        print(f"✓ Data saved to: {output_file}")
        print(f"✓ Total cars: {len(cleaned_data)}")
        print(f"✓ Total images: {sum(len(car['images']) for car in cleaned_data)}")
        print(f"{'='*60}")

async def main():
    scraper = KroiAutoScraper()
    await scraper.scrape_all_cars()
    scraper.save_data()

if __name__ == '__main__':
    asyncio.run(main())