import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import dev_routes from './dev_routes';

Vue.use(VueRouter);
let targetRoutes = [];
const totlRoutes = process.env.NODE_ENV === 'development'? [...dev_routes, ...routes] : routes;

for(const idx in totlRoutes) {
  const currentRoute = totlRoutes[idx];
  if(currentRoute.type === 'category' && currentRoute.subRoutes) {
    targetRoutes.push(...currentRoute.subRoutes);
  } else {
    targetRoutes.push(currentRoute);
  }
}
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: targetRoutes
});

export default router;
