"use client";

import * as React from 'react'
import type { JSX } from 'react'
import { useResumeStore } from "@/store/useResumeStore"
import type { ResumeData } from '@/types/resume'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const serifFonts = [
  { value: "times new roman", label: "Times New Roman" },
  { value: "georgia", label: "Georgia" },
  { value: "cambria", label: "Cambria" },
  { value: "garamond", label: "Garamond" },
] as const

const sansSerifFonts = [
  { value: "calibri", label: "Calibri" },
  { value: "helvetica", label: "Helvetica" },
  { value: "arial", label: "Arial" },
  { value: "roboto", label: "Roboto" },
  { value: "lato", label: "Lato" },
  { value: "open sans", label: "Open Sans" },
] as const

const separatorTypes = [
  { value: "line", label: "Line" },
  { value: "double line", label: "Double Line" },
  { value: "bold line", label: "Bold Line" },
  { value: "no separator", label: "No Separator" },
] as const

const dateFormats = [
  { value: "MM/YYYY", label: "MM/YYYY" },
  { value: "MMM YYYY", label: "MMM YYYY" },
  { value: "MMMM YYYY", label: "MMMM YYYY" },
] as const

const fontSizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const

const spacings = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const

export function StylingForm(): JSX.Element {
  const style = useResumeStore((state: { style: ResumeData['style'] }) => state.style)
  const updateStyle = useResumeStore((state: { updateStyle: (style: ResumeData['style']) => void }) => state.updateStyle)

  const handleSaveStyles = () => {
    updateStyle(style)
    toast.success('Styles saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={style.theme}
            onValueChange={(value) => updateStyle({ ...style, theme: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Selection */}
        <div className="space-y-2">
          <Label>Font</Label>
          <Select
            value={style.font}
            onValueChange={(value) => updateStyle({ ...style, font: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Serif Fonts</SelectLabel>
                {serifFonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Sans-Serif Fonts</SelectLabel>
                {sansSerifFonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select
            value={style.fontSize}
            onValueChange={(value) => updateStyle({ ...style, fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Spacing */}
        <div className="space-y-2">
          <Label>Spacing</Label>
          <Select
            value={style.spacing}
            onValueChange={(value) => updateStyle({ ...style, spacing: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select spacing" />
            </SelectTrigger>
            <SelectContent>
              {spacings.map((spacing) => (
                <SelectItem key={spacing.value} value={spacing.value}>
                  {spacing.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Separator */}
        <div className="space-y-2">
          <Label>Section Separator</Label>
          <Select
            value={style.separator}
            onValueChange={(value) => updateStyle({ ...style, separator: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select separator style" />
            </SelectTrigger>
            <SelectContent>
              {separatorTypes.map((separator) => (
                <SelectItem key={separator.value} value={separator.value}>
                  {separator.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Format */}
        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select
            value={style.dateFormat}
            onValueChange={(value) => updateStyle({ ...style, dateFormat: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {dateFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <Input
            type="color"
            value={style.color}
            onChange={(e) => updateStyle({ ...style, color: e.target.value })}
            className="h-10 px-3 w-full"
          />
        </div>
      </div>

      <Button
        onClick={handleSaveStyles}
        className="w-full"
      >
        Save Styles
      </Button>
    </div>
  )
}
