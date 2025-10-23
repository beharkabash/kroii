# Quick Sanity Setup for KROI Auto Center

## Step 1: Add Schema to Your Sanity Studio

1. **Find your Sanity Studio folder** (the project you use for your other website)
2. **Open the `schemas` folder**
3. **Create new file: `car.ts`** (or `car.js`)
4. **Copy the entire contents from:** `/workspaces/kroii/kroi-auto-center/sanity-schemas/car.ts`
5. **Paste into your new `car.ts` file**

## Step 2: Register the Schema

Open `schemas/index.ts` (or `index.js`) and add:

```typescript
import car from './car'

export const schemaTypes = [
  car,
  // ... your existing schemas
]
```

## Step 3: Restart Sanity Studio

```bash
cd your-sanity-studio-folder
npm run dev
```

You should now see **"Autot / Cars" 🚗** in your Sanity Studio sidebar!

## Step 4: Add a Test Car

1. Click "Autot / Cars" in Sanity Studio
2. Click "Create new Car"
3. Fill in the required fields:
   - **Name**: e.g., "BMW 318 2017"
   - **Slug**: Click "Generate" button
   - **Brand**: Select BMW
   - **Model**: 318
   - **Year**: 2017
   - **Price**: 14100
   - **Kilometers**: 235000
   - **Fuel**: Diesel
   - **Transmission**: Automatic
   - **Category**: Sedan
   - **Main Image**: Upload a car photo
   - **Short Description**: Brief text
4. Click **Publish**

## Step 5: Verify on Website

Once you've added a car and published it, let me know! Then I'll update your Next.js site to fetch from Sanity.

---

## Important Notes:

✅ Your Sanity credentials are already configured in `.env.local`
✅ The Sanity client (`lib/sanity.ts`) is ready
✅ All queries are prepared
✅ I just need you to add the schema to your Studio!

**After you add the schema and publish a test car, tell me and I'll complete the integration!**
