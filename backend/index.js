import express from "express"
import cors from "cors"
import { connectDatabaseMongoDB } from './config/connectDB.js';


//importing routes ...
import authRoutes from './routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 8000;

connectDatabaseMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

app.use('/auth' , authRoutes);

app.get('/', (req, res) => {
    res.send('this is a venue finding and booking application...');
});

app.listen(PORT, () => console.log(`app listening at PORT:${PORT}`));