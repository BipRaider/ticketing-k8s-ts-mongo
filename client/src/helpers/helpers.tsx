import CoursesIcon from './icons/courses.svg';
import ServicesIcon from './icons/services.svg';
import BooksIcon from './icons/books.svg';
import ProductsIcon from './icons/products.svg';
import { FirstLevelMenu } from '../interfaces/page.interface';
import { FirstLevelMenuItem } from '../interfaces/menu.interface';

export const firstLevelMenu: FirstLevelMenuItem[] = [
  { route: 'auth/signin', name: 'sign in', icon: <CoursesIcon />, id: FirstLevelMenu.SignIn },
  { route: 'auth/signup', name: 'sign up', icon: <ServicesIcon />, id: FirstLevelMenu.SignUp },
  { route: 'auth/signout', name: 'sign out', icon: <BooksIcon />, id: FirstLevelMenu.SignOut },
  { route: 'auth/currentuser', name: 'user', icon: <ProductsIcon />, id: FirstLevelMenu.CurrentUser },
];
