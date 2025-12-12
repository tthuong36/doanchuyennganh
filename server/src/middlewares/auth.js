import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

// =============== VERIFY TOKEN ==================
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return responseHandler.unauthorize(res, "No authorization header");

    const token = authHeader.split(" ")[1];

    if (!token)
      return responseHandler.unauthorize(res, "No token provided");

    const decoded = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

    // decoded = { id, role, iat, exp }
    req.user = decoded;

    next();
  } catch (err) {
    return responseHandler.unauthorize(res, "Invalid or expired token");
  }
};



// =============== OPTIONAL: CHECK IF USER IS LOGGED ==================
export const verifyUser = (req, res, next) => {
  try {
    if (!req.user) return responseHandler.unauthorize(res);
    next();
  } catch (err) {
    return responseHandler.error(res);
  }
};
