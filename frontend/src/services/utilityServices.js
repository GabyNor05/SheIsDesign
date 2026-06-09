import axios from 'axios';

const API_BASE_URL = 'http://localhost:5160/api/User'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => {
        return response.status === 204 ? null : response.data;
    },
    (error) => {
        // Catch error payloads from backend, fallback to generic message
        const errorText = error.response?.data || error.message;
        return Promise.reject(new Error(errorText || `Request failed with status ${error.response?.status}`));
    }
);

export const Status = {
    Pending: 0,
    Approved: 1,
    Rejected: 2
};

export const Role = {
    User: 0,
    Judge: 1,
    IndustryProfessional: 2,
    Student: 3,
    Admin: 4,
};

export const ChangeUserStatusService = {
    SetApproved: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Status.Approved}`),
    SetPending: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Status.Pending}`),
    SetRejected: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Status.Rejected}`),
};

export const ChangeUserRole = {
    SetUser: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Role.User}`),
    SetJudge: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Role.Judge}`),
    SetIndustryProfessional: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Role.IndustryProfessional}`),
    SetStudent: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Role.Student}`),
    SetAdmin: (id, status) => apiClient.put(`/${id}/ChangeUserStatus?userStatus=${Role.Admin}`),
};

export const UpdateProfilePicture = {
    /*needs this data structure

    {
        "profilePictureLink": "string"
    }

    */

    ChangeUserProfilePicture: (id, data) => apiClient.put(`/${id}/UpdateProfilePicture`, {...data}),
};
