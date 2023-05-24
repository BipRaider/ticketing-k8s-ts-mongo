import CoursesIcon from './icons/courses.svg';
import ServicesIcon from './icons/services.svg';
import BooksIcon from './icons/books.svg';
import ProductsIcon from './icons/products.svg';

import { FirstLevelMenu } from '../interfaces/page.interface';

interface firstLevelMenu {
  /*** Href of the page to link to the site. */
  href: string;
  /*** Page name. */
  label: string;
  /*** Icon to link. */
  icon?: JSX.Element;
  /*** The page name to searching. */
  id: FirstLevelMenu;
  /*** Need authorized or not to page. */
  auth: boolean;
  /*** Public page or not .*/
  public: boolean;
  /*** Private page or not .*/
  private: boolean;
}

export const firstLevelMenu: firstLevelMenu[] = [
  {
    href: '/',
    label: 'home',
    icon: <ProductsIcon />,
    id: FirstLevelMenu.Home,
    auth: true,
    public: true,
    private: false,
  },
  {
    href: '/auth/signin',
    label: 'sign in',
    icon: <CoursesIcon />,
    id: FirstLevelMenu.SignIn,
    auth: false,
    public: true,
    private: false,
  },
  {
    href: '/auth/signup',
    label: 'sign up',
    icon: <ServicesIcon />,
    id: FirstLevelMenu.SignUp,
    auth: false,
    public: true,
    private: false,
  },
  {
    href: '/auth/signout',
    label: 'sign out',
    icon: <BooksIcon />,
    id: FirstLevelMenu.SignOut,
    auth: true,
    public: false,
    private: true,
  },
  {
    href: '/auth/currentuser',
    label: 'user',
    icon: <ProductsIcon />,
    id: FirstLevelMenu.CurrentUser,
    auth: true,
    public: false,
    private: true,
  },
  {
    href: '/ticket/create',
    label: 'add ticket',
    icon: <ProductsIcon />,
    id: FirstLevelMenu.AddTicket,
    auth: true,
    public: false,
    private: true,
  },
];
