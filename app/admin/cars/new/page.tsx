'use client';

/**
 * Add New Car Page
 * Form for creating new cars in the admin panel
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { CarCategory, CarStatus } from '@prisma/client';

interface CarImage {
  url: string;
  altText: string;
  order: number;
  isPrimary: boolean;
}

interface CarFormData {
  name: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  fuel: string;
  transmission: string;
  kmNumber: number;
  color: string;
  driveType: string;
  engineSize: string;
  power: number | '';
  status: CarStatus;
  condition: string;
  category: CarCategory;
  featured: boolean;
  description: string;
  detailedDescription: string[];
  metaTitle: string;
  metaDescription: string;
  images: CarImage[];
  features: string[];
  specifications: Array<{
    label: string;
    value: string;
  }>;
}

export default function NewCarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role;

  // Initialize all hooks before any conditional logic
  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    priceEur: 0,
    fuel: 'DIESEL',
    transmission: 'AUTOMATIC',
    kmNumber: 0,
    color: '',
    driveType: '',
    engineSize: '',
    power: '',
    status: 'AVAILABLE' as CarStatus,
    condition: 'GOOD',
    category: 'FAMILY' as CarCategory,
    featured: false,
    description: '',
    detailedDescription: [''],
    metaTitle: '',
    metaDescription: '',
    images: [{ url: '', altText: '', order: 0, isPrimary: true }],
    features: [''],
    specifications: [{ label: '', value: '' }]
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check permissions after hooks are initialized
  useEffect(() => {
    if (userRole && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      router.push('/admin/unauthorized');
    }
  }, [userRole, router]);

  const updateFormData = (field: string, value: string | number | boolean | CarStatus | CarCategory) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addArrayItem = (field: 'detailedDescription' | 'features', value = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const removeArrayItem = (field: 'detailedDescription' | 'features', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'detailedDescription' | 'features', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: 'label' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', altText: '', order: prev.images.length, isPrimary: false }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nimi on pakollinen';
    if (!formData.brand.trim()) newErrors.brand = 'Merkki on pakollinen';
    if (!formData.model.trim()) newErrors.model = 'Malli on pakollinen';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Vuosi ei ole kelvollinen';
    }
    if (formData.priceEur <= 0) newErrors.priceEur = 'Hinta on pakollinen';
    if (formData.kmNumber < 0) newErrors.kmNumber = 'Kilometrit eivät voi olla negatiivisia';
    if (!formData.description.trim()) newErrors.description = 'Kuvaus on pakollinen';
    if (!formData.images[0]?.url.trim()) newErrors.image = 'Vähintään yksi kuva on pakollinen';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Clean up form data
      const cleanedData = {
        ...formData,
        name: `${formData.brand} ${formData.model}`,
        detailedDescription: formData.detailedDescription.filter(desc => desc.trim()),
        features: formData.features.filter(feature => feature.trim()),
        specifications: formData.specifications.filter(spec => spec.label.trim() && spec.value.trim()),
        images: formData.images.filter(img => img.url.trim()),
        driveType: formData.driveType || undefined,
        power: formData.power || undefined
      };

      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/cars');
      } else {
        setErrors({ submit: result.error || 'Virhe tallentaessa autoa' });
      }
    } catch (error) {
      console.error('Error creating car:', error);
      setErrors({ submit: 'Verkkovirhe. Yritä uudelleen.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/cars"
            className="p-2 text-slate-400 hover:text-slate-600 transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lisää uusi auto</h1>
            <p className="text-slate-600 mt-1">Täytä auton tiedot alla</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Virhe tallentaessa</h3>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Perustiedot</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Merkki *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => updateFormData('brand', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.brand ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="esim. BMW, Volkswagen"
              />
              {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Malli *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => updateFormData('model', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.model ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="esim. 318, Golf"
              />
              {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vuosi *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.year ? 'border-red-300' : 'border-slate-300'
                }`}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hinta (EUR) *
              </label>
              <input
                type="number"
                value={formData.priceEur}
                onChange={(e) => updateFormData('priceEur', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.priceEur ? 'border-red-300' : 'border-slate-300'
                }`}
                min="0"
                placeholder="15000"
              />
              {errors.priceEur && <p className="text-red-600 text-sm mt-1">{errors.priceEur}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kilometrit
              </label>
              <input
                type="number"
                value={formData.kmNumber}
                onChange={(e) => updateFormData('kmNumber', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.kmNumber ? 'border-red-300' : 'border-slate-300'
                }`}
                min="0"
                placeholder="120000"
              />
              {errors.kmNumber && <p className="text-red-600 text-sm mt-1">{errors.kmNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Väri
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => updateFormData('color', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Musta, Valkoinen, Sininen..."
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Tekniset tiedot</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Polttoaine
              </label>
              <select
                value={formData.fuel}
                onChange={(e) => updateFormData('fuel', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="DIESEL">Diesel</option>
                <option value="PETROL">Bensiini</option>
                <option value="ELECTRIC">Sähkö</option>
                <option value="HYBRID">Hybridi</option>
                <option value="PLUGIN_HYBRID">Lataushybridi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vaihteisto
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => updateFormData('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="AUTOMATIC">Automaatti</option>
                <option value="MANUAL">Manuaali</option>
                <option value="SEMI_AUTOMATIC">Puoliautomaatti</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vetotapa
              </label>
              <select
                value={formData.driveType}
                onChange={(e) => updateFormData('driveType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Valitse vetotapa</option>
                <option value="FWD">Etuveto</option>
                <option value="RWD">Takaveto</option>
                <option value="AWD">Neliveto</option>
                <option value="FOUR_WD">4x4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Moottorin koko
              </label>
              <input
                type="text"
                value={formData.engineSize}
                onChange={(e) => updateFormData('engineSize', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="esim. 2.0 TDI, 1.6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teho (HP)
              </label>
              <input
                type="number"
                value={formData.power}
                onChange={(e) => updateFormData('power', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                placeholder="150"
              />
            </div>
          </div>
        </div>

        {/* Status & Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Tila ja kategoria</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tila
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateFormData('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="AVAILABLE">Saatavilla</option>
                <option value="RESERVED">Varattu</option>
                <option value="SOLD">Myyty</option>
                <option value="COMING_SOON">Tulossa</option>
                <option value="UNDER_MAINTENANCE">Huollossa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kunto
              </label>
              <select
                value={formData.condition}
                onChange={(e) => updateFormData('condition', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="EXCELLENT">Erinomainen</option>
                <option value="GOOD">Hyvä</option>
                <option value="FAIR">Tyydyttävä</option>
                <option value="NEEDS_WORK">Kunnostettava</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="PREMIUM">Premium</option>
                <option value="FAMILY">Perhe</option>
                <option value="SUV">SUV</option>
                <option value="COMPACT">Kompakti</option>
                <option value="SPORTS">Urheilu</option>
                <option value="LUXURY">Luksus</option>
                <option value="ELECTRIC">Sähkö</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => updateFormData('featured', e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">
                Näytä etusivulla suosittuna
              </span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Kuvaukset</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lyhyt kuvaus *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.description ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Lyhyt ja ytimekäs kuvaus autosta..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Yksityiskohtainen kuvaus
              </label>
              {formData.detailedDescription.map((desc, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <textarea
                    value={desc}
                    onChange={(e) => updateArrayItem('detailedDescription', index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Kappale ${index + 1}...`}
                  />
                  {formData.detailedDescription.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('detailedDescription', index)}
                      className="p-2 text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('detailedDescription')}
                className="flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Lisää kappale
              </button>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Kuvat</h2>

          {formData.images.map((image, index) => (
            <div key={index} className="flex space-x-4 mb-4 p-4 border border-slate-200 rounded-lg">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kuvan URL {index === 0 && '*'}
                  </label>
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) => updateImage(index, 'url', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      index === 0 && errors.image ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {index === 0 && errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kuvan kuvaus
                  </label>
                  <input
                    type="text"
                    value={image.altText}
                    onChange={(e) => updateImage(index, 'altText', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Kuvan kuvaus..."
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={image.isPrimary}
                    onChange={(e) => updateImage(index, 'isPrimary', e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Pääkuva</span>
                </label>
              </div>
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-400 hover:text-red-600 transition self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addImage}
            className="flex items-center text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Lisää kuva
          </button>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Ominaisuudet</h2>

          {formData.features.map((feature, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateArrayItem('features', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="esim. Ilmastointi, Peruutuskamera..."
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="p-2 text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addArrayItem('features')}
            className="flex items-center text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Lisää ominaisuus
          </button>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Tekniset tiedot</h2>

          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => updateSpecification(index, 'label', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ominaisuus (esim. Omaisuus)"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Arvo (esim. Puhdas)"
              />
              {formData.specifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSpecification}
            className="flex items-center text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Lisää spesifikaatio
          </button>
        </div>

        {/* SEO */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">SEO-asetukset</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SEO-otsikko
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => updateFormData('metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Automaattisesti generoitu, jos tyhjä"
              />
              <p className="text-xs text-slate-500 mt-1">
                Suositeltu pituus: 50-60 merkkiä
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SEO-kuvaus
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => updateFormData('metaDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Automaattisesti generoitu, jos tyhjä"
              />
              <p className="text-xs text-slate-500 mt-1">
                Suositeltu pituus: 150-160 merkkiä
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/cars"
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              Peruuta
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Tallentaa...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Tallenna auto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}