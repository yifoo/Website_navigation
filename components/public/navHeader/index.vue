<template>
  <div class="nav-header">
    <el-row>
      <el-col>
        <el-row
          :gutter="0"
          class="top-header"
        >
          <el-col :span="4">
            <nuxt-link to="/">首页</nuxt-link>
            <!-- <nuxt-link to="/idea">创意</nuxt-link> -->
          </el-col>
          <el-col :span="20">
            <user />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import User from "./user";
export default {
  name: "NavHeader",
  components: { User }
};
</script>
<style lang="scss" scoped>
.top-header {
  padding: 0 1rem;
  height: 2rem;
  width: 100%;
  line-height: 2rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  position: fixed;
  z-index: 100;
  font-size: .7rem;
}
</style>
