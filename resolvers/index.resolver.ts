import { articleResolvers } from "./article.resolver";
import { categoryResolvers } from "./category.resolver";
import { userResolvers } from "./user.resolver";

export const resolvers = [
  articleResolvers,
  categoryResolvers,
  userResolvers
];