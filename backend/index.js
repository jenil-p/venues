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

import listvenueRoutes from './routes/venueRoutes/listVenue.route.js';
import updatevenueRoutes from './routes/venueRoutes/venue.route.js';

import listserviceRoutes from './routes/serviceRoutes/listService.route.js';

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

// temp
import tempRoutes from './routes/dlogin.route.js';
app.use('/d/login', tempRoutes);

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));