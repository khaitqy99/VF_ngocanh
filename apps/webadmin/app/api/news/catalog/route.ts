import { NextResponse } from "next/server";
import { getAccessories, getCars, getScooters } from "@webclient/lib/cms";

export async function GET() {
  const [cars, scooters, accessories] = await Promise.all([
    getCars(),
    getScooters(),
    getAccessories(),
  ]);

  return NextResponse.json({
    cars: cars.map((item) => ({ id: item.id, name: item.name })),
    scooters: scooters.map((item) => ({ id: item.id, name: item.name })),
    accessories: accessories.map((item) => ({ id: item.id, name: item.name })),
  });
}
