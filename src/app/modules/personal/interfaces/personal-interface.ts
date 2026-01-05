export interface PersonalResponse {
    count:    number;
    pages:    number;
    users: PersonalInterface[];
}

export interface PersonalInterface {
    id: string;
    full_name: string;
    name_user: string;
    last_name: string;
    password?: string;
    number_document: string;
    type_document: string;
    phone: string;
    role_id: number;
    role_name: string;
    is_active: boolean;
    email: string;
    created_at: string;
    availability?: BdDayDisponiblidad[];
    services?: ServicePersonal[];
}

export interface BdDayDisponiblidad {
    id?: string;
    day_of_week: string; 
    start_time: string; // '09:00'
    end_time: string;   // '17:00'
}

export interface ServicePersonal {
  id: number;
  name: string;
  duration: number; // en minutos
  price: number;
  selected: boolean;

}

