import Vue from "vue";
import VueLazyload from "vue-lazyload";

export default () => {
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    observer: true,
    error:"https://raw.githubusercontent.com/yifoo/img-cloud/master/img/blankico.jpg",
    loading: "https://raw.githubusercontent.com/yifoo/img-cloud/master/img/loadin.gif",
    attempt: 3,
    // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
    listenEvents: ["scroll"],
  });
};
