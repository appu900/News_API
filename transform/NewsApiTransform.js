import { getImageUrl } from "../utils/helper.js";

class NewsApitransform{
    static tranform(news){
        return{
            id:news.id,
            heading:news.title,
            description:news.content,
            image:getImageUrl(news.image),
            createdAt:news.created_at,
            updatedAt:news.updated_at,
            reporter:{
                id:news?.user.id,
                name:news?.user.name,
                profile:news?.user.profile != null ? getImageUrl(news?.user.profile) : null
            }
        }
    }
}


export default NewsApitransform;