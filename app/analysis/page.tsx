"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

// Land Use/Land Cover class mapping
const classNameMap = {
  0: "Builtup",
  1: "Agriculture",
  2: "Vegetation",
  3: "Glacier",
  4: "Barren",
}

const classColors = {
  Builtup: "#d73027",
  Agriculture: "#98ff00",
  Vegetation: "#479f2e",
  Glacier: "#148bff",
  Barren: "#d0d6ff",
}

const LULCAnalytics = () => {
  const [lulcData, setLulcData] = useState<any[]>([])
  const [changeData, setChangeData] = useState<any[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [allYears, setAllYears] = useState<number[]>([])
  const [showCombined, setShowCombined] = useState(false)

  useEffect(() => {
    // Load LULC Stats
    fetch("/LULC_Stats.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const chartData: any[] = []
        const years = new Set<number>()

        geojson.features.forEach((feature: any) => {
          const year = feature.properties.Year
          const classId = feature.properties.Class_ID
          const className = classNameMap[classId as keyof typeof classNameMap]
          const area = feature.properties.Area_km2

          years.add(year)

          let yearData = chartData.find((d) => d.year === year)
          if (!yearData) {
            yearData = { year }
            chartData.push(yearData)
          }
          yearData[className] = area
        })

        chartData.sort((a, b) => a.year - b.year)
        const yearArray = Array.from(years).sort((a, b) => a - b)
        setAllYears(yearArray)
        setSelectedYears(yearArray)
        setLulcData(chartData)
      })
      .catch((err) => console.error("Error loading LULC data:", err))

    // Load Change Stats
    fetch("/Change_Stats.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const changes = geojson.features.map((feature: any) => ({
          period: `${feature.properties.Start_Year}-${feature.properties.End_Year}`,
          startYear: feature.properties.Start_Year,
          endYear: feature.properties.End_Year,
          changedArea: feature.properties.Changed_Area_km2,
          changedPercent: feature.properties.Changed_Percent,
        }))
        setChangeData(changes.sort((a: any, b: any) => a.startYear - b.startYear))
      })
      .catch((err) => console.error("Error loading change data:", err))
  }, [])

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year].sort()))
  }

  const filteredLULCData = showCombined ? lulcData : lulcData.filter((d) => selectedYears.includes(d.year))

  const toggleAllYears = () => {
    setSelectedYears(showCombined ? [] : allYears)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Land Use/Land Cover Analytics</h1>
          <p className="text-slate-300 text-lg">Comprehensive analysis of LULC changes and trends over time</p>
        </div>

        {/* LULC Area Chart Section */}
        <div className="mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-white">LULC Area Distribution (km²)</CardTitle>
                  <CardDescription className="text-slate-400 mt-2">
                    Stacked area analysis showing the distribution of land use and land cover classes over time
                  </CardDescription>
                </div>
              </div>

              {/* Year Selection Controls */}
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-white font-semibold">Select Years to Display:</label>
                  <button
                    onClick={toggleAllYears}
                    className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    {selectedYears.length === allYears.length ? "Clear All" : "Select All"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {allYears.map((year) => (
                    <div key={year} className="flex items-center gap-2">
                      <Checkbox
                        id={`year-${year}`}
                        checked={selectedYears.includes(year)}
                        onCheckedChange={() => handleYearToggle(year)}
                        className="border-slate-400"
                      />
                      <label htmlFor={`year-${year}`} className="text-white cursor-pointer font-medium">
                        {year}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combined View Toggle */}
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg flex items-center gap-3">
                <Checkbox
                  id="combined-view"
                  checked={showCombined}
                  onCheckedChange={(checked) => setShowCombined(!!checked)}
                  className="border-slate-400"
                />
                <label htmlFor="combined-view" className="text-white cursor-pointer font-medium">
                  Show all years together in one view
                </label>
              </div>
            </CardHeader>

            <CardContent>
              <div className="h-96 bg-slate-900/50 rounded-lg p-4">
                {filteredLULCData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredLULCData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="year" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#94a3b8" label={{ value: "Area (km²)", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#e2e8f0" }}
                        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      {Object.keys(classColors).map((className) => (
                        <Bar
                          key={className}
                          dataKey={className}
                          stackId="a"
                          fill={classColors[className as keyof typeof classColors]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    Select years to display chart
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📊 About This Chart</h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  This stacked bar chart displays the distribution of different land use and land cover classes across
                  selected years. The five categories shown are: Builtup areas (red), Agricultural regions (lime green),
                  Vegetation zones (forest green), Glacier regions (sky blue), and Barren lands (light gray). Use the
                  year selection checkboxes above to compare specific time periods or view all years together for trend
                  analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change Statistics Chart Section */}
        <div>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">LULC Change Statistics</CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                Analysis of area changes and percentages across different time periods
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Changed Area Chart */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Changed Area (km²)</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={changeData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="period" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                        />
                        <Bar dataKey="changedArea" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Changed Percentage Chart */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Changed Percentage (%)</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={changeData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="period" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="changedPercent"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📈 About This Analysis</h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  These charts show the magnitude of LULC changes across different time periods. The left chart displays
                  the absolute area changed in square kilometers, while the right chart shows the percentage of change
                  relative to the total area. The data reveals trends in land use transformation, helping identify
                  periods of significant environmental changes. Regular monitoring of these metrics is crucial for urban
                  planning and environmental management.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Summary Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Total Years Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-400">{allYears.length}</div>
              <p className="text-slate-400 text-sm mt-2">
                Data spans from {allYears[0]} to {allYears[allYears.length - 1]}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">LULC Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-400">{Object.keys(classColors).length}</div>
              <div className="text-slate-400 text-sm mt-4 space-y-1">
                {Object.entries(classColors).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Max Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-400">
                {changeData.length > 0 ? Math.max(...changeData.map((d) => d.changedPercent)).toFixed(2) : "0"}%
              </div>
              <p className="text-slate-400 text-sm mt-2">Highest percentage change recorded in dataset</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LULCAnalytics
