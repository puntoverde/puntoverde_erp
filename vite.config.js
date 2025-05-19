import vue from '@vitejs/plugin-vue2'
import VitePluginVue2Suffix  from 'vite-plugin-vue2-suffix'
import Components from 'unplugin-vue-components/vite'
import {VuetifyResolver} from 'unplugin-vue-components/resolvers'
import path from 'path'

export default{
  base:'/PV2/',
  server:{
    port:9091
  },
  plugins:[vue(),VitePluginVue2Suffix (),Components({resolvers:[VuetifyResolver()]})],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  build:{
    rollupOptions:{
      input:{
        main:path.resolve(__dirname,'index.html'),
        login:path.resolve(__dirname,'login.html')
      }
    }
  }
}