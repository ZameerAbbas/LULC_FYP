

"use client"

import { useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"

// Center on Chalt Nager
const CENTER = [33.515, 73.072]
const ZOOM = 12

// GEE asset tile URLs
const TILE_URLS = {
  "LULC 2015":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/e8ad02bb69c3baad22fb19c502a4c7ac-076731c8b7243ac339b32cf194c8bbaf/tiles/{z}/{x}/{y}",
  "LULC 2020":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/83059e8e73d3b1fefded4fdd4b93fe4d-2f821c4e21f1c06b23a2b5cd17666074/tiles/{z}/{x}/{y}",
  "LULC 2024":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/94b8b3219dca2ed00a11b86f07b95671-5290fbeada50c7b57b004abbe1a1dc50/tiles/{z}/{x}/{y}",
}

const legendItems = [
  { name: "Built-up", color: "#d73027" },
  { name: "Agriculture", color: "#98ff00" },
  { name: "Vegetation", color: "#479f2e" },
  { name: "Glacier", color: "#148bff" },
  { name: "Barren", color: "#d0d6ff" },
]

const MapGEE = () => {
  const [selectedLayers, setSelectedLayers] = useState<any>({
    "LULC 2024": true,
  })

  const [layerOpacities, setLayerOpacities] = useState({
    "LULC 2015": 0.7,
    "LULC 2020": 0.7,
    "LULC 2024": 0.8,
  })

  const handleLayerToggle = (layer: string) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const handleOpacityChange = (layer: string, newOpacity: number) => {
    setLayerOpacities((prev) => ({
      ...prev,
      [layer]: newOpacity,
    }))
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-80 bg-card border-r border-border flex flex-col gap-6 p-6 overflow-y-auto flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LULC Viewer</h1>
          <p className="text-sm text-muted-foreground mt-1">Land Use & Land Cover Analysis</p>
        </div>

        {/* Layers Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Layers</h2>

          <div className="space-y-4">
            {Object.keys(TILE_URLS).map((layer) => (
              <Card
                key={layer}
                className={`p-4 transition-all duration-200 ${selectedLayers[layer] ? "bg-primary/10 border-primary/50" : "bg-card border-border"
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`layer-${layer}`}
                      checked={selectedLayers[layer]}
                      onCheckedChange={() => handleLayerToggle(layer)}
                      className="w-4 h-4"
                    />
                    <Label
                      htmlFor={`layer-${layer}`}
                      className="flex-1 text-sm font-medium text-foreground cursor-pointer"
                    >
                      {layer}
                    </Label>
                  </div>

                  {selectedLayers[layer] && (
                    <div className="space-y-2 pl-7">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Opacity</span>
                        <span className="text-xs font-semibold text-primary">
                          {Math.round(layerOpacities[layer] * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[layerOpacities[layer]]}
                        onValueChange={(value) => handleOpacityChange(layer, value[0])}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full h-2"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Legend Section */}
        <div className="space-y-3 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Legend</h2>
          <div className="space-y-2">
            {legendItems.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: item.color }}
                  className="w-4 h-4 rounded border border-border flex-shrink-0"
                />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 overflow-hidden">
        <MapContainer center={CENTER} zoom={ZOOM} style={{ height: "100%", width: "100%" }}>
          {/* Google Hybrid: Satellite + Labels/Roads */}
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="&copy; Google"
          />

          {Object.entries(selectedLayers)
            .filter(([_, isSelected]) => isSelected)
            .map(([layer, _]) => (
              <TileLayer key={layer} url={TILE_URLS[layer]} opacity={layerOpacities[layer]} />
            ))}
        </MapContainer>
      </main>
    </div>
  )
}

export default MapGEE
