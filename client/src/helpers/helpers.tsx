import CoursesIcon from './icons/courses.svg';
import ServicesIcon from './icons/services.svg';
import BooksIcon from './icons/books.svg';
import ProductsIcon from './icons/products.svg';

import { FirstLevelMenu } from '../interfaces/page.interface';

export const firstLevelMenu = [
  { route: 'auth/signin', name: 'sign in', icon: <CoursesIcon />, id: FirstLevelMenu.SignIn, auth: false },
  { route: 'auth/signup', name: 'sign up', icon: <ServicesIcon />, id: FirstLevelMenu.SignUp, auth: false },
  { route: 'auth/signout', name: 'sign out', icon: <BooksIcon />, id: FirstLevelMenu.SignOut, auth: true },
  { route: 'auth/currentuser', name: 'user', icon: <ProductsIcon />, id: FirstLevelMenu.CurrentUser, auth: true },
];
