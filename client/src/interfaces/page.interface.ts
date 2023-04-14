export enum FirstLevelMenu {
  SignIn,
  SignUp,
  SignOut,
  CurrentUser,
}

export interface TopPageAdvantage {
  _id: string;
  title: string;
  description: string;
}

export interface TopPageModel {
  tags: string[];
  _id: string;
  secondCategory: string;
  alias: string;
  title: string;
  category: string;
  tagsTitle: string;
  metaTitle: string;
  metaDescription: string;
  firstCategory: FirstLevelMenu;
  advantages?: TopPageAdvantage[];
  createdAt: Date;
  updatedAt: Date;
}
