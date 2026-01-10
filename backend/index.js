import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";
dotenv.config();

//importing routes ...
import authRoutes from './routes/auth.route.js';
import roleRoutes from './routes/adminRoutes/role.route.js';

import assignRoutes from './routes/adminRoutes/userrole.route.js';

import apptableRoutes from './routes/rbacRoutes/apptable.routes.js';
import permissionRoutes from './routes/rbacRoutes/permission.routes.js';
import operationRoutes from './routes/rbacRoutes/operation.routes.js';

import providerRoutes from './routes/providerRoutes/provider.route.js';

import adminProviderRoutes from './routes/adminRoutes/adminProvider.route.js';
import adminvenueRoutes from './routes/adminRoutes/adminVenue.route.js';
import adminserviceRoutes from './routes/adminRoutes/adminService.route.js';

import listvenueRoutes from './routes/providerRoutes/venueRoutes/listVenue.route.js';
import updatevenueRoutes from './routes/providerRoutes/venueRoutes/venue.route.js';

import listserviceRoutes from './routes/providerRoutes/serviceRoutes/listService.route.js';

import uservenueRoutes from './routes/userRoutes/venue.routes.js'

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

// general
app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/roles' , roleRoutes);

// admin functionalities
app.use('/api/v1/users' , assignRoutes);

// RBAC (admin)
app.use('/api/v1/admin/tables' , apptableRoutes);
app.use('/api/v1/admin/operations', operationRoutes);
app.use('/api/v1/admin/roles' , permissionRoutes);

app.use('/api/v1/providers' , providerRoutes);

app.use('/api/v1/providers/venues', listvenueRoutes); // first time listing 
app.use('/api/v1/providers/venues', updatevenueRoutes); // updating its details ...

app.use('/api/v1/providers/services', listserviceRoutes); // first time listing 

app.use('/api/v1/admin/providers' , adminProviderRoutes);
app.use('/api/v1/admin/venues', adminvenueRoutes);
app.use('/api/v1/admin/services', adminserviceRoutes);

app.use('/api/v1/venues', uservenueRoutes);

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));