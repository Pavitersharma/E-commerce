const app = require("./src/app")
const {connectDB} = require("./src/config/db.config")
const PORT = process.env.PORT||5000

connectDB();

app.listen(PORT,()=>{

    console.log("Server is running " + PORT);
    
})
