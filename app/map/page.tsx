
// "use client"

// // 🚨 FIX 1: Move CSS import to the top level of the file
// import "leaflet/dist/leaflet.css"

// import { useState } from "react"
// import dynamic from 'next/dynamic'
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { Slider } from "@/components/ui/slider"
// import { Card } from "@/components/ui/card"
// import type { LatLngExpression } from 'leaflet'

// // --- Type Definitions for Safety ---
// type LayerKey = "LULC 2015" | "LULC 2020" | "LULC 2024"
// type TileUrls = { [K in LayerKey]: string }
// type SelectedLayersState = { [K in LayerKey]?: boolean }
// type LayerOpacitiesState = { [K in LayerKey]: number }
// // ------------------------------------
// const CENTER: LatLngExpression = [36.2512, 74.3226]
// const ZOOM = 14

// const TILE_URLS: TileUrls = {
//   "LULC 2015":
//     "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/3474b26d9e23de682e50c1cd02729d75-192e4fe99e37d926ec4998bf36c20f14/tiles/{z}/{x}/{y}",
//   "LULC 2020":
//     "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/ff34de9f33e19e7ed00f30e6b980ad7b-d54e444f8531ec66ab2ae2aab9bc8cb3/tiles/{z}/{x}/{y}",
//   "LULC 2024":
//     "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/1ecee099ce15acfad4161687ea3f438b-9e6b06dbd27fbe93f9c9c6c7a768c3a9/tiles/{z}/{x}/{y}",
//   "CHANGE 15 20":
//     "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/f92c22a9acfc0bb55c77b84741f70c5a-cab5e735e248d188c460c3892d237599/tiles/{z}/{x}/{y}",

//   "CHANGE 15 24":
//     "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/0a84ef9c90a3dcff13ed3f00ba2e1239-16f4e440bbb11956a63033fd707bbc6c/tiles/{z}/{x}/{y}",

//   "CHANGE 20 24":
//     "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/f7ba60ee6ed60193196dba282bec0109-47fdba93c056353d1313ccc52cb3a975/tiles/{z}/{x}/{y}"

// }

// const legendItems = [
//   { name: "Built-up", color: "#d73027" },
//   { name: "Agriculture", color: "#98ff00" },
//   { name: "Vegetation", color: "#479f2e" },
//   { name: "Glacier", color: "#148bff" },
//   { name: "Barren", color: "#d0d6ff" },
// ]

// // 🚨 MapContent now only contains JS logic and dynamically requires react-leaflet
// const MapContent = ({
//   selectedLayers,
//   layerOpacities
// }: {
//   selectedLayers: SelectedLayersState,
//   layerOpacities: LayerOpacitiesState
// }) => {
//   // 🚨 FIX 2: Only require the React Leaflet components
//   const { MapContainer, TileLayer } = require("react-leaflet");

//   return (
//     <MapContainer center={CENTER} zoom={ZOOM} style={{ height: "100%", width: "100%" }}>
//       {/* Google Hybrid: Satellite + Labels/Roads */}
//       <TileLayer
//         url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
//         subdomains={["mt0", "mt1", "mt2", "mt3"]}
//         attribution="&copy; Google"
//       />

//       {/* GEE Tile Layers */}
//       {Object.entries(selectedLayers)
//         .filter(([, isSelected]) => isSelected)
//         .map(([layer, _]) => {
//           const key = layer as LayerKey;
//           return (
//             <TileLayer
//               key={key}
//               url={TILE_URLS[key]}
//               opacity={layerOpacities[key]}
//             />
//           )
//         })}
//     </MapContainer>
//   );
// };


// const DynamicMap = dynamic(
//   () => Promise.resolve(MapContent),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex items-center justify-center w-full h-full text-lg text-muted-foreground bg-gray-50/50">
//         <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg">
//           <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
//           Loading Map Data...
//         </div>
//       </div>
//     ),
//   }
// )

// const MapGEE = () => {
//   const [selectedLayers, setSelectedLayers] = useState<SelectedLayersState>({
//     "LULC 2024": true,
//   })

//   const [layerOpacities, setLayerOpacities] = useState<LayerOpacitiesState>({
//     "LULC 2015": 0.7,
//     "LULC 2020": 0.7,
//     "LULC 2024": 0.8,
//   })

//   const handleLayerToggle = (layer: LayerKey) => {
//     setSelectedLayers((prev) => ({
//       ...prev,
//       [layer]: !prev[layer],
//     }))
//   }

//   const handleOpacityChange = (layer: LayerKey, newOpacity: number) => {
//     setLayerOpacities((prev) => ({
//       ...prev,
//       [layer]: newOpacity,
//     }))
//   }

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-background">
//       {/* Sidebar */}
//       <aside className="w-80 bg-card border-r border-border flex flex-col gap-6 p-6 overflow-y-auto flex-shrink-0">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">LULC Viewer</h1>
//           <p className="text-sm text-muted-foreground mt-1">Land Use & Land Cover Analysis</p>
//         </div>

//         {/* Layers Section */}
//         <div className="space-y-4">
//           <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Layers</h2>

//           <div className="space-y-4">
//             {(Object.keys(TILE_URLS) as LayerKey[]).map((layer) => (
//               <Card
//                 key={layer}
//                 className={`p-4 transition-all duration-200 ${selectedLayers[layer] ? "bg-primary/10 border-primary/50" : "bg-card border-border"
//                   }`}
//               >
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`layer-${layer}`}
//                       checked={!!selectedLayers[layer]}
//                       onCheckedChange={() => handleLayerToggle(layer)}
//                       className="w-4 h-4"
//                     />
//                     <Label
//                       htmlFor={`layer-${layer}`}
//                       className="flex-1 text-sm font-medium text-foreground cursor-pointer"
//                     >
//                       {layer}
//                     </Label>
//                   </div>

//                   {selectedLayers[layer] && (
//                     <div className="space-y-2 pl-7">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs text-muted-foreground">Opacity</span>
//                         <span className="text-xs font-semibold text-primary">
//                           {Math.round(layerOpacities[layer] * 100)}%
//                         </span>
//                       </div>
//                       <Slider
//                         value={[layerOpacities[layer]]}
//                         onValueChange={(value) => handleOpacityChange(layer, value[0])}
//                         min={0}
//                         max={1}
//                         step={0.05}
//                         className="w-full h-2"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Legend Section */}
//         <div className="space-y-3 border-t border-border pt-6">
//           <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Legend</h2>
//           <div className="space-y-2">
//             {legendItems.map((item) => (
//               <div key={item.name} className="flex items-center gap-3">
//                 <div
//                   style={{ backgroundColor: item.color }}
//                   className="w-4 h-4 rounded border border-border flex-shrink-0"
//                 />
//                 <span className="text-sm text-foreground">{item.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>

//       {/* Map */}
//       <main className="flex-1 overflow-hidden">
//         <DynamicMap
//           selectedLayers={selectedLayers}
//           layerOpacities={layerOpacities}
//         />
//       </main>
//     </div>
//   )
// }

// export default MapGEE


"use client"

// 🚨 FIX 1: Move CSS import to the top level of the file
import "leaflet/dist/leaflet.css"

import { useState } from "react"
import dynamic from 'next/dynamic'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import type { LatLngExpression } from 'leaflet'

// --- Type Definitions for Safety ---
// 1. ADDED: The new change layer keys to LayerKey
type LULCLayerKey = "LULC 2015" | "LULC 2020" | "LULC 2024"
type ChangeLayerKey = "CHANGE 15 20" | "CHANGE 15 24" | "CHANGE 20 24"
type LayerKey = LULCLayerKey | ChangeLayerKey
// ------------------------------------
type TileUrls = { [K in LayerKey]: string }
type SelectedLayersState = { [K in LayerKey]?: boolean }
type LayerOpacitiesState = { [K in LayerKey]: number }
// ------------------------------------
const CENTER: LatLngExpression = [36.2512, 74.3226]
const ZOOM = 14

const TILE_URLS: TileUrls = {
  "LULC 2015":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/3474b26d9e23de682e50c1cd02729d75-192e4fe99e37d926ec4998bf36c20f14/tiles/{z}/{x}/{y}",
  "LULC 2020":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/ff34de9f33e19e7ed00f30e6b980ad7b-d54e444f8531ec66ab2ae2aab9bc8cb3/tiles/{z}/{x}/{y}",
  "LULC 2024":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/1ecee099ce15acfad4161687ea3f438b-9e6b06dbd27fbe93f9c9c6c7a768c3a9/tiles/{z}/{x}/{y}",
  "CHANGE 15 20":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/f92c22a9acfc0bb55c77b84741f70c5a-cab5e735e248d188c460c3892d237599/tiles/{z}/{x}/{y}",
  "CHANGE 15 24":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/0a84ef9c90a3dcff13ed3f00ba2e1239-16f4e440bbb11956a63033fd707bbc6c/tiles/{z}/{x}/{y}",
  "CHANGE 20 24":
    "https://earthengine.googleapis.com/v1/projects/ee-my-zameer/maps/f7ba60ee6ed60193196dba282bec0109-47fdba93c056353d1313ccc52cb3a975/tiles/{z}/{x}/{y}"
}

// LULC Legend (5 classes)
const lulcLegendItems = [
  { name: "Built-up", color: "#d73027" },
  { name: "Agriculture", color: "#98ff00" },
  { name: "Vegetation", color: "#479f2e" },
  { name: "Glacier", color: "#148bff" },
  { name: "Barren", color: "#d0d6ff" },
]

const changeLegendItems = [
  { name: "No Significant Change", color: "#000000" }, 
  { name: "Change Type 1 (Code 1)", color: "#FF0000" }, 
  { name: "Change Type 2 (Code 2)", color: "#00FF00" }, 
  { name: "Change Type 3 (Code 3)", color: "#0000FF" }, 
]


const MapContent = ({
  selectedLayers,
  layerOpacities
}: {
  selectedLayers: SelectedLayersState,
  layerOpacities: LayerOpacitiesState
}) => {
  // 🚨 FIX 2: Only require the React Leaflet components
  const { MapContainer, TileLayer } = require("react-leaflet");

  return (
    <MapContainer center={CENTER} zoom={ZOOM} style={{ height: "100%", width: "100%" }}>
      {/* Google Hybrid: Satellite + Labels/Roads */}
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
        attribution="&copy; Google"
      />

      {/* GEE Tile Layers */}
      {/* Ensure the keys are cast correctly to LayerKey here */}
      {(Object.keys(selectedLayers) as LayerKey[])
        .filter((layer) => selectedLayers[layer])
        .map((key) => (
          <TileLayer
            key={key}
            url={TILE_URLS[key]}
            opacity={layerOpacities[key] || 1.0} // Fallback to 1.0 if opacity state is missing
          />
        ))}
    </MapContainer>
  );
};


const DynamicMap = dynamic(
  () => Promise.resolve(MapContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full text-lg text-muted-foreground bg-gray-50/50">
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
          Loading Map Data...
        </div>
      </div>
    ),
  }
)

const MapGEE = () => {
  const [selectedLayers, setSelectedLayers] = useState<SelectedLayersState>({
    "LULC 2024": true,
    // Set change layers to false by default
    "CHANGE 15 20": false,
    "CHANGE 15 24": false,
    "CHANGE 20 24": false,
  })

  // 3. UPDATED: Initialize opacities for ALL layer keys, including change layers
  const [layerOpacities, setLayerOpacities] = useState<LayerOpacitiesState>({
    "LULC 2015": 0.7,
    "LULC 2020": 0.7,
    "LULC 2024": 0.8,
    "CHANGE 15 20": 0.8, // Default opacity for change layers
    "CHANGE 15 24": 0.8,
    "CHANGE 20 24": 0.8,
  } as LayerOpacitiesState) // Assert the full type

  const handleLayerToggle = (layer: LayerKey) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const handleOpacityChange = (layer: LayerKey, newOpacity: number) => {
    setLayerOpacities((prev) => ({
      ...prev,
      [layer]: newOpacity,
    }))
  }

  // Helper to determine which legend to show
  const isLULCLayerSelected = (Object.keys(selectedLayers) as LayerKey[])
    .filter(key => key.startsWith("LULC") && selectedLayers[key])
    .length > 0;

  const isChangeLayerSelected = (Object.keys(selectedLayers) as LayerKey[])
    .filter(key => key.startsWith("CHANGE") && selectedLayers[key])
    .length > 0;

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
            {(Object.keys(TILE_URLS) as LayerKey[]).map((layer) => (
              <Card
                key={layer}
                className={`p-4 transition-all duration-200 ${selectedLayers[layer] ? "bg-primary/10 border-primary/50" : "bg-card border-border"
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`layer-${layer}`}
                      checked={!!selectedLayers[layer]}
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
                          {Math.round((layerOpacities[layer] || 1.0) * 100)}%
                        </span>
                      </div>
                      <Slider
                        // Use the optional chaining fallback for safety
                        value={[layerOpacities[layer] || 1.0]}
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

          {/* LULC Legend (Shown if any LULC layer is active) */}
          {isLULCLayerSelected && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground">LULC Classes</h3>
              {lulcLegendItems.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: item.color }}
                    className="w-4 h-4 rounded border border-border flex-shrink-0"
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Change Legend (Shown if any CHANGE layer is active) */}
          {/* {isChangeLayerSelected && (
            <div className="space-y-2 mt-4">
              <h3 className="text-xs font-bold text-muted-foreground">Change Classes</h3>
            
              {changeLegendItems.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: item.color }}
                    className="w-4 h-4 rounded border border-border flex-shrink-0"
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          )} */}

          {!(isLULCLayerSelected || isChangeLayerSelected) && (
            <p className="text-xs text-muted-foreground italic">Select a layer to view its legend.</p>
          )}

        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 overflow-hidden">
        <DynamicMap
          selectedLayers={selectedLayers}
          layerOpacities={layerOpacities}
        />
      </main>
    </div>
  )
}

export default MapGEE