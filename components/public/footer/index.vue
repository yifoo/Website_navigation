<template>
  <p :class="style['foot-text']">©2018 靖风行</p>
</template>
<script>
import footer from './footer.scss?module'
export default {
  name: "Footer",
  computed:{
    style(){
      return footer
    }
  }
};
</script>
