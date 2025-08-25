const mongoose=require('mongoose')
 require("dotenv").config()
 exports.connect=()=>{
  mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTION SUCCESS"))
		// If there are issues connecting to the database, log an error message and exit the process
		.catch((err) => {
			console.log(`DB CONNECTION ISSUES`);
			console.log("MONGO ENV VALUE:", process.env.MONGODB_URL);
			console.error(err.message);
			process.exit(1);
		});
 }