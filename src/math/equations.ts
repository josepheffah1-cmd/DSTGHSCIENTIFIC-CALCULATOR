/**
 * DSTGH Scientific Calculator - Equation Solver
 * Solves:
 * 1. Linear equations: ax + b = c
 * 2. Quadratic equations: ax² + bx + c = 0 (with discriminant, steps, real & complex roots)
 * 3. Cubic equations: ax³ + bx² + cx + d = 0
 * 4. 2x2 Simultaneous Linear Systems
 * 5. 3x3 Simultaneous Linear Systems
 */

import { EquationSolution } from '../types';

export class EquationSolver {
  /**
   * Solve Linear Equation: ax + b = c
   */
  static solveLinear(a: number, b: number, c: number = 0): EquationSolution {
    if (a === 0) {
      if (b === c) {
        return {
          title: 'Linear Equation',
          equation: `${b} = ${c}`,
          roots: [],
          steps: ['0x = 0', 'The equation is an identity with infinitely many solutions.'],
        };
      } else {
        return {
          title: 'Linear Equation',
          equation: `${b} = ${c}`,
          roots: [],
          steps: [`${b} = ${c}`, 'Contradiction: No solution exists.'],
        };
      }
    }

    const rhs = c - b;
    const x = rhs / a;

    const steps: string[] = [
      `Original Equation: ${a}x + (${b}) = ${c}`,
      `Step 1: Subtract ${b} from both sides:`,
      `  ${a}x = ${c} - (${b})`,
      `  ${a}x = ${rhs}`,
      `Step 2: Divide both sides by ${a}:`,
      `  x = ${rhs} / ${a}`,
      `  x = ${parseFloat(x.toFixed(6))}`,
    ];

    return {
      title: 'Linear Equation: ax + b = c',
      equation: `${a}x + (${b}) = ${c}`,
      roots: [{ real: x }],
      steps,
    };
  }

  /**
   * Solve Quadratic Equation: ax² + bx + c = 0
   */
  static solveQuadratic(a: number, b: number, c: number): EquationSolution {
    if (a === 0) {
      return this.solveLinear(b, c, 0);
    }

    const disc = b * b - 4 * a * c;
    const steps: string[] = [
      `Original Equation: ${a}x² + (${b})x + (${c}) = 0`,
      `Step 1: Identify coefficients: a = ${a}, b = ${b}, c = ${c}`,
      `Step 2: Calculate Discriminant Δ = b² - 4ac:`,
      `  Δ = (${b})² - 4 × (${a}) × (${c})`,
      `  Δ = ${b * b} - ${4 * a * c} = ${disc}`,
    ];

    if (disc > 0) {
      const sqrtDisc = Math.sqrt(disc);
      const x1 = (-b + sqrtDisc) / (2 * a);
      const x2 = (-b - sqrtDisc) / (2 * a);

      steps.push(
        `Step 3: Since Δ > 0, there are two distinct real roots.`,
        `  x = (-b ± √Δ) / (2a)`,
        `  x₁ = (-(${b}) + √${disc}) / (2 × ${a}) = ${parseFloat(x1.toFixed(6))}`,
        `  x₂ = (-(${b}) - √${disc}) / (2 × ${a}) = ${parseFloat(x2.toFixed(6))}`
      );

      return {
        title: 'Quadratic Equation (Two Real Roots)',
        equation: `${a}x² + (${b})x + (${c}) = 0`,
        discriminant: disc,
        roots: [{ real: x1 }, { real: x2 }],
        steps,
      };
    } else if (disc === 0) {
      const x = -b / (2 * a);
      steps.push(
        `Step 3: Since Δ = 0, there is exactly one repeated real root.`,
        `  x = -b / (2a) = -(${b}) / (2 × ${a})`,
        `  x = ${parseFloat(x.toFixed(6))}`
      );

      return {
        title: 'Quadratic Equation (One Repeated Root)',
        equation: `${a}x² + (${b})x + (${c}) = 0`,
        discriminant: disc,
        roots: [{ real: x }],
        steps,
      };
    } else {
      // Complex conjugate roots
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-disc) / (2 * Math.abs(a));

      steps.push(
        `Step 3: Since Δ < 0, there are two complex conjugate roots.`,
        `  x = (-b ± i√(-Δ)) / (2a)`,
        `  Real part = -(${b}) / (2 × ${a}) = ${parseFloat(realPart.toFixed(6))}`,
        `  Imaginary part = √(${-disc}) / (2 × ${Math.abs(a)}) = ${parseFloat(imagPart.toFixed(6))}`,
        `  x₁ = ${parseFloat(realPart.toFixed(6))} + ${parseFloat(imagPart.toFixed(6))}i`,
        `  x₂ = ${parseFloat(realPart.toFixed(6))} - ${parseFloat(imagPart.toFixed(6))}i`
      );

      return {
        title: 'Quadratic Equation (Complex Roots)',
        equation: `${a}x² + (${b})x + (${c}) = 0`,
        discriminant: disc,
        roots: [
          { real: realPart, imag: imagPart },
          { real: realPart, imag: -imagPart },
        ],
        steps,
      };
    }
  }

  /**
   * Solve 2x2 Simultaneous Linear System:
   * a1*x + b1*y = c1
   * a2*x + b2*y = c2
   */
  static solve2x2System(
    a1: number, b1: number, c1: number,
    a2: number, b2: number, c2: number
  ): { x: number; y: number; steps: string[]; solvable: boolean } {
    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    const steps: string[] = [
      `System of Equations:`,
      `  [1] ${a1}x + ${b1}y = ${c1}`,
      `  [2] ${a2}x + ${b2}y = ${c2}`,
      `Cramer's Rule Method:`,
      `  Main Determinant D = (${a1})(${b2}) - (${a2})(${b1}) = ${D}`,
    ];

    if (Math.abs(D) < 1e-12) {
      if (Math.abs(Dx) < 1e-12 && Math.abs(Dy) < 1e-12) {
        steps.push(`  D = 0 and Dx = Dy = 0: Infinitely many solutions (dependent lines).`);
      } else {
        steps.push(`  D = 0 and Dx, Dy ≠ 0: Inconsistent system (parallel lines, no solution).`);
      }
      return { x: NaN, y: NaN, steps, solvable: false };
    }

    const x = Dx / D;
    const y = Dy / D;

    steps.push(
      `  Dx = (${c1})(${b2}) - (${c2})(${b1}) = ${Dx}`,
      `  Dy = (${a1})(${c2}) - (${a2})(${c1}) = ${Dy}`,
      `  x = Dx / D = ${Dx} / ${D} = ${parseFloat(x.toFixed(6))}`,
      `  y = Dy / D = ${Dy} / ${D} = ${parseFloat(y.toFixed(6))}`
    );

    return { x, y, steps, solvable: true };
  }

  /**
   * Solve 3x3 Simultaneous Linear System
   */
  static solve3x3System(
    a1: number, b1: number, c1: number, d1: number,
    a2: number, b2: number, c2: number, d2: number,
    a3: number, b3: number, c3: number, d3: number
  ): { x: number; y: number; z: number; steps: string[]; solvable: boolean } {
    const det3 = (
      m11: number, m12: number, m13: number,
      m21: number, m22: number, m23: number,
      m31: number, m32: number, m33: number
    ) =>
      m11 * (m22 * m33 - m23 * m32) -
      m12 * (m21 * m33 - m23 * m31) +
      m13 * (m21 * m32 - m22 * m31);

    const D = det3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
    const Dx = det3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
    const Dy = det3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
    const Dz = det3(a1, b1, d1, a2, b2, d2, a3, b3, d3);

    const steps: string[] = [
      `3×3 Linear System:`,
      `  [1] ${a1}x + ${b1}y + ${c1}z = ${d1}`,
      `  [2] ${a2}x + ${b2}y + ${c2}z = ${d2}`,
      `  [3] ${a3}x + ${b3}y + ${c3}z = ${d3}`,
      `Determinants:`,
      `  D = ${parseFloat(D.toFixed(6))}`,
    ];

    if (Math.abs(D) < 1e-12) {
      steps.push(`  D = 0: Matrix is singular. System has no unique solution.`);
      return { x: NaN, y: NaN, z: NaN, steps, solvable: false };
    }

    const x = Dx / D;
    const y = Dy / D;
    const z = Dz / D;

    steps.push(
      `  Dx = ${parseFloat(Dx.toFixed(6))}`,
      `  Dy = ${parseFloat(Dy.toFixed(6))}`,
      `  Dz = ${parseFloat(Dz.toFixed(6))}`,
      `Solutions:`,
      `  x = Dx / D = ${parseFloat(x.toFixed(6))}`,
      `  y = Dy / D = ${parseFloat(y.toFixed(6))}`,
      `  z = Dz / D = ${parseFloat(z.toFixed(6))}`
    );

    return { x, y, z, steps, solvable: true };
  }

  /**
   * Solve Cubic Equation: ax³ + bx² + cx + d = 0
   * Using Cardano's Method with Depressed Cubic
   */
  static solveCubic(a: number, b: number, c: number, d: number): EquationSolution {
    if (a === 0) {
      return this.solveQuadratic(b, c, d);
    }

    const steps: string[] = [
      `Original Equation: ${a}x³ + (${b})x² + (${c})x + (${d}) = 0`,
      `Step 1: Normalize equation by dividing by leading coefficient a = ${a}:`,
    ];

    // Normalize: x³ + a1 x² + a2 x + a3 = 0
    const a1 = b / a;
    const a2 = c / a;
    const a3 = d / a;
    steps.push(`  x³ + (${parseFloat(a1.toFixed(6))})x² + (${parseFloat(a2.toFixed(6))})x + (${parseFloat(a3.toFixed(6))}) = 0`);

    // Transform to depressed cubic: t³ + pt + q = 0 where x = t - a1/3
    const shift = a1 / 3;
    const p = a2 - (a1 * a1) / 3;
    const q = (2 * a1 * a1 * a1) / 27 - (a1 * a2) / 3 + a3;

    steps.push(
      `Step 2: Substitute x = t - (b / 3a) = t - (${parseFloat(shift.toFixed(6))}) to obtain depressed cubic t³ + pt + q = 0:`,
      `  p = c/a - (b²/3a²) = ${parseFloat(p.toFixed(6))}`,
      `  q = 2b³/(27a³) - bc/(3a²) + d/a = ${parseFloat(q.toFixed(6))}`
    );

    // Discriminant of depressed cubic: Δ = (q/2)² + (p/3)³
    const disc = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3);
    steps.push(`Step 3: Calculate discriminant Δ = (q/2)² + (p/3)³ = ${parseFloat(disc.toFixed(8))}`);

    const roots: { real: number; imag?: number }[] = [];

    if (Math.abs(disc) < 1e-11) {
      // Δ = 0: All roots real, at least two are equal
      if (Math.abs(q) < 1e-11) {
        // Triple root
        const x = -shift;
        roots.push({ real: x }, { real: x }, { real: x });
        steps.push(`  Δ = 0 and q = 0: Triple real root x = ${parseFloat(x.toFixed(6))}`);
      } else {
        const u = Math.cbrt(-q / 2);
        const t1 = 2 * u;
        const t2 = -u;
        const x1 = t1 - shift;
        const x2 = t2 - shift;
        roots.push({ real: x1 }, { real: x2 }, { real: x2 });
        steps.push(
          `  Δ = 0: One single real root and one double real root:`,
          `  x₁ = ${parseFloat(x1.toFixed(6))}`,
          `  x₂ = x₃ = ${parseFloat(x2.toFixed(6))}`
        );
      }
    } else if (disc > 0) {
      // Δ > 0: One real root and two complex conjugate roots
      const sqrtDisc = Math.sqrt(disc);
      const u = Math.cbrt(-q / 2 + sqrtDisc);
      const v = Math.cbrt(-q / 2 - sqrtDisc);
      const t1 = u + v;
      const x1 = t1 - shift;

      const realPart = -(u + v) / 2 - shift;
      const imagPart = (Math.sqrt(3) * Math.abs(u - v)) / 2;

      roots.push(
        { real: x1 },
        { real: realPart, imag: imagPart },
        { real: realPart, imag: -imagPart }
      );

      steps.push(
        `  Δ > 0: One real root and two complex conjugate roots.`,
        `  x₁ = ${parseFloat(x1.toFixed(6))}`,
        `  x₂ = ${parseFloat(realPart.toFixed(6))} + ${parseFloat(imagPart.toFixed(6))}i`,
        `  x₃ = ${parseFloat(realPart.toFixed(6))} - ${parseFloat(imagPart.toFixed(6))}i`
      );
    } else {
      // Δ < 0: Three distinct real roots (trigonometric method)
      const m = 2 * Math.sqrt(-p / 3);
      const theta = Math.acos((-q / 2) / Math.sqrt(-((p / 3) ** 3)));
      const t1 = m * Math.cos(theta / 3);
      const t2 = m * Math.cos((theta + 2 * Math.PI) / 3);
      const t3 = m * Math.cos((theta + 4 * Math.PI) / 3);

      const x1 = t1 - shift;
      const x2 = t2 - shift;
      const x3 = t3 - shift;

      // Sort roots descending
      const sorted = [x1, x2, x3].sort((r1, r2) => r2 - r1);
      roots.push({ real: sorted[0] }, { real: sorted[1] }, { real: sorted[2] });

      steps.push(
        `  Δ < 0: Three distinct real roots (casus irreducibilis via trigonometric method).`,
        `  x₁ = ${parseFloat(sorted[0].toFixed(6))}`,
        `  x₂ = ${parseFloat(sorted[1].toFixed(6))}`,
        `  x₃ = ${parseFloat(sorted[2].toFixed(6))}`
      );
    }

    return {
      title: 'Cubic Equation: ax³ + bx² + cx + d = 0',
      equation: `${a}x³ + (${b})x² + (${c})x + (${d}) = 0`,
      roots,
      steps,
      discriminant: disc,
    };
  }
}
