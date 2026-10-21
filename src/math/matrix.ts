/**
 * DSTGH Scientific Calculator - Matrix Operations Engine
 * Comprehensive Linear Algebra for 2×2 and 3×3 Matrices:
 * - Determinant, Inverse, Transpose, Trace, Rank, Adjugate
 * - Addition, Subtraction, Multiplication, Matrix Powers (A², A³), Scalar Multiplication
 * - Characteristic Polynomial & Real/Complex Eigenvalues
 */

export interface EigenResult {
  characteristicPoly: string;
  eigenvalues: string[];
}

export class MatrixMath {
  public static determinant2x2(m: number[][]): number {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }

  public static determinant3x3(m: number[][]): number {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }

  public static determinant(m: number[][]): number {
    if (m.length === 2 && m[0].length === 2) return this.determinant2x2(m);
    if (m.length === 3 && m[0].length === 3) return this.determinant3x3(m);
    throw new Error('Only 2×2 and 3×3 matrices supported');
  }

  public static transpose(m: number[][]): number[][] {
    const rows = m.length;
    const cols = m[0].length;
    const res: number[][] = [];
    for (let c = 0; c < cols; c++) {
      res[c] = [];
      for (let r = 0; r < rows; r++) {
        res[c][r] = m[r][c];
      }
    }
    return res;
  }

  public static add(A: number[][], B: number[][]): number[][] {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      throw new Error('Matrix dimensions must match for addition');
    }
    return A.map((row, r) => row.map((val, c) => val + B[r][c]));
  }

  public static subtract(A: number[][], B: number[][]): number[][] {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      throw new Error('Matrix dimensions must match for subtraction');
    }
    return A.map((row, r) => row.map((val, c) => val - B[r][c]));
  }

  public static multiply(A: number[][], B: number[][]): number[][] {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;

    if (colsA !== rowsB) {
      throw new Error(`Cannot multiply ${rowsA}×${colsA} by ${rowsB}×${colsB}`);
    }

    const res: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += A[i][k] * B[k][j];
        }
        res[i][j] = sum;
      }
    }

    return res;
  }

  public static scale(m: number[][], factor: number): number[][] {
    return m.map((row) => row.map((val) => val * factor));
  }

  public static power(m: number[][], exp: 2 | 3): number[][] {
    if (m.length !== m[0].length) throw new Error('Matrix must be square');
    const sq = this.multiply(m, m);
    if (exp === 2) return sq;
    return this.multiply(sq, m);
  }

  public static trace(m: number[][]): number {
    if (m.length !== m[0].length) throw new Error('Matrix must be square for trace');
    let tr = 0;
    for (let i = 0; i < m.length; i++) {
      tr += m[i][i];
    }
    return tr;
  }

  public static rank(m: number[][]): number {
    // Gaussian elimination to find number of non-zero rows
    const A = m.map((r) => [...r]);
    const rows = A.length;
    const cols = A[0].length;
    let rank = 0;

    for (let col = 0; col < cols && rank < rows; col++) {
      // Find pivot
      let pivotRow = rank;
      while (pivotRow < rows && Math.abs(A[pivotRow][col]) < 1e-10) {
        pivotRow++;
      }

      if (pivotRow < rows) {
        // Swap rows
        const temp = A[rank];
        A[rank] = A[pivotRow];
        A[pivotRow] = temp;

        // Normalize pivot row
        const pivotVal = A[rank][col];
        for (let c = col; c < cols; c++) {
          A[rank][c] /= pivotVal;
        }

        // Eliminate column entries below
        for (let r = rank + 1; r < rows; r++) {
          const factor = A[r][col];
          for (let c = col; c < cols; c++) {
            A[r][c] -= factor * A[rank][c];
          }
        }
        rank++;
      }
    }

    return rank;
  }

  public static inverse(m: number[][]): number[][] {
    const det = this.determinant(m);
    if (Math.abs(det) < 1e-12) {
      throw new Error('Matrix is singular (det = 0). Inverse does not exist.');
    }

    if (m.length === 2) {
      return [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det],
      ];
    }

    // 3x3 Adjugate matrix / det
    const adj = this.adjugate3x3(m);
    return this.scale(adj, 1 / det);
  }

  public static adjugate(m: number[][]): number[][] {
    if (m.length === 2) {
      return [
        [m[1][1], -m[0][1]],
        [-m[1][0], m[0][0]],
      ];
    }
    return this.adjugate3x3(m);
  }

  private static adjugate3x3(m: number[][]): number[][] {
    return [
      [
        m[1][1] * m[2][2] - m[1][2] * m[2][1],
        -(m[0][1] * m[2][2] - m[0][2] * m[2][1]),
        m[0][1] * m[1][2] - m[0][2] * m[1][1],
      ],
      [
        -(m[1][0] * m[2][2] - m[1][2] * m[2][0]),
        m[0][0] * m[2][2] - m[0][2] * m[2][0],
        -(m[0][0] * m[1][2] - m[0][2] * m[1][0]),
      ],
      [
        m[1][0] * m[2][1] - m[1][1] * m[2][0],
        -(m[0][0] * m[2][1] - m[0][1] * m[2][0]),
        m[0][0] * m[1][1] - m[0][1] * m[1][0],
      ],
    ];
  }

  public static identity(size: 2 | 3): number[][] {
    return Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => (r === c ? 1 : 0))
    );
  }

  /**
   * Computes characteristic polynomial and eigenvalues.
   */
  public static eigenvalues(m: number[][]): EigenResult {
    if (m.length === 2) {
      const tr = this.trace(m);
      const det = this.determinant2x2(m);
      // Characteristic equation: λ² - tr*λ + det = 0
      const disc = tr * tr - 4 * det;

      const signTr = tr >= 0 ? `- ${parseFloat(tr.toFixed(4))}λ` : `+ ${parseFloat(Math.abs(tr).toFixed(4))}λ`;
      const signDet = det >= 0 ? `+ ${parseFloat(det.toFixed(4))}` : `- ${parseFloat(Math.abs(det).toFixed(4))}`;
      const poly = `λ² ${signTr} ${signDet} = 0`;

      if (Math.abs(disc) < 1e-10) {
        const val = parseFloat((tr / 2).toFixed(4));
        return {
          characteristicPoly: poly,
          eigenvalues: [`λ₁ = λ₂ = ${val} (Multiplicity 2)`],
        };
      } else if (disc > 0) {
        const sqrtDisc = Math.sqrt(disc);
        const l1 = parseFloat(((tr + sqrtDisc) / 2).toFixed(4));
        const l2 = parseFloat(((tr - sqrtDisc) / 2).toFixed(4));
        return {
          characteristicPoly: poly,
          eigenvalues: [`λ₁ = ${l1}`, `λ₂ = ${l2}`],
        };
      } else {
        const realPart = parseFloat((tr / 2).toFixed(4));
        const imagPart = parseFloat((Math.sqrt(-disc) / 2).toFixed(4));
        return {
          characteristicPoly: poly,
          eigenvalues: [
            `λ₁ = ${realPart} + ${imagPart}i`,
            `λ₂ = ${realPart} - ${imagPart}i`,
          ],
        };
      }
    }

    // 3x3 characteristic polynomial:
    // p(λ) = -λ³ + c2 λ² - c1 λ + c0 = 0
    // where c2 = tr(A), c0 = det(A), c1 = M11 + M22 + M33 (sum of principal minors)
    const c2 = this.trace(m);
    const m11 = m[1][1] * m[2][2] - m[1][2] * m[2][1];
    const m22 = m[0][0] * m[2][2] - m[0][2] * m[2][0];
    const m33 = m[0][0] * m[1][1] - m[0][1] * m[1][0];
    const c1 = m11 + m22 + m33;
    const c0 = this.determinant3x3(m);

    const polyStr = `-λ³ + ${parseFloat(c2.toFixed(3))}λ² - ${parseFloat(c1.toFixed(3))}λ + ${parseFloat(c0.toFixed(3))} = 0`;

    // Solve cubic: λ³ - c2 λ² + c1 λ - c0 = 0
    // Using standard depressed cubic substitution: λ = t + c2/3
    const a = -c2;
    const b = c1;
    const c = -c0;

    const p = b - (a * a) / 3;
    const q = (2 * a * a * a) / 27 - (a * b) / 3 + c;
    const delta = (q * q) / 4 + (p * p * p) / 27;

    const eigenvalues: string[] = [];

    if (delta > 1e-9) {
      // One real root, two complex conjugates
      const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
      const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
      const r1 = parseFloat((u + v - a / 3).toFixed(4));
      const realPart = parseFloat((-(u + v) / 2 - a / 3).toFixed(4));
      const imagPart = parseFloat(((Math.sqrt(3) / 2) * Math.abs(u - v)).toFixed(4));
      eigenvalues.push(`λ₁ = ${r1}`);
      eigenvalues.push(`λ₂ = ${realPart} + ${imagPart}i`);
      eigenvalues.push(`λ₃ = ${realPart} - ${imagPart}i`);
    } else if (Math.abs(delta) <= 1e-9) {
      // All real, at least two equal
      const r1 = parseFloat((2 * Math.cbrt(-q / 2) - a / 3).toFixed(4));
      const r2 = parseFloat((-Math.cbrt(-q / 2) - a / 3).toFixed(4));
      eigenvalues.push(`λ₁ = ${r1}`);
      eigenvalues.push(`λ₂ = λ₃ = ${r2}`);
    } else {
      // Three distinct real roots (trigonometric method)
      const r = Math.sqrt(-(p * p * p) / 27);
      const phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
      const t1 = 2 * Math.cbrt(r) * Math.cos(phi / 3);
      const t2 = 2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI) / 3);
      const t3 = 2 * Math.cbrt(r) * Math.cos((phi + 4 * Math.PI) / 3);

      const roots = [t1 - a / 3, t2 - a / 3, t3 - a / 3]
        .map((x) => parseFloat(x.toFixed(4)))
        .sort((x, y) => x - y);
      eigenvalues.push(`λ₁ = ${roots[0]}`);
      eigenvalues.push(`λ₂ = ${roots[1]}`);
      eigenvalues.push(`λ₃ = ${roots[2]}`);
    }

    return {
      characteristicPoly: polyStr,
      eigenvalues,
    };
  }
}
