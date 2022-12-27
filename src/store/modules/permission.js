import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'


// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],  //完整路由表
      addRoutes: [],//用户可访问路由表
      defaultRoutes: [],
      // topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      // setTopbarRoutes(routes) {
      //   this.topbarRouters = routes
      // },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes(roles) {
        return new Promise(resolve => {
          // 向后端请求路由数据
          getRouters().then(res => {
            console.log("🚀 ~ file: permission.js:39 ~ getRouters ~ res", res.data)
            const sdata = JSON.parse(JSON.stringify(res.data))
            // console.log("🚀 ~ file: permission.js:41 ~ getRouters ~ sdata", sdata)
            const rdata = JSON.parse(JSON.stringify(res.data))
            // console.log("🚀 ~ file: permission.js:43 ~ getRouters ~ rdata", rdata)
            const defaultData = JSON.parse(JSON.stringify(res.data))
            // console.log("🚀 ~ file: permission.js:45 ~ getRouters ~ defaultData", defaultData)
            const sidebarRoutes = filterAsyncRouter(sdata)
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            // console.log("🚀 ~ file: permission.js:48 ~ getRouters ~ rewriteRoutes", rewriteRoutes)/
            // 后台传过来的动态路由
            const defaultRoutes = filterAsyncRouter(defaultData)
            console.log("🚀 ~ file: permission.js:48 ~ getRouters ~ defaultRoutes", defaultRoutes)
            // router文件下的动态路由
            const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
            console.log("🚀 ~ file: permission.js:49 ~ getRouters ~ asyncRoutes", asyncRoutes)
            asyncRoutes.forEach(route => { router.addRoute(route) })
            this.setRoutes(rewriteRoutes)
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
            this.setDefaultRoutes(sidebarRoutes)
            // this.setTopbarRoutes(defaultRoutes)
            resolve(rewriteRoutes)
          })
        })
      }
    }
  })

// 遍历后台传来的路由字符串，转换为组件对象   
/**
 * 筛选动态路由
 *
 * @param routers 动态路由配置
 * @param permissions 权限实体数组
 * @returns 筛选后的路由配置数组
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {

  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default usePermissionStore
