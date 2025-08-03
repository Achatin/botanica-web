"use client"
import { useGameState } from "@/hooks/use-game-state"
import { PLANT_TYPES } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SettingsPopup } from "@/components/gui/settings-popup"
import { useServer } from "@/hooks/use-server"

export function Sidebar() {
  const { id, coins, inventory, shop, weather, buySeeds, draggedPlant, setDraggedPlant } = useGameState()
  const { players, serverId } = useServer();

  const handlePlantClick = (plantType: string) => {
    if (inventory[plantType] > 0) {
      setDraggedPlant(draggedPlant === plantType ? null : plantType)
    }
  }

  const handleBuySeeds = (plantType: string) => {
    buySeeds(plantType, 1)
  }

  return (
    <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-gray-200 p-4 pt-8 overflow-y-auto">
      {/* Game Title */}
      <div className="text-center mb-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">Botanica</h1>
        <SettingsPopup /></div>
        <div className="flex justify-between items-center mt-2">
          <Badge variant="outline" className="bg-yellow-100">
            💰 {coins} coins
          </Badge>
          {weather && (
            <Badge variant="outline" className={`${weather.id === "night" ? "bg-purple-100" : "bg-blue-100"}`}>
              {weather.icon} {weather.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Players List */}
      <Card className="mb-4">
        <CardHeader className="">
          <CardTitle className="text-sm">{serverId}</CardTitle>
          <p className="text-xs text-gray-500">Room where you meet with other players</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ul>
            {players.map((p) => (
              <li key={p.id}>{p.id} {p.coins} coins 
              {p.id === id 
                ? (<span> (you)</span>)
                : (<Button variant="secondary" size="sm">Visit</Button>)}
              </li>))}
          </ul>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Inventory</CardTitle>
          <p className="text-xs text-gray-500">Click to select seeds for planting</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {Object.entries(inventory).map(([plantType, count]) => {
              const plant = PLANT_TYPES[plantType]
              if (!plant) return null;

              return count > 0 ? (
                <div
                  key={plantType}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    draggedPlant === plantType
                      ? "bg-green-200 border-2 border-green-400"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handlePlantClick(plantType)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: plant.color }} />
                    <span className="text-sm">{plant.name}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ) : null
            })}
          </div>
          {draggedPlant && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              Selected: {PLANT_TYPES[draggedPlant].name}. Click on the field to plant!
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Seed Shop */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Seed Shop</CardTitle>
          <p className="text-xs text-gray-500">Restocks every 5 minutes</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {Object.entries(shop).map(([plantType, stock]) => {
              const plant = PLANT_TYPES[plantType]
              return (
                <div key={plantType} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: plant.color }} />
                      <span className="text-sm font-medium">{plant.name}</span>
                    </div>
                    <Badge
                      variant={stock > 0 ? "default" : "secondary"}
                      className={stock > 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {stock} left
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div>💰 {plant.cost} coins</div>
                      <div>
                        📏 {plant.size.width}×{plant.size.height}
                      </div>
                      <div>⭐ {plant.rarity}</div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleBuySeeds(plantType)}
                      disabled={stock === 0 || coins < plant.cost}
                      className="text-xs"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
