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

import listvenueRoutes from './routes/venueRoutes/listVenue.route.js';
import updatevenueRoutes from './routes/venueRoutes/venue.route.js';

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

// general
app.use('/auth' , authRoutes);
app.use('/admin/role' , roleRoutes);

// admin functionalities
app.use('/admin/userrole' , assignRoutes);

// RBAC (admin)
app.use('/admin/table' , apptableRoutes);
app.use('/admin/operation', operationRoutes);
app.use('/admin/permission' , permissionRoutes);

app.use('/provider' , providerRoutes);

app.use('/provider/venue', listvenueRoutes); // first time listing 
app.use('/provider/venue', updatevenueRoutes); // updating its details ...

app.use('/admin/provider' , adminProviderRoutes);

app.use('/admin/venue', adminvenueRoutes);

// temp
import tempRoutes from './routes/dlogin.route.js';
app.use('/d/login', tempRoutes);

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));