export const formatPrice = (price) => {
  const value = typeof price === 'number' ? price : parseFloat(price || 0);
  return value.toFixed(2);
};
