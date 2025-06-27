const location = 'pink';

const validateLocation = async (loc) => {
    // Basic validation to check if the location is a non-empty string
    if (typeof loc !== 'string' || loc.trim().length === 0) {
        return false;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc)}&format=json`);
        
        if (!response.ok) {
            throw new Error(`Error fetching location data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Location data:', data);
        return data.length > 0 && data[0].display_name.toLowerCase().includes(loc.toLowerCase());
    } catch (error) {
        console.error('Validation error:', error);
        return false;
    }
};

// Execute the validation
validateLocation(location)
    .then(isValid => {
        isValid 
            ? console.log(`Location "${location}" is valid.`)
            : console.log(`Location "${location}" is invalid.`);
    })
    .catch(error => {
        console.error('Error during validation:', error);
    });