export const  calculateCost = (weight, distance) => {
        let cost = 0;
        if (weight <= 1) {
            cost = 10 + (distance * 0.1);
            } else if (weight <=
            5) {
            cost = 20 + (distance * 0.2);
            } else {
            cost = 30 + (distance * 0.3);
            }
        return cost;
    }