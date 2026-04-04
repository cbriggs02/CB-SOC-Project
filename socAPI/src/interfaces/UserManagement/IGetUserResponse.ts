/**
 * Interface representing the response structure for retrieving user information. 
 * This interface defines the properties that will be included in the response 
 * when fetching user data, such as the user's unique identifier, full name, and email address.
 */
export interface IGetUserResponse {

    /**
     * The unique identifier for the user, represented as a string (UUID)
     */
    id: string;
    /**
     * The user's full name, which is a combination of the first name and last name
     */
    fullName: string;

    /**
     * The user's email address
     */
    email: string;
}