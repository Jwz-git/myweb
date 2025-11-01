import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from "vue"
import App from "./App.vue"
import router from "./modules/router.js"
import { gsap } from 'gsap'
import 'animate.css'

import { L2Dwidget } from 'live2d-widget'

const app = createApp(App)

app.use(router)

//右下角小人
// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 如果目标页面是total页面，隐藏Live2D
  if (to.name === '起始页') {
    // 如果Live2D已经初始化，则隐藏
    if (window.L2Dwidget) {
      window.L2Dwidget.hide();
    }
  } else {
    // 如果不是total页面且Live2D未初始化，则初始化
    if (!window.L2Dwidget) {
      L2Dwidget.init({
        "model": {
          jsonPath: "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
          "scale": 1
        },
        "display": {
          "position": "right",
          "width": 150,
          "height": 300,
          "hOffset": 0,
          "vOffset": -20,
        },
        "mobile": {
          "show": true,
          "scale": 0.5
        },
        "react": {
          "opacityDefault": 0.7,
          "opacityOnHover": 0.2
        }
      });
    } else {
      // 如果已经初始化，则显示
      window.L2Dwidget.show();
    }
  }
  next();
});

app.mount('#app')