import { SignUpCredentials, User } from "@costwise/shared/auth";


export interface AUTHService {
    findUserByEmail(email: string): Promise<User | undefined> 
    create(credentials: SignUpCredentials): Promise<string | undefined>
    createGoogleUser(user: User): Promise<string | undefined> 
    updateUserImage(userId: string, image: string, name?: string | null): Promise<void>
}

export interface AUTHrepository {
    findUserByEmail(email: string): Promise<User | undefined>
    create(email: string, password: string): Promise<string | undefined> 
    createGoogleUser(user: User): Promise<string | undefined> 
    updateUserImage(userId: string, image: string, name?: string | null): Promise<void>
}
