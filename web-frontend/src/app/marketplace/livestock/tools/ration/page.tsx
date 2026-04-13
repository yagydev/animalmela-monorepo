'use client';

import { useState } from 'react';
import Link from 'next/link';

type AgeGroup = 'calf' | 'young' | 'adult';
type AnimalT = 'cow' | 'buffalo' | 'goat' | 'sheep';

const BREED_TIPS: Record<string, string> = {
  'Murrah': 'Murrah buffaloes are high producers — ensure 18% protein concentrate and 3× milking where possible.',
  'HF': 'Holstein Friesian cattle need high-energy feed and cool housing. Supplement with bypass protein.',
  'Jersey': 'Jersey cows thrive on good quality roughage. Reduce concentrate to avoid fat deposits.',
  'Sahiwal': 'Hardy breed — adaptable to Indian conditions. Maintain regular deworming every 90 days.',
  'Gir': 'Gir cows do well on native roughage. A2 milk producer — in demand, price accordingly.',
};

function calcRation(bodyWeight: number, milkYield: number, lactating: boolean, pregnant: boolean, ageGroup: AgeGroup) {
  const basePercent = ageGroup === 'calf' ? 0.02 : 0.025;
  let dm = bodyWeight * basePercent;
  if (lactating && milkYield > 0) dm += milkYield * 0.4;
  if (pregnant) dm += 0.3;

  const roughage = dm * 0.6;
  const concentrate = dm * 0.4;
  const protein = bodyWeight * 0.8 + milkYield * 80; // grams
  const energy = bodyWeight * 0.4 + milkYield * 5; // MJ

  return { dm, roughage, concentrate, protein, energy };
}

export default function RationCalculatorPage() {
  const [animalType, setAnimalType] = useState<AnimalT>('cow');
  const [breed, setBreed] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [milkYield, setMilkYield] = useState('');
  const [lactating, setLactating] = useState(false);
  const [pregnant, setPregnant] = useState(false);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [result, setResult] = useState<ReturnType<typeof calcRation> | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const bw = parseFloat(bodyWeight);
    if (!bw || bw <= 0) return;
    const milk = lactating ? parseFloat(milkYield) || 0 : 0;
    setResult(calcRation(bw, milk, lactating, pregnant, ageGroup));
  };

  const breedTip = Object.entries(BREED_TIPS).find(([k]) =>
    breed.toLowerCase().includes(k.toLowerCase())
  )?.[1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-gray-50 pb-16">
      <div className="border-b border-green-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <Link href="/marketplace/livestock" className="text-sm font-medium text-green-800 hover:underline">
            ← Livestock marketplace
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">🌾 Feed / Ration Calculator</h1>
          <p className="mt-1 text-sm text-gray-600">
            Calculate daily feed requirements for your livestock using standard Indian nutrition guidelines.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <form onSubmit={calculate}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Animal type</label>
              <select value={animalType} onChange={e => setAnimalType(e.target.value as AnimalT)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none">
                <option value="cow">🐄 Cow</option>
                <option value="buffalo">🐃 Buffalo</option>
                <option value="goat">🐐 Goat</option>
                <option value="sheep">🐑 Sheep</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Breed (optional)</label>
              <input value={breed} onChange={e => setBreed(e.target.value)}
                placeholder="e.g. Murrah, Gir, HF"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Live weight (kg) <span className="text-red-500">*</span></label>
              <input required type="number" min="5" max="1200" value={bodyWeight} onChange={e => setBodyWeight(e.target.value)}
                placeholder="e.g. 400"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age group</label>
              <select value={ageGroup} onChange={e => setAgeGroup(e.target.value as AgeGroup)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none">
                <option value="calf">Calf (&lt;1 yr)</option>
                <option value="young">Young (1–2 yr)</option>
                <option value="adult">Adult (&gt;2 yr)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={lactating} onChange={e => setLactating(e.target.checked)}
                className="rounded border-gray-300 text-green-600" />
              Lactating
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={pregnant} onChange={e => setPregnant(e.target.checked)}
                className="rounded border-gray-300 text-green-600" />
              Pregnant
            </label>
          </div>

          {lactating && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Milk yield (L/day)</label>
              <input type="number" min="0" max="60" value={milkYield} onChange={e => setMilkYield(e.target.value)}
                placeholder="e.g. 12"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
            </div>
          )}

          <button type="submit"
            className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 transition">
            Calculate Feed Requirements
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 space-y-4">
            <h2 className="text-lg font-bold text-green-900">📊 Daily Feed Requirements</h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: 'Total Dry Matter', value: `${result.dm.toFixed(1)} kg/day`, highlight: true },
                { label: 'Roughage (60%)', value: `${result.roughage.toFixed(1)} kg/day` },
                { label: 'Concentrate (40%)', value: `${result.concentrate.toFixed(1)} kg/day` },
                { label: 'Crude Protein', value: `${result.protein.toFixed(0)} g/day` },
                { label: 'Energy', value: `${result.energy.toFixed(1)} MJ/day` },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={`rounded-xl p-3 ${highlight ? 'bg-green-100 border border-green-300' : 'bg-white border border-gray-200'}`}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-lg font-bold ${highlight ? 'text-green-800' : 'text-gray-900'}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-1">💡 Tips</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Feed in 2–3 meals per day for best digestion</li>
                <li>• Ensure clean water is available at all times (30–50 L/day for adult cattle)</li>
                <li>• Roughage: use green fodder + dry straw (60:40 ratio)</li>
                {lactating && <li>• Add mineral mixture: 50–80 g/day during lactation</li>}
                {pregnant && <li>• Increase concentrate by 1 kg/day in last 2 months of pregnancy</li>}
                {ageGroup === 'calf' && <li>• Calves: start creep feeding at 2 weeks, provide colostrum in first 6 hours</li>}
              </ul>
            </div>

            {breedTip && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm">
                <p className="font-semibold text-amber-900 mb-1">🐄 Breed tip — {breed}</p>
                <p className="text-amber-800">{breedTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-center text-gray-400">
          Calculations are indicative based on ICAR/NRC guidelines. Consult a veterinarian for individual animals.
        </p>
      </div>
    </div>
  );
}
