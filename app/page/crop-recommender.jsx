"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios';

export default function CropRecommender() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    humidity: "",
    ph: "",
    rainfall: ""
  })
  const [recommendation, setRecommendation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setRecommendation("")

    try {
     const response =   axios.post('https://djangofarmers-production.up.railway.app/api/recommend/', {
            // Data to be sent in the request body
            n:formData.n,
            p:formData.p,
            k:formData.k,
            temperature:formData.temperature,
            humidity:formData.humidity,
            ph:formData.ph,
            rainfall:formData.rainfall,
        },{
        headers: {
            'Content-Type': 'application/json',
        }}
        )
        .then(response => {
            console.log(response.data); // Handle the response data
        })
        
  

      if (!response.ok) {
        throw new Error('Failed to get recommendation')
      }

      const data = await response.json()
      setRecommendation(data.prediction)
    } catch (err) {
      setError("Failed to get recommendation. Please try again."+ err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crop Recommender</CardTitle>
        <CardDescription>Enter soil and environmental data to get a crop recommendation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="N">Nitrogen (N)</Label>
              <Input
                id="n"
                name="n"
                type="number"
                placeholder="0-140"
                value={formData.n}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="P">Phosphorus (P)</Label>
              <Input
                id="p"
                name="p"
                type="number"
                placeholder="5-145"
                value={formData.p}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="K">Potassium (K)</Label>
              <Input
                id="k"
                name="k"
                type="number"
                placeholder="5-205"
                value={formData.k}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                name="humidity"
                type="number"
                placeholder="14-100"
                value={formData.humidity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                placeholder="0-50"
                value={formData.temperature}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ph">pH</Label>
              <Input
                id="ph"
                name="ph"
                type="number"
                step="0.01"
                placeholder="3.5-10"
                value={formData.ph}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rainfall">Rainfall (mm)</Label>
              <Input
                id="rainfall"
                name="rainfall"
                type="number"
                placeholder="20-300"
                value={formData.rainfall}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendation...
              </>
            ) : (
              "Get Recommendation"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {recommendation && (
          <Alert>
            <AlertTitle>Recommended Crop</AlertTitle>
            <AlertDescription>{recommendation}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}