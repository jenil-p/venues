import apiClient from "./client";

export const adminService = {
    createRole(roleName){
        return apiClient.post('/admin/roles' , { rolename: roleName });
    },

    getAllRoles(){
        return apiClient.get('/admin/roles');
    },

    deleteRole(roleId){
        return apiClient.delete(`/admin/roles/${roleId}`);
    },

    assignRole(userId, roleId){
        return apiClient.post(`/admin/users/${userId}/roles/${roleId}`);
    },

    deAssignRole(userId, roleId){
        return apiClient.delete(`/admin/users/${userId}/roles/${roleId}`);
    },

    //provider ...
    approveProvider(providerId){
        return apiClient.patch(`/admin/providers/${providerId}/approval`);
    },

    rejectProvider(providerId){
        console.log("going to ...")
        return apiClient.delete(`/admin/providers/${providerId}/approval`);
    },

    getAllPrviders(){
        return apiClient.get('/admin/providers');
    },

    getProvider(providerId){
        return apiClient.get(`/admin/providers/${providerId}`);
    },

    deleteProvider(providerId){
        return apiClient.delete(`/admin/providers/${providerId}`);
    },

    // venue ...
    approveVenue(venueId){
        return apiClient.patch(`admin/venues/${venueId}/approval`);
    },

    rejectVenue(venueId){
        return apiClient.delete(`admin/venues/${venueId}/approval`);
    },

    getAllVenues(){
        return apiClient.get('/admin/venues');
    },

    getVenue(venueId){
        return apiClient.get(`/admin/venues/${venueId}`);
    },

    deleteVenue(venueId){
        return apiClient.delete(`/admin/venues/${venueId}`);
    },


    // service ...
    approveService(serviceId){
        return apiClient.patch(`admin/services/${serviceId}/approval`);
    },

    rejectService(serviceId){
        return apiClient.delete(`admin/services/${serviceId}/approval`);
    },

    getAllService(){
        return apiClient.get('/admin/services');
    },

    getService(serviceId){
        return apiClient.get(`/admin/services/${serviceId}`);
    },

    deleteService(serviceId){
        return apiClient.delete(`/admin/services/${serviceId}`);
    },
}