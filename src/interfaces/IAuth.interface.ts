export interface IAuth {
    jwtSecret: string,
    jwtExpiresIn: string,
    refreshTokenSecret: string,
    refreshTokenExpiresIn: string
}
export interface ICredentials {
    login: string,
    password: string
}