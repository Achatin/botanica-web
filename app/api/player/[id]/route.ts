import { NextRequest, NextResponse } from "next/server";
import { getPlayerById } from "@/lib/queries/player";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Player ID is required" },
      { status: 400 }
    );
  }

  try {
    const player = await getPlayerById(id);
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Parse inventory before returning
    const parsedPlayer = {
      ...player,
      inventory: player.inventory ? JSON.parse(player.inventory) : {},
    };

    return NextResponse.json(parsedPlayer);
  } catch (error) {
    console.error("Failed to load player:", error);
    return NextResponse.json(
      { error: "Failed to load player" },
      { status: 500 }
    );
  }
}
