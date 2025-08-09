export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

export interface Message {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
}