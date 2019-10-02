<template>
  <el-container :class="style.container">
    <el-header :class="style.header">
      <nav-header />
    </el-header>
    <el-main :class="style.main">
      <nuxt />
    </el-main>
    <el-footer :class="style.footer">
      <Footer />
    </el-footer>
  </el-container>
</template>
<script>
import NavHeader from "@/components/public/navHeader/index.vue";
import Footer from "@/components/public/footer/index.vue";
import style from "./style.scss?module";
export default {
  components: { NavHeader, Footer },
  computed: {
    style() {
      return style;
    }
  }
};
</script>

