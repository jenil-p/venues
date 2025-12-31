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
app.use('/table' , apptableRoutes);
app.use('/operation', operationRoutes);
app.use('/permission' , permissionRoutes);

app.get('/', (req, res) => {
    res.send('this is a venue finding and booking application...');
});

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));