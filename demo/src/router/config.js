export default [
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/Home/Home'),
  },
  {
    path: '*',
    name: '404',
    component: () => import('../components/404'),
  },
];
