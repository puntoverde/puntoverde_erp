import Vue from 'vue';
import Vuetify,{VSnackbar,VIcon} from 'vuetify/lib';


Vue.use(Vuetify,{components:{VSnackbar,VIcon}});

export default new Vuetify({  
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#14bf98',//'#2ca75e',//'#2ca75e',
        secondary: '#113448',//'#000000',
        accent: '#757575',//'#92949c',//'#757575',
        error: '#eb445a',//'#575761',//'#eb445a',//'#FF5252',
        info: '#2777A5',//'#3880ff',//'#2196F3',
        success: '#18DCAF',//'#2dd36f',//'#4CAF50',
        warning: '#E09200',//'#ffc409',//'#FFC107',  
        btnsucces:'#11c096',
        btnerror:'#ed425c',
        btnexp:'#1c65c4'
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
