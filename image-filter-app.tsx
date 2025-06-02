"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, RotateCcw } from "lucide-react"

// Strategy Pattern Implementation

// Abstract Filter Strategy
abstract class FilterStrategy {
  abstract apply(): string
  abstract getName(): string
}

// Concrete Filter Strategies using CSS filters
class BlackAndWhiteFilter extends FilterStrategy {
  apply(): string {
    return "grayscale(100%)"
  }

  getName(): string {
    return "Black & White"
  }
}

class SepiaFilter extends FilterStrategy {
  apply(): string {
    return "sepia(100%)"
  }

  getName(): string {
    return "Sepia"
  }
}

class ContrastFilter extends FilterStrategy {
  apply(): string {
    return "contrast(150%)"
  }

  getName(): string {
    return "Increase Contrast"
  }
}

class InvertFilter extends FilterStrategy {
  apply(): string {
    return "invert(100%)"
  }

  getName(): string {
    return "Invert Colors"
  }
}

class BlurFilter extends FilterStrategy {
  apply(): string {
    return "blur(2px)"
  }

  getName(): string {
    return "Blur"
  }
}

class BrightnessFilter extends FilterStrategy {
  apply(): string {
    return "brightness(150%)"
  }

  getName(): string {
    return "Brightness"
  }
}

class SaturateFilter extends FilterStrategy {
  apply(): string {
    return "saturate(200%)"
  }

  getName(): string {
    return "Saturate"
  }
}

class NoFilter extends FilterStrategy {
  apply(): string {
    return "none"
  }

  getName(): string {
    return "Original"
  }
}

// Context Class
class ImageProcessor {
  private strategy: FilterStrategy

  constructor(strategy: FilterStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: FilterStrategy): void {
    this.strategy = strategy
  }

  processImage(): string {
    return this.strategy.apply()
  }

  getCurrentFilterName(): string {
    return this.strategy.getName()
  }
}

// React Component
export default function ImageFilterApp() {
  const [imageProcessor] = useState(() => new ImageProcessor(new NoFilter()))
  const [currentFilter, setCurrentFilter] = useState<string>("original")
  const [imageSrc, setImageSrc] = useState<string>("https://picsum.photos/id/237/900/700")
  const [isImageLoaded, setIsImageLoaded] = useState(true)

  // Available filter strategies
  const filterStrategies = {
    original: new NoFilter(),
    blackwhite: new BlackAndWhiteFilter(),
    sepia: new SepiaFilter(),
    contrast: new ContrastFilter(),
    invert: new InvertFilter(),
    blur: new BlurFilter(),
    brightness: new BrightnessFilter(),
    saturate: new SaturateFilter(),
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImageSrc(result)
      setIsImageLoaded(true)
      setCurrentFilter("original")
    }
    reader.readAsDataURL(file)
  }

  const applyFilter = (filterKey: string) => {
    const strategy = filterStrategies[filterKey as keyof typeof filterStrategies]
    imageProcessor.setStrategy(strategy)
    setCurrentFilter(filterKey)
  }

  const resetToOriginal = () => {
    setCurrentFilter("original")
  }

  const loadSampleImage = () => {
    setImageSrc("https://picsum.photos/id/237/900/700")
    setIsImageLoaded(true)
    setCurrentFilter("original")
  }

  const loadDifferentSample = () => {
    // Load a different sample image
    const randomId = Math.floor(Math.random() * 100) + 1
    setImageSrc(`https://picsum.photos/id/${randomId}/900/700`)
    setIsImageLoaded(true)
    setCurrentFilter("original")
  }

  const getCurrentFilterStyle = () => {
    const strategy = filterStrategies[currentFilter as keyof typeof filterStrategies]
    imageProcessor.setStrategy(strategy)
    return imageProcessor.processImage()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Image Filter Studio</h1>
          <p className="text-slate-600">Apply various visual filters using the Strategy pattern</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={loadSampleImage} className="text-xs">
                  Load Dog Image
                </Button>
                <Button variant="outline" onClick={loadDifferentSample} className="text-xs">
                  Random Image
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Filter Strategy</label>
                <Select value={currentFilter} onValueChange={applyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(filterStrategies).map(([key, strategy]) => (
                      <SelectItem key={key} value={key}>
                        {strategy.getName()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(filterStrategies)
                  .slice(1)
                  .map(([key, strategy]) => (
                    <Button
                      key={key}
                      variant={currentFilter === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyFilter(key)}
                      className="text-xs"
                    >
                      {strategy.getName()}
                    </Button>
                  ))}
              </div>

              <Button variant="outline" onClick={resetToOriginal} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Original
              </Button>

              {isImageLoaded && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                  <strong>Current Filter:</strong> {imageProcessor.getCurrentFilterName()}
                  <br />
                  <strong>CSS Filter:</strong> <code className="text-xs">{getCurrentFilterStyle()}</code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Display */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Filtered Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg shadow-inner">
                {isImageLoaded ? (
                  <img
                    src={imageSrc || "/placeholder.svg"}
                    alt="Filtered image"
                    className="max-w-full h-auto border border-slate-200 rounded mx-auto block"
                    style={{
                      filter: getCurrentFilterStyle(),
                      transition: "filter 0.3s ease-in-out",
                      maxHeight: "1000px",
                    }}
                    onError={() => {
                      console.error("Error loading image")
                      setIsImageLoaded(false)
                    }}
                  />
                ) : (
                  <div className="text-center text-slate-500 py-12">
                    Upload an image or load a sample to get started
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Pattern Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Strategy Pattern Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                <strong>Abstract Strategy:</strong> FilterStrategy class defines the interface for all filter algorithms
              </p>
              <p>
                <strong>Concrete Strategies:</strong> BlackAndWhiteFilter, SepiaFilter, ContrastFilter, InvertFilter,
                BlurFilter, BrightnessFilter, SaturateFilter
              </p>
              <p>
                <strong>Context:</strong> ImageProcessor class uses the selected strategy to apply CSS filters
              </p>
              <p>
                <strong>Implementation:</strong> Uses CSS filter properties for real-time visual effects with smooth
                transitions
              </p>
              <p>
                <strong>Benefits:</strong> Easy to add new filters, runtime strategy switching, clean separation of
                concerns, better performance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
