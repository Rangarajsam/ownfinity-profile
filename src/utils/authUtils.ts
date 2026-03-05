
export const getAuthToken = (state: any) => {
    const authToken = JSON.parse(localStorage.getItem('user')).token;
    return authToken;
}