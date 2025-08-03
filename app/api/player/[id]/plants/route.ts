import { NextRequest, NextResponse } from "next/server";
import { getPlantsForPlayer } from "@/lib/queries/plant";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Player ID is required" },
      { status: 400 }
    );
  }

  try {
    const plants = await getPlantsForPlayer(id);
    if (!plants) {
      return NextResponse.json({ error: "Plants not found" }, { status: 404 });
    }

    return NextResponse.json(plants);
  } catch (error) {
    console.error("Failed to load player:", error);
    return NextResponse.json(
      { error: "Failed to load player" },
      { status: 500 }
    );
  }
}
