// Minimal shim for d3-interpolate used by d3-scale in this project.
// Provides basic numeric interpolation and a rounding variant.
// This is intentionally small and only implements the features required by d3-scale usage in the bundle.

export function interpolate(a, b) {
  // If both are numbers, simple linear interpolation
  if (typeof a === 'number' && typeof b === 'number') {
    const delta = b - a;
    return function(t) {
      return a + delta * t;
    };
  }

  // Fallback: return a function that uses string concatenation for non-number types
  return function(t) {
    return t < 0.5 ? a : b;
  };
}

export function interpolateRound(a, b) {
  const interp = interpolate(a, b);
  return function(t) {
    return Math.round(interp(t));
  };
}

export default {
  interpolate,
  interpolateRound,
};