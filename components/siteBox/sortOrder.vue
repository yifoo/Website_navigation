<template>
  <draggable
    v-model="dragSortList"
    :disabled="!editState||type=='mobile'"
    tag="ul"
    @start="drag=true"
    @end="drag=false"
    @update="updateSortIndex(dragSortList)"
  >
    <li
      v-for="(item,key) in dragSortList"
      :key="key"
      class="drag"
    >{{ item.sortName }}</li>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import { mapState } from "vuex";
export default {
  name: "SortOrder",
  components: { draggable },
  data() {
    return {
      list: [],
      sortList: []
    };
  },
  computed: {
    ...mapState("sites", {
      editState: "editState",
      isUpdateAll: "isUpdateAll"
    }),
    type() {
      return this.$store.state.type;
    },
    dragSortList: {
      get() {
        var list = [];
        this.sortList.forEach(item => {
          list.push({
            sortId: item.sortId,
            sortName: item.sortName
          });
        });
        return this.list.length > 0 ? this.list : list;
      },
      set(val) {
        this.list = val;
      }
    }
  },
  watch:{
    isUpdateAll(val){
      if(val){  // 如果全局更新就重新获取分类
        this.getSort()
      }
    }
  },
  beforeMount() {
    this.getSort();
  },
  methods: {
    /**
     * @name 获取一级分类
     */
    async getSort() {
      if (this.subSortList && this.subSortList.length > 0) {
        return false;
      } else {
        let { status, data } = await this.$axios.get("/sort/get");
        if (status === 200 && data.code === "01") {
          this.sortList = data.respData.sortList;
        }
      }
    },
    /**
     * @name  更新一级分类排序
     */
    async updateSortIndex(sortList) {
      var { status, data } = await this.$axios.post("/sort/order", {
        sortList
      });
      if (status == 200 && data.code === "01") {
        this.$message({
          type: "success",
          message: data.msg
        });
        this.$store.commit("sites/setIsUpdateAll", true);
      } else {
        this.$message({
          type: "error",
          message: data.msg
        });
      }
    }
  }
};
</script>
