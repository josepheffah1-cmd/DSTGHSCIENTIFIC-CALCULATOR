/**
 * DSTGH Scientific Calculator - Vector Math Engine
 * Comprehensive 2D & 3D Vector Calculus:
 * - Magnitude (Norm), Unit Vectors, Vector Addition & Subtraction
 * - Dot Product, Cross Product, Angle (DEG/RAD/GRAD)
 * - Vector Projection & Scalar Component
 * - Distance between vectors, Scalar Triple Product
 * - Linear combinations (a*u + b*v)
 */

export class VectorMath {
  public static magnitude(v: number[]): number {
    return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  }

  public static add(u: number[], v: number[]): number[] {
    if (u.length !== v.length) throw new Error('Vector dimensions must match');
    return u.map((val, i) => val + v[i]);
  }

  public static subtract(u: number[], v: number[]): number[] {
    if (u.length !== v.length) throw new Error('Vector dimensions must match');
    return u.map((val, i) => val - v[i]);
  }

  public static scale(v: number[], factor: number): number[] {
    return v.map((x) => x * factor);
  }

  public static dotProduct(u: number[], v: number[]): number {
    if (u.length !== v.length) throw new Error('Vector dimensions must match');
    return u.reduce((sum, val, i) => sum + val * v[i], 0);
  }

  public static crossProduct(u: number[], v: number[]): number[] {
    if (u.length !== 3 || v.length !== 3) {
      throw new Error('Cross product is defined for 3-dimensional vectors');
    }
    return [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
  }

  public static unitVector(v: number[]): number[] {
    const mag = this.magnitude(v);
    if (mag === 0) throw new Error('Zero vector (0) has no unit vector');
    return v.map((x) => x / mag);
  }

  public static angleBetween(
    u: number[],
    v: number[],
    mode: 'DEG' | 'RAD' | 'GRAD' = 'DEG'
  ): number {
    const dot = this.dotProduct(u, v);
    const magU = this.magnitude(u);
    const magV = this.magnitude(v);

    if (magU === 0 || magV === 0) {
      throw new Error('Cannot find angle with a zero vector');
    }

    let cosTheta = dot / (magU * magV);
    // Clamp rounding errors to [-1, 1]
    cosTheta = Math.max(-1, Math.min(1, cosTheta));
    const rad = Math.acos(cosTheta);

    if (mode === 'DEG') return (rad * 180) / Math.PI;
    if (mode === 'GRAD') return (rad * 200) / Math.PI;
    return rad;
  }

  public static projection(u: number[], v: number[]): number[] {
    const magV = this.magnitude(v);
    if (magV === 0) throw new Error('Cannot project onto a zero vector');
    const factor = this.dotProduct(u, v) / (magV * magV);
    return this.scale(v, factor);
  }

  public static scalarProjection(u: number[], v: number[]): number {
    const magV = this.magnitude(v);
    if (magV === 0) throw new Error('Cannot project onto a zero vector');
    return this.dotProduct(u, v) / magV;
  }

  public static distance(u: number[], v: number[]): number {
    const diff = this.subtract(u, v);
    return this.magnitude(diff);
  }

  /**
   * Scalar Triple Product: u · (v × w)
   * Represents the signed volume of the parallelepiped spanned by u, v, w.
   */
  public static scalarTripleProduct(u: number[], v: number[], w: number[]): number {
    if (u.length !== 3 || v.length !== 3 || w.length !== 3) {
      throw new Error('Scalar triple product requires three 3D vectors');
    }
    const cross = this.crossProduct(v, w);
    return this.dotProduct(u, cross);
  }

  public static linearCombination(
    a: number,
    u: number[],
    b: number,
    v: number[]
  ): number[] {
    if (u.length !== v.length) throw new Error('Vector dimensions must match');
    return u.map((val, i) => a * val + b * v[i]);
  }
}
