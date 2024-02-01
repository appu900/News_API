import prisma from "../DB/db.config.js";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";

class ProfileController {
  static async index(request, response) {
    try {
      const user = request.user;
      return response.status(200).json({
        status: "success",
        message: "User profile",
        data: user,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  static async store(request, response) {}

  static async show(request, response) {}

  static async update(request, response) {
    try {
      const { id } = request.params;
      const authUser = request.user;

      if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }

      // * validate image extension

      const profile = request.files.profile;

      const message = imageValidator(profile?.size, profile.mimetype);
      console.log(message);
      if (message !== undefined) {
        return response.status(400).json({
          status: "error",
          message: message,
        });
      }

      const imgExt = profile?.name.split(".");
      console.log("checck image exist or not : ", imgExt);
      const imageName = generateRandomNumber() + "." + imgExt[1];
      console.log(imageName);

      // uoload image to system storage

      const uploadPath = process.cwd() + "/public/images/" + imageName;
      profile.mv(uploadPath, (error) => {
        if (error) throw error;
      });

      await prisma.users.update({
        data: {
          profile: imageName,
        },
        where: {
          id: Number(id),
        },
      });

      // * return response to browser
      return response.status(200).json({
        status: "success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  static async destroy(request, response) {}
}

export default ProfileController;
