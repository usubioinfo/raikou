export const validateDimensions = (...dimensions: (string | null)[]): boolean => {
  if (dimensions.length !== 2) {
    return false;
  }

  for (let dimension of dimensions) {
    if (!dimension) {
      return false;
    }

    if (dimension.includes('.')) {
      return false;
    }

    if (!Number(dimension)) {
      return false;
    }
  }

  return true;
}
