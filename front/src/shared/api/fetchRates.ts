import axios from 'axios';

export interface CurrencyRates {
    [key: string]: number;
}

export async function fetchRates(baseCurrency: string): Promise<CurrencyRates> {
    try {
        const response = await axios.get('https://status.neuralgeneration.com/api/currency');
        return response.data;
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        throw error;
    }
}