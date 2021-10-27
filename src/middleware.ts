import isAuth from "./middleware/isAuth";

export const middlewares = [
  {
    method: "post",
    route: "/posts",
    middleware: [isAuth],
  },
  {
    method: "put",
    route: "/posts/:postsId",
    middleware: [isAuth],
  },
  {
    method: "delete",
    route: "/posts/:postsId",
    middleware: [isAuth],
  },
];
