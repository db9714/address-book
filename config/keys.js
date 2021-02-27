if (process.env.NODE_ENV === "production") {
  module.exports = {
    MONGOURI: process.env.MOGOURI,
    JWT_SECRET: process.env.JWT_SECRET,
    SENDGRID_API: process.env.SENDGRID_API,
    EMAIL: process.env.EMAIL,
  };
} else {
  module.exports = {
    JWT_SECRET: "WEFEWF",
    MONGOURI: "mongodb+srv://deepakb:deepak-123@cluster0.oafna.mongodb.net/address-book?retryWrites=true&w=majority",
    // SENDGRID_API: process.env.SENDGRID_API,
    EMAIL: "http://localhost:3000",
  };
}
