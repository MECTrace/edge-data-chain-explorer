import Cards from '../views/_dev/Cards';
import Buttons from '../views/_dev/Buttons.vue';
import Tables from '../views/_dev/Tables.vue';
import Charts from '../views/_dev/Charts.vue';
import Progresses from '../views/_dev/Progresses.vue';
import InfiniteScrollTables from '../views/_dev/InfiniteScrollTables.vue';
import CommonAlert from '../views/_dev/CommonAlert.vue';

const routes = [
  {
    type: "category",
    name: 'Development',
    icon: 'settings_system_daydream',
    subRoutes: [
      {
        path: '/cards',
        type: "menu",
        name: 'Cards',
        icon: 'settings_system_daydream',
        component: Cards
      },
      {
        path: '/buttons',
        type: "menu",
        name: 'Buttons',
        icon: 'format_bold',
        component: Buttons
      },
      {
        path: '/tables',
        type: "menu",
        name: 'Tables',
        icon: 'border_all',
        component: Tables
      },
      {
        path: '/scroll_tables',
        type: "menu",
        name: 'Scroll_Tables',
        icon: 'border_all',
        component: InfiniteScrollTables
      },
      {
        path: '/progresses',
        type: "menu",
        name: 'Progresses',
        icon: 'rotate_right',
        component: Progresses
      },
      {
        path: '/charts',
        type: "menu",
        name: 'Charts',
        icon: 'insert_chart_outlined',
        component: Charts
      },
      {
        path: '/alerts',
        type: "menu",
        name: 'Alert',
        icon: 'info',
        component: CommonAlert
      },
    ]
  },
];
export default routes;
