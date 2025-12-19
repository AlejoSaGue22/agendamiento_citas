export interface ClienteResponse {
    count:    number;
    pages:    number;
    clients: ClienteInterface[];
}

export interface ClienteInterface {
    id: string;
    full_name: string;
    name_client: string;
    last_name: string;
    email: string;
    phone: string;
    notes: string;
    created_by: string;
    created_at: string;
}