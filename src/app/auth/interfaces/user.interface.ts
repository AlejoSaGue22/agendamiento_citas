export interface User {
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string;
}

export interface Roles{
    id: number;
    name: string;
}

export interface TypeDocument{
    id: number;
    name: string;
    abbreviation: string;
    description: string;
}