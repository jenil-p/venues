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

import venuehostRoutes from './routes/venueRoutes/hostmaster.route.js';
import serviceproviderRoutes from './routes/serviceRoutes/serviceProvider.route.js';

import adminhostRoutes from './routes/adminRoutes/adminHost.route.js';
import adminServicePRoutes from './routes/adminRoutes/adminServicep.route.js';

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

app.use('/host' , venuehostRoutes);
app.use('/service-p' , serviceproviderRoutes);

app.use('/admin/host' , adminhostRoutes);
app.use('/admin/service-p' , adminServicePRoutes);

// temp
import tempRoutes from './routes/dlogin.route.js';
app.use('/d/login', tempRoutes);

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));