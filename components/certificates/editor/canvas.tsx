"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import type { Field } from "@/lib/local-storage"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ZoomIn, ZoomOut, RotateCcw, Grid3X3, Undo, Redo, Move, Lock, Unlock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CanvasProps {
  template: { url: string }
  fields: Field[]
  selectedField: string | null
  onAddField: (field: Field) => void
  onSelectField: (id: string | null) => void
  onUpdateField: (id: string, updates: Partial<Field>) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function Canvas({
  template,
  fields,
  selectedField,
  onAddField,
  onSelectField,
  onUpdateField,
  undo,
  redo,
  canUndo,
  canRedo,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [gridSize, setGridSize] = useState(40)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = template.url
    img.onload = () => {
      setImage(img)
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current
        const container = containerRef.current
        canvas.width = img.width
        canvas.height = img.height

        // Calc the scale to fit the image
        const scaleX = container.clientWidth / img.width
        const scaleY = container.clientHeight / img.height
        const newScale = Math.min(scaleX, scaleY, 1)

        setScale(newScale)

        // Center the image
        const panX = (container.clientWidth - img.width * newScale) / 2
        const panY = (container.clientHeight - img.height * newScale) / 2
        setPan({ x: panX, y: panY })

        renderCanvas()
      }
    }
  }, [template.url])

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !image) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply scaling and panning
    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(pan.x / scale, pan.y / scale)

    // Draw template image
    ctx.drawImage(image, 0, 0, image.width, image.height)

    // Draw grid if enabled
    if (showGrid) {
      ctx.beginPath()
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
      ctx.lineWidth = 1 / scale

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
      }

      ctx.stroke()
    }

    // Draw fields
    fields.forEach((field) => {
      ctx.save()
      ctx.translate(field.x, field.y)
      ctx.rotate((field.rotation || 0) * (Math.PI / 180))

      // Draw field background
      ctx.fillStyle = field.id === selectedField ? "rgba(14, 165, 233, 0.2)" : "rgba(100, 116, 139, 0.1)"
      ctx.fillRect(0, 0, field.width, field.height)

      // Draw field border
      ctx.strokeStyle = field.id === selectedField ? "#0ea5e9" : "#64748b"
      ctx.lineWidth = 2 / scale
      ctx.strokeRect(0, 0, field.width, field.height)

      // Draw field label
      ctx.fillStyle = "#000"
      ctx.font = `bold ${16 / scale}px sans-serif`
      ctx.fillText(field.type || "Text", 5 / scale, 20 / scale)

      ctx.restore()
    })

    ctx.restore()
  }, [fields, selectedField, image, scale, pan, showGrid, gridSize])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / scale,
      y: (e.clientY - rect.top - pan.y) / scale,
    }
  }

  const snapToGridPos = (pos: { x: number; y: number }) => {
    if (!snapToGrid) return pos
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    const field = fields.find((f) => pos.x >= f.x && pos.x <= f.x + f.width && pos.y >= f.y && pos.y <= f.y + f.height)
    if (field) {
      onSelectField(field.id)
      setIsDragging(true)
      setDragStart(pos)
    } else {
      onSelectField(null)
      if (isMoving) {
        setIsDragging(true)
        setDragStart(pos)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const pos = getMousePos(e)
    const dx = pos.x - dragStart.x
    const dy = pos.y - dragStart.y
    setDragStart(pos)

    if (selectedField) {
      const field = fields.find((f) => f.id === selectedField)
      if (field) {
        const newPos = snapToGridPos({
          x: field.x + dx,
          y: field.y + dy,
        })
        onUpdateField(selectedField, newPos)
      }
    } else if (isMoving) {
      setPan({
        x: pan.x + dx * scale,
        y: pan.y + dy * scale,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.5))
  const handleResetZoom = () => {
    if (containerRef.current && image) {
      const container = containerRef.current
      const scaleX = container.clientWidth / image.width
      const scaleY = container.clientHeight / image.height
      const newScale = Math.min(scaleX, scaleY, 1)
      setScale(newScale)

      const panX = (container.clientWidth - image.width * newScale) / 2
      const panY = (container.clientHeight - image.height * newScale) / 2
      setPan({ x: panX, y: panY })
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className={cn("h-4 w-4", showGrid && "text-primary")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Grid Options
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Grid Settings</h4>
                  <p className="text-sm text-muted-foreground">Customize the grid appearance and behavior.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="gridSize">Grid Size</Label>
                    <Input
                      id="gridSize"
                      type="number"
                      className="col-span-2 h-8"
                      value={gridSize}
                      onChange={(e) => setGridSize(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="snap-to-grid" checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                    <Label htmlFor="snap-to-grid">Snap to Grid</Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsMoving(!isMoving)}>
                <Move className={cn("h-4 w-4", isMoving && "text-primary")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Move Mode</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
          <Slider
            value={[scale]}
            min={0.1}
            max={3}
            step={0.1}
            onValueChange={([value]) => setScale(value)}
            className="w-32"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleResetZoom}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Zoom</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative bg-muted/30 rounded-lg overflow-hidden"
        style={{ height: `calc(100vh - 16rem)` }}
      >
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0"
          style={{
            transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
            transformOrigin: "0 0",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  )
}


// "use client"
// import { useState, useEffect, useRef, useCallback } from "react"
// import { motion } from "framer-motion"
// import type { Field } from "@/lib/local-storage"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Slider } from "@/components/ui/slider"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { ZoomIn, ZoomOut, RotateCcw, Grid3X3, Undo, Redo, Move } from 'lucide-react'
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// interface CanvasProps {
//   template: { url: string }
//   fields: Field[]
//   selectedField: string | null
//   onAddField: (field: Field) => void
//   onSelectField: (id: string | null) => void
//   onUpdateField: (id: string, updates: Partial<Field>) => void
//   undo: () => void
//   redo: () => void
//   canUndo: boolean
//   canRedo: boolean
// }

// export function Canvas({
//   template,
//   fields,
//   selectedField,
//   onAddField,
//   onSelectField,
//   onUpdateField,
//   undo,
//   redo,
//   canUndo,
//   canRedo,
// }: CanvasProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const [image, setImage] = useState<HTMLImageElement | null>(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [pan, setPan] = useState({ x: 0, y: 0 })
//   const [scale, setScale] = useState(1)
//   const [showGrid, setShowGrid] = useState(true)
//   const [gridSize, setGridSize] = useState(40)
//   const [snapToGrid, setSnapToGrid] = useState(true)
//   const [isMoving, setIsMoving] = useState(false)
//   const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

//   useEffect(() => {
//     const img = new Image()
//     img.src = template.url
//     img.onload = () => {
//       setImage(img)
//       if (canvasRef.current && containerRef.current) {
//         const container = containerRef.current
//         const aspectRatio = img.height / img.width
//         const newHeight = container.clientWidth * aspectRatio
      
//         setImageDimensions({ width: container.clientWidth, height: newHeight })
      
//         canvasRef.current.width = container.clientWidth
//         canvasRef.current.height = newHeight
//         containerRef.current.style.height = `${newHeight}px`
      
//         renderCanvas()
//       }
//     }
//   }, [template.url])

//   const renderCanvas = useCallback(() => {
//     const canvas = canvasRef.current
//     const ctx = canvas?.getContext("2d")
//     if (!canvas || !ctx || !image) return

//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     // Apply scaling and panning
//     ctx.save()
//     ctx.scale(scale, scale)
//     ctx.translate(pan.x / scale, pan.y / scale)

//     // Draw template image
//     ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

//     // Draw grid if enabled
//     if (showGrid) {
//       ctx.beginPath()
//       ctx.strokeStyle = "rgba(1,1,1,1)"
//       ctx.lineWidth = 1 / scale

//       for (let x = 0; x <= canvas.width; x += gridSize) {
//         ctx.moveTo(x, 0)
//         ctx.lineTo(x, canvas.height)
//       }

//       for (let y = 0; y <= canvas.height; y += gridSize) {
//         ctx.moveTo(0, y)
//         ctx.lineTo(canvas.width, y)
//       }

//       ctx.stroke()
//     }

//     // Draw fields
//     fields.forEach((field) => {
//       ctx.save()
//       ctx.translate(field.x, field.y)
//       ctx.rotate((field.rotation || 0) * (Math.PI / 180))

//       // Draw field background
//       ctx.fillStyle = field.id === selectedField ? "rgba(14, 165, 233, 0.2)" : "rgba(100, 116, 139, 0.1)"
//       ctx.fillRect(0, 0, field.width, field.height)

//       // Draw field border
//       ctx.strokeStyle = field.id === selectedField ? "#0ea5e9" : "#64748b"
//       ctx.lineWidth = 2 / scale
//       ctx.strokeRect(0, 0, field.width, field.height)

//       // Draw field label
//       ctx.fillStyle = "#000"
//       ctx.font = `bold ${16 / scale}px sans-serif`
//       ctx.fillText(field.type || "Text", 5 / scale, 20 / scale)

//       ctx.restore()
//     })

//     ctx.restore()
//   }, [fields, selectedField, image, scale, pan, showGrid, gridSize])

//   useEffect(() => {
//     renderCanvas()
//   }, [renderCanvas])

//   const getMousePos = (e: React.MouseEvent) => {
//     const canvas = canvasRef.current
//     if (!canvas) return { x: 0, y: 0 }

//     const rect = canvas.getBoundingClientRect()
//     return {
//       x: (e.clientX - rect.left - pan.x) / scale,
//       y: (e.clientY - rect.top - pan.y) / scale,
//     }
//   }

//   const snapToGridPos = (pos: { x: number; y: number }) => {
//     if (!snapToGrid) return pos
//     return {
//       x: Math.round(pos.x / gridSize) * gridSize,
//       y: Math.round(pos.y / gridSize) * gridSize,
//     }
//   }

//   const handleMouseDown = (e: React.MouseEvent) => {
//     const pos = getMousePos(e)
//     const field = fields.find((f) => pos.x >= f.x && pos.x <= f.x + f.width && pos.y >= f.y && pos.y <= f.y + f.height)
//     if (field) {
//       onSelectField(field.id)
//       setIsDragging(true)
//       setDragStart(pos)
//     } else {
//       onSelectField(null)
//       if (isMoving) {
//         setIsDragging(true)
//         setDragStart(pos)
//       }
//     }
//   }

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return

//     const pos = getMousePos(e)
//     const dx = Math.round((pos.x - dragStart.x) / 5) * 5
//     const dy = Math.round((pos.y - dragStart.y) / 5) * 5
//     setDragStart(pos)

//     if (selectedField) {
//       const field = fields.find((f) => f.id === selectedField)
//       if (field) {
//         const newPos = {
//           x: field.x + dx,
//           y: field.y + dy,
//         }
//         onUpdateField(selectedField, newPos)
//       }
//     } else if (isMoving) {
//       setPan({
//         x: pan.x + dx * scale,
//         y: pan.y + dy * scale,
//       })
//     }
//   }

//   const handleMouseUp = () => {
//     setIsDragging(false)
//   }

//   const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 3))
//   const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.5))
//   const handleResetZoom = () => {
//     setScale(1)
//     setPan({ x: 0, y: 0 })
//   }

//   return (
//     <div className="flex flex-col space-y-4">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={() => setShowGrid(!showGrid)}>
//                 <Grid3X3 className={cn("h-4 w-4", showGrid && "text-primary")} />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Toggle Grid</TooltipContent>
//           </Tooltip>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" size="sm">
//                 Grid Options
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80">
//               <div className="grid gap-4">
//                 <div className="space-y-2">
//                   <h4 className="font-medium leading-none">Grid Settings</h4>
//                   <p className="text-sm text-muted-foreground">Customize the grid appearance and behavior.</p>
//                 </div>
//                 <div className="grid gap-2">
//                   <div className="grid grid-cols-3 items-center gap-4">
//                     <Label htmlFor="gridSize">Grid Size</Label>
//                     <Input
//                       id="gridSize"
//                       type="number"
//                       className="col-span-2 h-8"
//                       value={gridSize}
//                       onChange={(e) => setGridSize(Number(e.target.value))}
//                     />
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Switch id="snap-to-grid" checked={snapToGrid} onCheckedChange={setSnapToGrid} />
//                     <Label htmlFor="snap-to-grid">Snap to Grid</Label>
//                   </div>
//                 </div>
//               </div>
//             </PopoverContent>
//           </Popover>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={() => setIsMoving(!isMoving)}>
//                 <Move className={cn("h-4 w-4", isMoving && "text-primary")} />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Toggle Move Mode</TooltipContent>
//           </Tooltip>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={handleZoomOut}>
//                 <ZoomOut className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Zoom Out</TooltipContent>
//           </Tooltip>
//           <Slider
//             value={[scale]}
//             min={0.1}
//             max={3}
//             step={0.1}
//             onValueChange={([value]) => setScale(value)}
//             className="w-32"
//           />
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={handleZoomIn}>
//                 <ZoomIn className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Zoom In</TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={handleResetZoom}>
//                 <RotateCcw className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Reset Zoom</TooltipContent>
//           </Tooltip>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
//                 <Undo className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Undo</TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
//                 <Redo className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Redo</TooltipContent>
//           </Tooltip>
//         </div>
//       </div>
//       <div
//         ref={containerRef}
//         className="relative flex-1 min-h-0 bg-muted/30 rounded-lg overflow-auto"
//       >
//         <canvas
//           ref={canvasRef}
//           className="absolute left-0 top-0 w-full h-full"
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           style={{
//             cursor: isDragging ? (selectedField ? "grabbing" : "move") : isMoving ? "move" : "default",
//           }}
//         />
//       </div>
//     </div>
//   )
// }

