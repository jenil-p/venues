import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";
dotenv.config();

// auth
import authRoutes from './modules/auth/auth.route.js';

// rbac
import adminRoleRoutes from './modules/rbac/role.route.js';
import adminAssignRoutes from './modules/rbac/userrole.route.js';
import apptableRoutes from './modules/rbac/apptable.routes.js';
import permissionRoutes from './modules/rbac/permission.routes.js';
import operationRoutes from './modules/rbac/operation.routes.js';

// reference-data
import addressRoutes from './modules/reference-data/address.route.js'
import getResourceRoutes from './modules/reference-data/resource.route.js'

// provider
import adminProviderRoutes from './modules/provider/adminProvider.route.js';
import providerRoutes from './modules/provider/provider.route.js';

// Venue
import adminvenueRoutes from './modules/venue/admin/adminVenue.route.js';
import manageVenuesRoutes from './modules/venue/provider/venue.route.js';
import uservenueRoutes from './modules/venue/public/venue.routes.js';
import wishlistRoutes from './modules/venue/public/wishlist.route.js';

// Offerings - (services)
import adminserviceRoutes from './modules/offerings/admin/adminService.route.js';
import listserviceRoutes from './modules/offerings/provider/listService.route.js';


// booking
import availabilityRouter from './modules/booking/availability/availability.route.js'
import bookingRutes from './modules/booking/booking.route.js'
import providerBookingRoutes from './modules/booking/host/bookings.route.js'

// payment
import paymentRoutes from './modules/payment/payment.route.js';


const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));
app.use(
    cors({
        origin: process.env.DEVELOPMENT_FRONTEND_URL,
        credentials: true,
    })
);


// auth
app.use('/api/v1/auth' , authRoutes);


// RBAC
app.use('/api/v1/admin/tables' , apptableRoutes);
app.use('/api/v1/admin/operations', operationRoutes);
app.use('/api/v1/admin/roles' , permissionRoutes);
app.use('/api/v1/admin/roles' , adminRoleRoutes);
app.use('/api/v1/admin/users' , adminAssignRoutes);


// reference-data
app.use('/api/v1/address' , addressRoutes);
app.use('/api/v1/resources' , getResourceRoutes);


// provider
app.use('/api/v1/providers-profile/' , providerRoutes);
app.use('/api/v1/admin/providers' , adminProviderRoutes);


// Venue
app.use('/api/v1/providers/venues', manageVenuesRoutes); // updating its details ...
app.use('/api/v1/admin/venues', adminvenueRoutes);
app.use('/api/v1/venues', uservenueRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);


// offerings - service
app.use('/api/v1/providers/services', listserviceRoutes); // first time listing 


// admin functionalities
app.use('/api/v1/admin/services', adminserviceRoutes);


//booking
app.use('/api/v1/venues', availabilityRouter);
app.use('/api/v1/book' , bookingRutes);
app.use('/api/v1/providers/bookings', providerBookingRoutes);

// payment
app.use('/api/v1/payment', paymentRoutes);


import dummyLogin from './routes/dlogin.route.js'
app.use('/' , dummyLogin);

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));