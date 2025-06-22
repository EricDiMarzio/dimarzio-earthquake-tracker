
// User and Auth types
export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
    name: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Earthquake types (based on USGS API)
export interface Earthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number; // Unix timestamp
    updated: number;
    url: string;
    detail: string;
    type: string;
    title: string;
    status: 'automatic' | 'reviewed';
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

// Admin action types for local mutations
export interface AdminActions {
    id: string;
    earthquakeId: string;
    userId: string;
    action: 'verify' | 'flag' | 'note';
    timestamp: number;
    data?: {
        note?: string;
        flagReason?: string;
    }
}

// UI State types 
export interface Filters {
    minMagnitude: number;
    maxMagnitude: number;
    startTime: Date | null;
    endTime: Date | null;
    location?: string;
}

