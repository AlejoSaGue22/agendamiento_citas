export interface ServicioResponse {
    count:    number;
    pages:    number;
    servicios: ServicioInterface[];
}

export interface ServicioInterface {
    id: string;
    name: string;
    duration_minutes: string;
    price: string;
    created_by: string;
    description: string;
    status: boolean;
      
}