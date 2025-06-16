import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calculator, Scissors, DollarSign, Plus, Minus } from 'lucide-react'
import './App.css'
import tabelasData from './assets/tabelas_precos.json'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedTable, setSelectedTable] = useState('tabela1')
  const [additionalCosts, setAdditionalCosts] = useState([])
  const [newCostName, setNewCostName] = useState('')
  const [newCostValue, setNewCostValue] = useState('')

  const categories = Object.keys(tabelasData)
  const services = selectedCategory ? tabelasData[selectedCategory] : []
  const currentService = services.find(s => s.ref === selectedService)

  const tableLabels = {
    tabela1: 'Tabela 1 (Iniciante)',
    tabela2: 'Tabela 2 (Intermediário)',
    tabela3: 'Tabela 3 (Avançado)',
    tabela4: 'Tabela 4 (Premium)'
  }

  const addCost = () => {
    if (newCostName && newCostValue) {
      setAdditionalCosts([...additionalCosts, { 
        name: newCostName, 
        value: parseFloat(newCostValue) || 0 
      }])
      setNewCostName('')
      setNewCostValue('')
    }
  }

  const removeCost = (index) => {
    setAdditionalCosts(additionalCosts.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    const basePrice = currentService ? currentService[selectedTable] : 0
    const additionalTotal = additionalCosts.reduce((sum, cost) => sum + cost.value, 0)
    return basePrice + additionalTotal
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scissors className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Tabela de Preços</h1>
            <Scissors className="h-8 w-8 text-indigo-600" />
          </div>
          <p className="text-lg text-gray-600">Sistema de Precificação para Conserto de Roupas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Seleção de Serviço
                </CardTitle>
                <CardDescription>
                  Escolha a categoria e o tipo de serviço desejado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div>
                    <Label htmlFor="service">Serviço</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.ref} value={service.ref}>
                            {service.ref} - {service.servico}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentService && (
                  <div>
                    <Label htmlFor="table">Nível de Preço</Label>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(tableLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Table */}
            {currentService && (
              <Card>
                <CardHeader>
                  <CardTitle>Tabela de Preços</CardTitle>
                  <CardDescription>
                    Ref. {currentService.ref} - {currentService.servico}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(tableLabels).map(([key, label]) => (
                      <div 
                        key={key} 
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedTable === key 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {label}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          R$ {currentService[key].toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Custos Adicionais
                </CardTitle>
                <CardDescription>
                  Adicione materiais, aviamentos ou outros custos extras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Nome do custo (ex: Zíper, Elástico)"
                      value={newCostName}
                      onChange={(e) => setNewCostName(e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={newCostValue}
                      onChange={(e) => setNewCostValue(e.target.value)}
                    />
                  </div>
                  <Button onClick={addCost} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {additionalCosts.length > 0 && (
                  <div className="space-y-2">
                    {additionalCosts.map((cost, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{cost.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">
                            R$ {cost.value.toFixed(2)}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeCost(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            {/* Total Calculation */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumo do Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentService && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Serviço Base:</span>
                      <span className="font-medium">
                        R$ {currentService[selectedTable].toFixed(2)}
                      </span>
                    </div>
                    
                    {additionalCosts.length > 0 && (
                      <>
                        <div className="border-t pt-2">
                          <div className="text-sm text-gray-600 mb-2">Custos Adicionais:</div>
                          {additionalCosts.map((cost, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{cost.name}</span>
                              <span>R$ {cost.value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-green-600">
                          R$ {calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {!currentService && (
                  <div className="text-center text-gray-500 py-8">
                    Selecione um serviço para ver o orçamento
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas de Precificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    💰 Tipo de Público
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Ajuste conforme o perfil do cliente
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    ⏰ Prazo de Entrega
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Urgência pode gerar valor extra
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    🎯 Dificuldade
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Trabalhos complexos valem mais
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    👗 Tipo de Roupa
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Roupas de festa custam mais
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    🎭 Fantasias
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Adicione 25% ao valor da tabela
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    📦 Múltiplos Ajustes
                  </Badge>
                  <p className="text-sm text-gray-600">
                    20% de desconto na mesma peça
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

