import watchModel from "../models/watch.model.js";
import responseHandler from "../handlers/response.handler.js";

const add = async (req, res) => {
  try {
    const exists = await watchModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (!exists) {
      const history = new watchModel({
        user: req.user.id,
        mediaId: req.body.mediaId,
        mediaType: req.body.mediaType
      });

      await history.save();
    }

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await watchModel.find({ user: req.user.id }).sort("-createdAt");
    responseHandler.ok(res, history);
  } catch {
    responseHandler.error(res);
  }
};

export default { add, getHistory };
