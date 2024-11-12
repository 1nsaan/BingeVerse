import express from "express"
import authRoutes from "./routes/auth.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDb } from "./config/db.js";
import movieRoutes from "./routes/movies.route.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRoute.js";
import searchRoutes from "./routes/search.route.js";
import userRoutes from "./routes/user.route.js"
const app = express();

app.use(express.json());
app.use(cookieParser());
//Todo: Add back the protect route middleware
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/auth", authRoutes);

console.log(ENV_VARS.MONGO_URI);

app.listen(5000, () => {
    connectDb();
    console.log("Server started..", ENV_VARS.PORT);
})