# Sanity Studio Setup for KROI Auto Center

## Step 1: Add Schema to Your Existing Sanity Studio

1. Go to your Sanity Studio project folder (the one you use for your other website)
2. Navigate to the `schemas` folder
3. Copy the file `/sanity-schemas/car.ts` from this project
4. Paste it into your Sanity Studio's `schemas` folder
5. Open `schemas/index.ts` (or `schemas/index.js`) and add:

```typescript
import car from './car'

export const schemaTypes = [
  car,
  // ...your other schemas
]
```

6. Run `npm run dev` in your Sanity Studio
7. You should now see "Autot / Cars" in your Sanity Studio menu

## Step 2: Add Your First Car

1. Click "Autot / Cars" in the sidebar
2. Click "Create new Car"
3. Fill in the fields:
   - **Name**: e.g., "BMW 318 2017"
   - **Click "Generate" next to Slug** (creates URL automatically)
   - **Brand**: Select from dropdown (BMW, Audi, etc.)
   - **Model**: e.g., "318"
   - **Year**: e.g., "2017"
   - **Price**: e.g., 14100
   - **Kilometers**: e.g., 235000
   - **Fuel**: Select (Diesel, Bensiini, etc.)
   - **Transmission**: Automatic or Manual
   - **Category**: SUV, Sedan, etc.
   - **Main Image**: Upload the main car photo
   - **Gallery**: Upload additional photos
   - **Short Description**: Brief description
   - **Features**: Add features like "Ilmastointi", "Nahkapenkit", etc.
4. Click **Publish**

## Step 3: Verify Connection

Your KROI Auto Center website is already configured with:
- Project ID: `j2t31xge`
- Dataset: `production`
- API Token: Already set up

The website will automatically fetch cars from Sanity!

## Managing Both Websites from One Studio

### Option A: Same Studio, Different Datasets (Recommended)
- Website 1: Uses `production` dataset
- KROI Auto: Uses `kroiautocenter` dataset (create new)

To create a new dataset:
1. Go to https://sanity.io/manage
2. Select project `j2t31xge`
3. Go to "Datasets"
4. Click "Add dataset"
5. Name it "kroiautocenter"
6. Update `.env.local` to use this dataset

### Option B: Keep Using `production` Dataset
- Both sites can share the same dataset
- Use different document types (car vs your other content)
- Sanity Studio will show both in the same interface

## Next Steps

Once you've added the schema and published a car in Sanity:
1. Restart your Next.js dev server: `npm run dev`
2. Go to `http://localhost:3000/cars`
3. Your Sanity cars will appear!

## Benefits

✅ Manage cars from Sanity mobile app
✅ Automatic image optimization and CDN
✅ Real-time updates (no rebuild needed)
✅ Version history and backup
✅ Professional CMS interface
