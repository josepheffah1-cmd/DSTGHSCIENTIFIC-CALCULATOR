/**
 * DSTGH Scientific Calculator - Formula Library
 * Searchable formulas across 10 academic and professional categories
 */

import { FormulaItem } from '../types';

export const FORMULA_LIBRARY: FormulaItem[] = [
  // ALGEBRA
  {
    id: 'alg-quad',
    category: 'Algebra',
    name: 'Quadratic Formula',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    expressionToInsert: '(-b + √(b² - 4*a*c))/(2*a)',
    description: 'Finds the roots of any second-order polynomial ax² + bx + c = 0.',
    variables: [
      { symbol: 'a', meaning: 'Leading quadratic coefficient (≠ 0)' },
      { symbol: 'b', meaning: 'Linear term coefficient' },
      { symbol: 'c', meaning: 'Constant term' },
    ],
  },
  {
    id: 'alg-diff-sq',
    category: 'Algebra',
    name: 'Difference of Squares',
    formula: 'a² - b² = (a - b)(a + b)',
    expressionToInsert: 'a² - b²',
    description: 'Fundamental algebraic factorization identity.',
    variables: [
      { symbol: 'a', meaning: 'First term' },
      { symbol: 'b', meaning: 'Second term' },
    ],
  },
  {
    id: 'alg-binomial',
    category: 'Algebra',
    name: 'Binomial Square (a + b)²',
    formula: '(a + b)² = a² + 2ab + b²',
    expressionToInsert: '(a + b)²',
    description: 'Expansion of a sum squared.',
    variables: [
      { symbol: 'a, b', meaning: 'Terms in the binomial' },
    ],
  },

  // GEOMETRY
  {
    id: 'geom-circle-area',
    category: 'Geometry',
    name: 'Area of a Circle',
    formula: 'A = π · r²',
    expressionToInsert: 'π * r²',
    description: 'Calculates the area enclosed by a circle of radius r.',
    variables: [{ symbol: 'r', meaning: 'Radius of circle' }],
  },
  {
    id: 'geom-pythagorean',
    category: 'Geometry',
    name: 'Pythagorean Theorem',
    formula: 'c = √(a² + b²)',
    expressionToInsert: '√(a² + b²)',
    description: 'Length of hypotenuse in a right-angled triangle.',
    variables: [
      { symbol: 'a, b', meaning: 'Lengths of legs' },
      { symbol: 'c', meaning: 'Hypotenuse' },
    ],
  },
  {
    id: 'geom-sphere-vol',
    category: 'Geometry',
    name: 'Volume of a Sphere',
    formula: 'V = (4/3) · π · r³',
    expressionToInsert: '(4/3) * π * r³',
    description: 'Three-dimensional capacity of a sphere.',
    variables: [{ symbol: 'r', meaning: 'Radius of sphere' }],
  },

  // TRIGONOMETRY
  {
    id: 'trig-pythagorean',
    category: 'Trigonometry',
    name: 'Pythagorean Identity',
    formula: 'sin²(θ) + cos²(θ) = 1',
    expressionToInsert: 'sin(x)² + cos(x)²',
    description: 'Fundamental trigonometric identity relating sine and cosine.',
    variables: [{ symbol: 'θ', meaning: 'Angle in degrees or radians' }],
  },
  {
    id: 'trig-double-sin',
    category: 'Trigonometry',
    name: 'Sine Double Angle',
    formula: 'sin(2θ) = 2 · sin(θ) · cos(θ)',
    expressionToInsert: '2 * sin(θ) * cos(θ)',
    description: 'Double angle identity for sine.',
    variables: [{ symbol: 'θ', meaning: 'Angle' }],
  },
  {
    id: 'trig-law-cosines',
    category: 'Trigonometry',
    name: 'Law of Cosines',
    formula: 'c² = a² + b² - 2ab · cos(C)',
    expressionToInsert: '√(a² + b² - 2*a*b*cos(C))',
    description: 'Relates sides of any triangle to the cosine of an angle.',
    variables: [
      { symbol: 'a, b', meaning: 'Lengths of adjacent sides' },
      { symbol: 'C', meaning: 'Angle opposite side c' },
    ],
  },

  // CALCULUS
  {
    id: 'calc-power-rule',
    category: 'Calculus',
    name: 'Derivative Power Rule',
    formula: 'd/dx(xⁿ) = n · xⁿ⁻¹',
    expressionToInsert: 'n * x^(n - 1)',
    description: 'Differentiation rule for polynomial powers.',
    variables: [
      { symbol: 'n', meaning: 'Exponent power' },
      { symbol: 'x', meaning: 'Independent variable' },
    ],
  },
  {
    id: 'calc-integ-power',
    category: 'Calculus',
    name: 'Indefinite Integral Power Rule',
    formula: '∫ xⁿ dx = (xⁿ⁺¹) / (n + 1) + C',
    expressionToInsert: 'x^(n + 1) / (n + 1)',
    description: 'Standard antiderivative for powers (n ≠ -1).',
    variables: [{ symbol: 'n', meaning: 'Exponent (n ≠ -1)' }],
  },

  // STATISTICS & PROBABILITY
  {
    id: 'stat-sample-mean',
    category: 'Statistics',
    name: 'Arithmetic Mean',
    formula: 'x̄ = (Σx) / n',
    expressionToInsert: 'Σx / n',
    description: 'Sum of all observations divided by count.',
    variables: [
      { symbol: 'Σx', meaning: 'Sum of all values' },
      { symbol: 'n', meaning: 'Number of observations' },
    ],
  },
  {
    id: 'prob-comb',
    category: 'Probability',
    name: 'Combinations (nCr)',
    formula: 'nCr = n! / (r! · (n - r)!)',
    expressionToInsert: '5 nCr 2',
    description: 'Number of ways to choose r items from n without regard to order.',
    variables: [
      { symbol: 'n', meaning: 'Total set size' },
      { symbol: 'r', meaning: 'Selection size' },
    ],
  },

  // PHYSICS
  {
    id: 'phys-newton-2',
    category: 'Physics',
    name: "Newton's Second Law",
    formula: 'F = m · a',
    expressionToInsert: 'm * a',
    description: 'Net force equals mass times acceleration.',
    variables: [
      { symbol: 'm', meaning: 'Mass in kg' },
      { symbol: 'a', meaning: 'Acceleration in m/s²' },
    ],
  },
  {
    id: 'phys-kinetic-energy',
    category: 'Physics',
    name: 'Kinetic Energy',
    formula: 'Ek = 0.5 · m · v²',
    expressionToInsert: '0.5 * m * v²',
    description: 'Mechanical kinetic energy of an object in motion.',
    variables: [
      { symbol: 'm', meaning: 'Mass (kg)' },
      { symbol: 'v', meaning: 'Velocity (m/s)' },
    ],
  },
  {
    id: 'phys-einstein',
    category: 'Physics',
    name: 'Mass-Energy Equivalence',
    formula: 'E = m · c²',
    expressionToInsert: 'm * (2.99792458e8)²',
    description: "Einstein's energy-mass equivalence equation.",
    variables: [{ symbol: 'm', meaning: 'Mass in kg' }],
  },

  // CHEMISTRY
  {
    id: 'chem-ideal-gas',
    category: 'Chemistry',
    name: 'Ideal Gas Law',
    formula: 'P = (n · R · T) / V',
    expressionToInsert: '(n * 8.314 * T) / V',
    description: 'State of a hypothetical ideal gas (R = 8.314 J/(mol·K)).',
    variables: [
      { symbol: 'n', meaning: 'Moles of gas' },
      { symbol: 'T', meaning: 'Temperature in Kelvin' },
      { symbol: 'V', meaning: 'Volume in m³' },
    ],
  },

  // ENGINEERING
  {
    id: 'eng-ohms-law',
    category: 'Engineering',
    name: "Ohm's Law",
    formula: 'V = I · R',
    expressionToInsert: 'I * R',
    description: 'Voltage equals electric current times electrical resistance.',
    variables: [
      { symbol: 'I', meaning: 'Current in Amperes (A)' },
      { symbol: 'R', meaning: 'Resistance in Ohms (Ω)' },
    ],
  },
  {
    id: 'eng-electrical-power',
    category: 'Engineering',
    name: 'Electrical Power',
    formula: 'P = V · I = I² · R',
    expressionToInsert: 'I² * R',
    description: 'Rate at which electrical energy is transferred by an electric circuit.',
    variables: [
      { symbol: 'I', meaning: 'Current (A)' },
      { symbol: 'R', meaning: 'Resistance (Ω)' },
    ],
  },

  // FINANCE
  {
    id: 'fin-compound-interest',
    category: 'Finance',
    name: 'Compound Interest',
    formula: 'A = P · (1 + r/n)^(n·t)',
    expressionToInsert: 'P * (1 + r/n)^(n * t)',
    description: 'Future value of an investment with periodic compounding.',
    variables: [
      { symbol: 'P', meaning: 'Initial principal' },
      { symbol: 'r', meaning: 'Annual interest rate (decimal)' },
      { symbol: 'n', meaning: 'Compounding frequency per year' },
      { symbol: 't', meaning: 'Time in years' },
    ],
  },
];
