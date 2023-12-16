import Article from "../models/article.model";
import Category from "../models/category.model";

export const articleResolvers = {
  Query: {
    getListArticle: async (_, args) => {
      const {sortKey, sortValue, currentPage, limitItems, filterKey, filterValue, keyword} = args;

      const find = {
        deleted: false
      };

      const sort = {};

      if(sortKey && sortValue){
        sort[sortKey] = sortValue;
      }

      const skip: number = (currentPage - 1) * limitItems;

      if(filterKey && filterValue){
        find[filterKey] = filterValue;
      }

      if(keyword){
        const keywordRegex = new RegExp(keyword, "i");
        find["title"] = keywordRegex;
      }

      const articles = await Article.find(find).sort(sort).limit(limitItems).skip(skip);
      return articles;
    },
    getArticle: async (_, args) => {
      const {id} = args;
      const article = await Article.findOne({
        _id: id,
        deleted: false
      });
      return article;
    }
  },
  Article: {
    category: async (article) => {
      const categoryId = article.categoryId;

      const category = await Category.findOne({
        _id: categoryId,
        deleted: false
      });

      return category;
    }
  },
  Mutation: {
    createArticle: async (_, args) => {
      const {article} = args;
      const record = new Article(article);
      await record.save();
      
      return record;
    },
    deleteArticle: async (_, args) => {
      const {id} = args;
      await Article.updateOne({
        _id: id 
      },{
        deleted: true,
        deletedAt: new Date()
      });

      return "Đã xóa";
    },
    updateArticle: async (_, args) => {
      const {id, article} = args;

      await Article.updateOne({
        _id: id,
        deleted: false
      }, article);

      const record = await Article.findOne({
        _id: id
      });

      return record;
    }
  }
};