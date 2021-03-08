
const routes = [
  {
    path: '/',
    component: () => import('pages/Index.vue'),
    children: [{
      path: '/',
      component: () => import('components/LandingForm.vue')
    },
    {
      name: 'ofertas',
      path: 'ofertas',
      component: () => import('components/Offers.vue')
    }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
