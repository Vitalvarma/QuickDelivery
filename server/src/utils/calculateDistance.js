function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export const calculateDistance = (location1, location2) => {
  if (!location1 || !location2) {
    throw new Error('Both locations must be provided');
  }

  const { lat: lat1, lon: lon1 } = location1;
  const { lat: lat2, lon: lon2 } = location2;

  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    throw new Error('Invalid location coordinates');
  }

  return haversineDistance(lat1, lon1, lat2, lon2);
}