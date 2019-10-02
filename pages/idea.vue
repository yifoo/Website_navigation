<template>
  <div class="idea">
    <div :class="style.nav">导航标签</div>
    <div :class="style.container">
      <div :class="style.lside">左边</div>
      <div :class="style.middle">
        <el-tabs
          v-model="activeName"
          :class="style.tab"
          @tab-click="tabClick"
        >
          <el-tab-pane
            label="用户管理"
            name="first"
          >用户管理</el-tab-pane>
          <el-tab-pane
            label="配置管理"
            name="second"
          >配置管理</el-tab-pane>
          <el-tab-pane
            label="角色管理"
            name="third"
          >角色管理</el-tab-pane>
          <el-tab-pane
            label="定时任务补偿"
            name="fourth"
          >定时任务补偿</el-tab-pane>
        </el-tabs>
        <div :class="style.view">视图模式</div>
      </div>
      <div :class="style.rside">邮编</div>
    </div>
  </div>
</template>
<script>
import style from "@/components/ideaBox/style.scss?module";
export default {
  name: "Idea",
  data() {
    return {
      activeName: "second"
    };
  },
  computed: {
    style() {
      return style;
    }
  },
  methods: {
    tabClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" scoped>
.idea {
  width: 100%;
  height: 100%;
}
</style>

