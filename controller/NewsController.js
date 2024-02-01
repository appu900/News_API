import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/Newsvalidation.js";
import { generateRandomNumber, imageValidator, removeImage, uploadImage } from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApitransform from "../transform/NewsApiTransform.js";

class NewsController {
  static async index(request, response) {
    try {
      const page = Number(request.query.page) || 1;
      const limit = Number(request.query.limit) || 2;
      if (page <= 0) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;

      const news = await prisma.news.findMany({
        take: limit,
        skip: skip,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });
      const responseData = news?.map((item) => NewsApitransform.tranform(item));
      const totalNews = await prisma.news.count();
      const totalPages = Math.ceil(totalNews / limit);

      return response.status(200).json({
        news: responseData,
        metaData: {
          totalNews: totalNews,
          totalPages: totalPages,
          currentPage: page,
          perPage: limit,
        },
      });
    } catch (error) {
      return response.status(500).json({ message: "something went wrong" });
    }
  }

  static async store(request, response) {
    try {
      const user = request.user;
      const body = request.body;

      //   * validate the client request body

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      // * check if image is exists or not

      if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).json({
          status: "error",
          message: "No file uploaded image filed is required",
        });
      }

      const image = request.files?.image;

      // * validate image extension and size

      const message = imageValidator(image?.size, image.mimetype);
      if (message !== undefined) {
        return response.status(400).json({
          status: "error",
          message: message,
        });
      }

      // * save images to system
      const imgExt = image?.name.split(".");
      const imageName = generateRandomNumber() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;

      image.mv(uploadPath, (error) => {
        if (error) throw error;
      });

      // * save news to database along with imageurl
      // * assign image url to payload

      payload.image = imageName;
      payload.user_id = user.id;

      const news = await prisma.news.create({
        data: payload,
      });

      return response
        .status(200)
        .json({ message: "News created successfully", data: news });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          error: error.messages,
        });
      } else {
        return response.status(500).json({ message: "someting went wrong" });
      }
    }
  }

  static async show(request, response) {
    try {
      const { id } = request.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });
      const responseData = news ? NewsApitransform.tranform(news) : null;
      return response.status(200).json({ news: responseData });
    } catch (error) {
      return response.status(500), json({ message: "something went wrong" });
    }
  }

  static async update(request, response) {
    try {
      const { id } = request.params;
      const user = request.user;
     

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id !== news.user_id) {
        return response.status(400).json({ message: "Unauthorized" });
      }
      
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(request.body);
      const image = request?.files?.image;
    
    
      if (image) {
        const message = imageValidator(image?.size, image.mimetype);

        // * check if image is valid or not

        if(message !== undefined){
          return response.status(400).json({message:message})
        }

       // *uplaod new image

       const imageName = uploadImage(image);
       payload.image = imageName;

        //  * Delete old image

        removeImage(news.image);



      }


      // ** updare the data 

      await prisma.news.update({
        data:payload,
        where:{
          id:Number(id),
        }
      })


      return response.status(200).json({message:"News updated successfully",data:payload});



    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          error: error.messages,
        });
      } else {
        return response.status(500).json({ message: "someting went wrong" });
      }
    }
  }

  static async destroy(request, response) {
    try {

      const {id} = request.params;
      const user = request.user;
      const news = await prisma.news.findUnique({
        where:{
          id:Number(id)
        }
      })
      if(user.id !== news.user_id){
        return response.status(401).json({message:"Unauthorized"})
      }

      // * delete image from system
      removeImage(news.image);
      // ** delete news from database
      await prisma.news.delete({
        where:{
          id:Number(id)
        }
      })

      return response.status(200).json({message:"News deleted successfully"})

      
    } catch (error) {
       return response.status(500).json({message:"something went wrong"});
    }
  }
}

export default NewsController;


