/**
 * DSTGH Scientific Calculator - Unit Converter Engine
 * 14 Comprehensive Categories
 */

import { UnitCategory } from '../types';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    iconName: 'Ruler',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'um', name: 'Micrometer', symbol: 'μm', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', toBase: (v) => v / 1e9, fromBase: (v) => v * 1e9 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'NM', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    iconName: 'Scale',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
      { id: 't', name: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    iconName: 'Square',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', toBase: (v) => v / 1e4, fromBase: (v) => v * 1e4 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', toBase: (v) => v * 1e4, fromBase: (v) => v / 1e4 },
      { id: 'ac', name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    iconName: 'Box',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm3', name: 'Cubic Centimeter', symbol: 'cm³', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'gal', name: 'US Gallon', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'qt', name: 'US Quart', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { id: 'pt', name: 'US Pint', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    units: [
      { id: 's', name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'min', name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'h', name: 'Hour', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'd', name: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'yr', name: 'Year (365d)', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    iconName: 'Gauge',
    units: [
      { id: 'mps', name: 'Meter per Second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kph', name: 'Kilometer per Hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'Mile per Hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Compass',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
      { id: 'psi', name: 'Pound / sq inch', symbol: 'psi', toBase: (v) => v * 6894.757, fromBase: (v) => v / 6894.757 },
      { id: 'mmhg', name: 'mmHg (Torr)', symbol: 'mmHg', toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    iconName: 'Zap',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cal', name: 'Calorie', symbol: 'cal', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
      { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      { id: 'kwh', name: 'Kilowatt-Hour', symbol: 'kWh', toBase: (v) => v * 3.6e6, fromBase: (v) => v / 3.6e6 },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', toBase: (v) => v * 1.602176634e-19, fromBase: (v) => v / 1.602176634e-19 },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    iconName: 'Cpu',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'hp', name: 'Horsepower (Mechanical)', symbol: 'hp', toBase: (v) => v * 745.699872, fromBase: (v) => v / 745.699872 },
    ],
  },
  {
    id: 'force',
    name: 'Force',
    iconName: 'Activity',
    units: [
      { id: 'n', name: 'Newton', symbol: 'N', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kn', name: 'Kilonewton', symbol: 'kN', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'lbf', name: 'Pound-force', symbol: 'lbf', toBase: (v) => v * 4.44822, fromBase: (v) => v / 4.44822 },
      { id: 'dyn', name: 'Dyne', symbol: 'dyn', toBase: (v) => v * 1e-5, fromBase: (v) => v / 1e-5 },
    ],
  },
  {
    id: 'frequency',
    name: 'Frequency',
    iconName: 'Radio',
    units: [
      { id: 'hz', name: 'Hertz', symbol: 'Hz', toBase: (v) => v, fromBase: (v) => v },
      { id: 'khz', name: 'Kilohertz', symbol: 'kHz', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'mhz', name: 'Megahertz', symbol: 'MHz', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'ghz', name: 'Gigahertz', symbol: 'GHz', toBase: (v) => v * 1e9, fromBase: (v) => v / 1e9 },
      { id: 'rpm', name: 'Revolutions / min', symbol: 'RPM', toBase: (v) => v / 60, fromBase: (v) => v * 60 },
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    iconName: 'PieChart',
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', toBase: (v) => v, fromBase: (v) => v },
      { id: 'rad', name: 'Radian', symbol: 'rad', toBase: (v) => (v * 180) / Math.PI, fromBase: (v) => (v * Math.PI) / 180 },
      { id: 'grad', name: 'Gradian', symbol: 'grad', toBase: (v) => (v * 180) / 200, fromBase: (v) => (v * 200) / 180 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    iconName: 'Database',
    units: [
      { id: 'b', name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
      { id: 'bit', name: 'Bit', symbol: 'bit', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    ],
  },
];

export function convertUnit(
  val: number,
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string
): number {
  const fromU = category.units.find((u) => u.id === fromUnitId);
  const toU = category.units.find((u) => u.id === toUnitId);
  if (!fromU || !toU) return NaN;

  const baseVal = fromU.toBase(val);
  return toU.fromBase(baseVal);
}
