/**
 * @description Interface representing the response structure for retrieving user information.
 * This interface defines the properties that will be included in the response
 * when fetching user data, such as the user's unique identifier, full name, and email address.
 */
export interface IGetUserResponse {
    id: string;
    fullName: string;
    email: string;
}
