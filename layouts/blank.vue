<template>
  <el-container class="blank-page">
    <el-header style="height: 40px;padding:0" />
    <el-main class="flex-center">
      <nuxt />
    </el-main>
    <el-footer>
      <Footer />
    </el-footer>
  </el-container>
</template>
<script>
import Footer from "@/components/public/footer/index.vue";
export default {
  components: { Footer }
};
</script>
<style lang="scss" scoped>
.blank-page {
  width: 100vw;
  height: 100vh;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
