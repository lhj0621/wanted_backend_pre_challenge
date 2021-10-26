import isAuth from "./middleware/isAuth";

export const middlewares = [
  {
    method: "post",
    route: "/posts",
    middleware: [isAuth],
  },
];
