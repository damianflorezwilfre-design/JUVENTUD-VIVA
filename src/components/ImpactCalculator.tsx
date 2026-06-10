"use client"

import { useState } from "react";
import { Calculator, Book, Coffee, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function ImpactCalculator({ calcKitCost, calcMealCost }: { calcKitCost: number, calcMealCost: number }) {
  const [amount, setAmount] = useState<number>(100000);

  const kits = Math.floor(amount / calcKitCost);
  const meals = Math.floor(amount / calcMealCost);

  return (
    <div className="bg-gray-900 border border-jv-purple/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-jv-purple/10 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Calculator className="text-jv-turquoise mr-3" size={28} />
            Calculadora de Impacto
          </h3>
          <p className="text-gray-400 mt-2">Descubre lo que tu donación puede lograr.</p>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-400 mb-4">Ingresa el monto que deseas donar (COP)</label>
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-jv-turquoise">$</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-gray-800 border-2 border-gray-700 focus:border-jv-purple rounded-xl px-4 py-3 text-2xl font-black text-white outline-none transition-colors"
            step="10000"
            min="0"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {[50000, 100000, 250000, 500000].map(val => (
            <button 
              key={val}
              onClick={() => setAmount(val)}
              className="px-4 py-1.5 rounded-full bg-gray-800 hover:bg-jv-purple/20 text-gray-300 hover:text-white border border-gray-700 hover:border-jv-purple/50 text-sm font-medium transition-colors"
            >
              ${val.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`kits-${kits}`}
          className="bg-gradient-to-br from-jv-purple/20 to-transparent border border-jv-purple/30 p-6 rounded-2xl flex items-center"
        >
          <div className="p-4 bg-jv-purple/20 rounded-xl mr-4">
            <Book className="text-jv-purple" size={32} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none">{kits}</p>
            <p className="text-sm font-medium text-jv-purple mt-1">Kits Escolares</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`meals-${meals}`}
          className="bg-gradient-to-br from-jv-turquoise/20 to-transparent border border-jv-turquoise/30 p-6 rounded-2xl flex items-center"
        >
          <div className="p-4 bg-jv-turquoise/20 rounded-xl mr-4">
            <Coffee className="text-jv-turquoise" size={32} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none">{meals}</p>
            <p className="text-sm font-medium text-jv-turquoise mt-1">Desayunos Nutritivos</p>
          </div>
        </motion.div>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center">
        <Target size={14} className="mr-1" /> Valores calculados en base a promedios actuales. El impacto real puede variar.
      </div>
    </div>
  );
}
