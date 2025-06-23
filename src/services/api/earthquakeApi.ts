import type { Earthquake, Filters } from '@/types/types';
import axios from 'axios'

const USGS_API_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// API client with interceptors
const apiClient = axios.create({
    timeout: 1000,
})

interface USGSResponse {
    type: 'FeatureCollection';
    features: Earthquake[];
    bbox?: number[];
    metadata: {
        generated: number; // Unix timestamp
        url: string;
        title: string;
        status: number;
        api: string;
        count: number;
    };
}

// ? add once we have a .env
// Add response interceptor for logging
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', error);
        }
        return Promise.reject(error);
    }
);

// Filter Logic



const applyFilters = (earthquakes: Earthquake[], filters: Filters): Earthquake[] => {
    return earthquakes.filter(eq => {
        //...filtering logic
    })
}

// API Logic

// ES6 method shorthand syntax
export const earthquakeApi = {
    async getEarthquakes(filters?: Filters): Promise<Earthquake[]> {
        const endpoint = getEndpointByFilters(filters);
        const { data } = await apiClient.get<USGSResponse>(endpoint);

        return filters ? applyFilters(data.features, filters) : data.features;
    },

    getEndpointByFilters(filters?: Filters): string {
        if (!filters?.startTime) {
            return `${USGS_API_BASE}/all_day.geojson`;

        }
        const hoursDiff = (Date.now() - filters.startTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff <= 1) return `${USGS_API_BASE}/all_hour.geojson`;
        if (hoursDiff <= 24) return `${USGS_API_BASE}/all_day.geojson`;
        if (hoursDiff <= 168) return `${USGS_API_BASE}/all_week.geojson`;
        return `${USGS_API_BASE}/all_month.geojson`;
    },

    applyFilters(earthquakes: Earthquake[], filters: Filters): Earthquake[] {
        return earthquakes.filter(eq => {
            const mag = eq.properties.mag;
            const time = eq.properties.time;

            // Magnitude filter
            if (mag < filters.minMagnitude || mag > filters.maxMagnitude) {
                return false;
            }

            // Time filter
            if (filters.startTime && time < filters.startTime.getTime()) {
                return false;
            }
            if (filters.endTime && time > filters.endTime.getTime()) {
                return false;
            }

            // Location filter (simple string match)
            if (filters.location) {
                const place = eq.properties.place.toLowerCase();
                const search = filters.location.toLowerCase();
                return place.includes(search);
            }

            return true;
        });
    },


    async getEarthquakeDetail(id: string): Promise<Earthquake> {
        const earthquakes = await earthquakeApi.getEarthquakes();
        const earthquake = earthquakes.find(eq => eq.id === id);
        if (!earthquake) {
            throw new Error('Earthquake not found');
        }
        return earthquake;
    }
}