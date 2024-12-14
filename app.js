const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const connectDB = require("./db");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

dotenv.config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const imageRoutes = require("./routes/image");
const eventRoutes = require("./routes/event");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");
const dataRoutes = require("./routes/data");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const customerRoutes = require("./routes/customer");
const staffRoutes = require("./routes/staff");
const receiptRoutes = require("./routes/receipt");
const dashboardRoutes = require("./routes/dashboard");
const promotionRoutes = require("./routes/promotion");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoutes);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(imageRoutes);
app.use(eventRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);
app.use(dataRoutes);
app.use(cartRoutes);
app.use(wishlistRoutes);
app.use(customerRoutes);
app.use(staffRoutes);
app.use(receiptRoutes);
app.use(dashboardRoutes);
app.use(promotionRoutes);

app.use((err, req, res, next) => {
  const { statusCode, message, validationErrors } = err;
  res.status(statusCode || 500).json({ message, validationErrors });
});


// fake data when first load.
// **important: There should be an admin page to easily add data
// const { generateData, clearData } = require("./util/fakeData");
// generateData();
// clearData();
const port = process.env.PORT || 3001;
const url = process.env.SERVER_PREFIX;

connectDB()
  .then(() => {
    const server = app.listen(port);
    console.log(`Server is running at ${url}:${port}`);
    const io = require("./socket").init(server);

    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
