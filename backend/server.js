import express from "express"
import authRoutes from "./routes/auth.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDb } from "./config/db.js";
import movieRoutes from "./routes/movies.route.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRoute.js";
import searchRoutes from "./routes/search.route.js";
import userRoutes from "./routes/user.route.js"
import path from "path";
const app = express();
const __dirname = path.resolve()
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/movies", protectRoute, movieRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/user", protectRoute, userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/health",(req,res)=>{res.send("OK")})

if(ENV_VARS.MODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })

}
app.listen(5000, () => {
    connectDb();
    console.log("Server started..", ENV_VARS.PORT);
})