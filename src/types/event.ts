export interface EventItem {
    _id?: string;    // MongoDB
    id?: string;     // fallback if some APIs return `id`

    title: string;
    description: string;
    date: string;
    location: string;
    latitude: number;
    longitude: number;

    // optional fallbacks from API
    name?: string;
    details?: string;
}

export interface NewEventInput {
    title: string;
    description: string;
    date: string;
    location: string;
    latitude: string;   // from your initial state
    longitude: string;  // from your initial state
  }
  