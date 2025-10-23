import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const CARS_FILE = join(process.cwd(), 'app', 'data', 'cars-dynamic.json');

// GET - Read all cars
export async function GET() {
  try {
    console.log('API: Reading from:', CARS_FILE);
    console.log('API: File exists:', existsSync(CARS_FILE));
    
    const data = await readFile(CARS_FILE, 'utf-8');
    const cars = JSON.parse(data);
    
    console.log('API: Found cars:', cars.length);
    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error('API: Error reading cars:', error);
    // If file doesn't exist, return empty array
    return NextResponse.json({ success: true, cars: [] });
  }
}

// POST - Save all cars
export async function POST(request: NextRequest) {
  try {
    const { cars } = await request.json();
    
    if (!Array.isArray(cars)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Save to JSON file
    await writeFile(CARS_FILE, JSON.stringify(cars, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Cars saved successfully',
      count: cars.length
    });
  } catch (error) {
    console.error('Error saving cars:', error);
    return NextResponse.json(
      { error: 'Failed to save cars' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a car
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('id');

    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      );
    }

    // Read current cars
    const data = await readFile(CARS_FILE, 'utf-8');
    const cars = JSON.parse(data);

    // Filter out the car
    const updatedCars = cars.filter((car: any) => car.id !== carId);

    // Save back
    await writeFile(CARS_FILE, JSON.stringify(updatedCars, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    );
  }
}
