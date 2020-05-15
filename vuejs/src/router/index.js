import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import AddLock from '@/components/AddLock'
import AddLockStep2 from '@/components/AddLockStep2'
import AddLockStep3 from '@/components/AddLockStep3'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/add_lock',
      name: 'AddLock',
      component: AddLock
    },
 {
   path: '/add_lock_step2',
       name: 'AddLockStep2',
     component: AddLockStep2
 },
    {
      path: '/add_lock_step3',
      name: 'AddLockStep3',
      component: AddLockStep3
    }
  ]
})
