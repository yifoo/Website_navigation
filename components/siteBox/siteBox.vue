<template>
  <div class="site-box">
    <div :class="['sort', color]">
      <dl :class="['clearfix',color]">
        <dt>
          <i
            v-show="editState"
            class="iconfont icon-edit"
            @click="editSortBox"
          />
          <input
            ref="editSort"
            :class="['sort-input',{'show-sort-input':showSortEdit}]"
            v-model="newSortName"
            type="text"
            placeholder="四个字以内"
            @blur="hideAddSort"
          >
          <em v-show="!showSortEdit">{{ sortName }}</em>
          <i
            v-show="showSortEdit"
            class="iconfont icon-yes"
          />
          <i
            v-show="editState&&!showSortEdit"
            class="iconfont icon-del"
            @click="delSort"
          />
        </dt>
        <draggable
          v-model="dragSubList"
          :disabled="!editState||type=='mobile'"
          tag="div"
          @start="drag=true"
          @end="drag=false"
          @update="updateSubIndex(dragSubList)"
        >
          <dd
            v-for="(item,index) in subList"
            :key="index"
            :class="[{'is-active':showIndex===index},{'edit':editState}]"
            @click="swichIndex(index)"
          >
            <i
              v-show="editState"
              class="iconfont icon-edit"
              @click="showEditSubSortBox(item.subSortId,item.subTitle)"
            />
            {{ item.subTitle }}
            <i
              v-show="editState"
              class="iconfont icon-del"
              @click="delSubSort(item.subSortId,item.subTitle,item.siteList)"
            />
          </dd>
        </draggable>
        <input
          ref="editSubSort"
          :class="['sort-input',{'show-sort-input':showEdit}]"
          v-model="newSubTitle"
          type="text"
          placeholder="四个字以内"
          @blur="hideAddSubSort"
        >
        <dd
          v-show="editState"
          class="add-sort"
          @click="addSort"
        >
          <i
            :class="!showEdit?'icon-add':'icon-yes'"
            class="iconfont"
          />
        </dd>
      </dl>
      <transition-group
        class="nav-tab"
        name="slide"
        tag="div"
        appear
      >
        <div
          v-for="(item,index) in newSubList"
          v-show="showIndex===index"
          :key="item.subSortId"
          :class="{clearfix:true, 'slide-item':true}"
        >
          <draggable
            v-model="item.siteList"
            :disabled="!editState||type=='mobile'"
            tag="ul"
            class="drag"
            @start="drag=true"
            @end="drag=false"
            @update="updateSiteIndex(item.siteList)"
          >
            <li
              v-for="item2 in item.siteList"
              :key="item2.siteId"
              :class="['site-item',{'edit':editState}]"
            >
              <em
                class="site-edit"
                @click="showEditBox(item.subSortId,item2.siteId)"
              >
                <i class="iconfont icon-edit" />
              </em>
              <em
                class="site-del"
                @click="delSite(item2.siteId,item2.siteName)"
              >
                <i class="iconfont icon-delete" />
              </em>
              <el-tooltip
                :content="item2.siteTips"
                :disabled="item2.siteTips==''"
                placement="top"
              >
                <a
                  :href="item2.siteUrl"
                  target="_blank"
                >
                  <img
                    v-lazy="item2.imgSrc"
                    v-if="showIcon&&showIndex===index"
                    class="icon"
                  >
                  <span class="site-name">{{ item2.siteName }}</span>
                </a>
              </el-tooltip>
            </li>
          </draggable>
          <li
            v-if="editState"
            class="site-item edit"
          >
            <em
              class="site-edit"
              @click="showEditBox(item.subSortId,null,item.siteList.length>0?item.siteList[item.siteList.length-1].siteIndex:0)"
            >
              <i class="iconfont icon-add" />
            </em>
          </li>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "SiteBox",
  components: { draggable },
  props: {
    // 网址数据拆分为两个数组,方便布局
    subList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    color: {
      type: String,
      default: "green"
    },
    sortName: {
      type: String,
      default: ""
    },
    sortId: {
      type: Number,
      default: 0
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      newSortName: "",
      newSubTitle: "",
      showEdit: false,
      showSortEdit: false,
      showIndex: 0,
      isAddSort: false,
      list: [], // 拖拽二级分类的临时变量
      newSubList:[]
      // dragSubList: []
    };
  },
  computed: {
    type() {
      return this.$store.state.type;
    },
    // * 编辑状态
    editState() {
      return this.$store.state.sites.editState;
    },
    dragSubList: {
      get() {
        var list = [];
        this.subList.forEach(item => {
          list.push({
            sortId: item.sortId,
            subIndex: item.subIndex,
            subSortId: item.subSortId
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
    subList(val){
      this.newSubList = JSON.parse(JSON.stringify(this.subList))

    }
  },
  mounted() {
    this.newSubList = JSON.parse(JSON.stringify(this.subList))
    // this.dragSubList = this.subList;
    // this.checkImgs();
    //
  },
  methods: {
    // * 获得图片数组
    checkImgs() {
      this.io = new IntersectionObserver(ioes => {
        ioes.forEach(ioe => {
          const el = ioe.target;
          const intersectionRatio = ioe.intersectionRatio;
          if (intersectionRatio > 0 && intersectionRatio <= 1) {
            this.loadImg(el);
          }
          el.onload = el.onerror = () => io.unobserve(el);
        });
      });
      this.imgs = Array.from(document.querySelectorAll(".favicon"));
      this.imgs.forEach(item => this.io.observe(item));
    },
    // * 加载真是图片
    loadImg(el) {
      const source = el.dataset.src;
      el.src = source;
    },
    // *切换索引
    swichIndex(index) {
      this.showIndex = index;
    },
    // * 失焦点添加subSort
    hideAddSubSort() {
      if (!this.newSubTitle) {
        this.showEdit = false;
      } else {
        this.$confirm(`请确认是否添加 ${this.newSubTitle}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async comfirm => {
            var subIndex;
            if (this.subList && this.subList.length) {
              var subIndex = this.subList[this.subList.length - 1].subIndex+1;

            } else {
              subIndex = 0;
            }
            let { data, status } = await this.$axios.post(
              "/subSort/insert",
              {
                subTitle: this.newSubTitle,
                sortId: this.sortId,
                subIndex: subIndex
              }
            );
            if (status === 200 && data.code === "01") {
              this.$message({
                type: "success",
                message: data.msg
              });
              this.$store.commit("sites/setIsUpdateAll", true);
              this.$store.commit("sites/setSubSortList", []);
              // 激活当前二级分类
              this.showIndex = this.subList.length;
            }
            this.showEdit = false;
            this.newSubTitle = "";
          })
          .catch(cancel => {
            this.showEdit = false;
            this.newSubTitle = "";
          });
      }
    },
    // * 添加分类
    addSort() {
      this.showEdit = true;
      this.$refs.editSubSort.focus();
    },
    //* 显示添加subSort弹窗
    showEditSubSortBox(subSortId, subTitle) {
      this.$emit("showEditSubSortBox", {
        subSortId,
        subTitle,
        sortId: this.sortId
      });
    },
    /**
     * 显示编辑网址弹窗
     * @param  subSortId 二级分类id
     * @param  siteId 网址id
     * @param  siteIndex 最后网址索引
     */
    showEditBox(subSortId, siteId, siteIndex) {
      this.$emit("showEditBox", {
        subSortId,
        siteId,
        sortId: this.sortId,
        siteIndex
      });
    },
    //* 删除网址
    delSite(siteId, siteName) {
      this.$confirm(`你真的要删除 ${siteName} 吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async confirm => {
          let { status, data } = await this.$axios.post("/sites/del", {
            siteId
          });
          if (status === 200 && data.code === "01") {
            this.$message({
              type: "success",
              message: data.msg
            });
            this.$store.commit("sites/setIsUpdateAll", true);
            // 激活第一个分类
            // this.showIndex = 0;
          } else {
            this.$message({
              type: "error",
              message: data.msg
            });
          }
        })
        .catch(cancel => {});
    },
    //* 删除subSort分类
    delSubSort(subSortId, subTitle, siteList) {
      if (siteList && siteList.length > 0) {
        this.$message({
          type: "warning",
          message: "请先删除当前分类下的网址"
        });
        return false;
      }
      this.$confirm(`你真的要删除 ${subTitle} 分类吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async confirm => {
          let { status, data } = await this.$axios.post("/subSort/del", {
            subSortId
          });
          if (status === 200 && data.code === "01") {
            this.$message({
              type: "success",
              message: data.msg
            });
            this.$store.commit("sites/setIsUpdateAll", true);
            this.$store.commit("sites/setSubSortList", []);
            // 激活第一个分类
            this.showIndex = 0;
          } else {
            this.$message({
              type: "error",
              message: data.msg
            });
          }
        })
        .catch(cancel => {});
    },
    //* 失焦添加分类
    hideAddSort() {
      if (this.newSortName === this.sortName) {
        this.showSortEdit = false;
      } else {
        this.$confirm(`请确认是否修改为 ${this.newSortName} `, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async confirm => {
            let { status, data } = await this.$axios.post("/sort/edit", {
              sortId: this.sortId,
              sortName: this.newSortName
            });
            if (status === 200 && data.code === "01") {
              this.$message({
                type: "success",
                message: data.msg
              });
              this.$store.commit("sites/setIsUpdateAll", true);
              this.$store.commit("sites/setSubSortList", []);
              // 激活第一个分类
              // this.showIndex = 0;
              this.showSortEdit = false;
              this.newSortName = "";
            }
          })
          .catch(cancel => {
            this.showSortEdit = false;
            this.newSortName = "";
          });
      }
    },
    //* 编辑分类弹窗
    editSortBox() {
      this.showSortEdit = true;
      this.newSortName = this.sortName;
      this.$refs.editSort.focus();
    },
    delSort() {
      if (this.subList && this.subList.length > 0) {
        this.$message({
          type: "warning",
          message: "请先删除当前分类下的所有分类和网址"
        });
        return false;
      }
      this.$confirm(`你真的要删除 ${this.sortName} 分类吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async confirm => {
          let { status, data } = await this.$axios.post("/sort/del", {
            sortId: this.sortId
          });
          if (status === 200 && data.code === "01") {
            this.$message({
              type: "success",
              message: data.msg
            });
            this.$store.commit("sites/setIsUpdateAll", true);
            this.$store.commit("sites/setSubSortList", []);
          }
        })
        .catch(cancel => {

        });
    },
    async updateSiteIndex(siteList) {
      var { status, data } = await this.$axios.post("/sites/order", {
        siteList
      });
      if (status == 200 && data.code === "01") {
        this.$message({
          type: "success",
          message: data.msg
        });
      } else {
        this.$message({
          type: "error",
          message: data.msg
        });
      }
    },
    async updateSubIndex(subList) {

      var { status, data } = await this.$axios.post("/subSort/order", {
        subList
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

<style lang="scss">
.site-box {
  margin-bottom: 5px;
}
.hidden {
  display: none;
}
/*主题定制*/
.sort {
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  border-radius:3px;
  overflow: hidden;
  dl {
    dt {
      float: left;
      height: 1.5rem;
      line-height: 1.5rem;
      color: #fff;
      font-weight: bold;
      border-radius: 0.75rem;
      margin-right: 0.5rem;
      text-shadow: 1px 1px 2px #666;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding: 0 0.5rem;
      em {
        font-style: normal;
      }
      .icon-edit {
        float: left;
      }
    }
    dd {
      float: left;
      height: 1.1rem;
      line-height: 1.1rem;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 0.55rem;
      margin: 0.2rem;
      padding: 0 0.5rem;
      position: relative;
      color:#383a44;
      cursor: pointer;
      &.is-active,
      &:hover {
        font-weight: bold;
        color:#000;
      }
      &.add-sort {
        color: #fff;
      }
      &.edit {
        border: 1px dashed #fff;
        box-sizing: border-box;
        cursor: move;
      }
    }
    .sort-input {
      float: left;
      outline: none;
      border: none;
      height: 1.1rem;
      width: 0rem;
      background-color: rgba(255, 255, 255, 0.5);
      transition: width 0.2s ease;
      margin: 0.2rem 0;
      &.show-sort-input {
        width: 3rem;
        padding: 0 5px;
      }
    }
  }
  &.green {
    .green {
      background-color: rgba(91, 174, 35, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(91, 174, 35, 1);
    }
  }
  &.orange {
    .orange {
      background-color: rgba(248, 182, 41, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(248, 182, 41, 1);
    }
  }
  &.red {
    .red {
      background-color: rgba(237, 85, 106, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(237, 85, 106, 1);
    }
  }
  &.purple {
    .purple {
      background-color: rgba(120, 41, 248, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(120, 41, 248, 1);
    }
  }
  &.blue {
    .blue {
      background-color: rgba(41, 155, 248, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(41, 155, 248, 1);
    }
  }
  &.yellow {
    .yellow {
      background-color: rgba(252, 210, 23, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(252, 210, 23, 1);
    }
  }
  &.kongquelan {
    .kongquelan {
      background-color: rgba(14, 176, 201, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(14, 176, 201, 1);
    }
  }
  &.tongGreen {
    .tongGreen {
      background-color: rgba(83, 60, 27, 0.1);
    }
    dt,
    .add-sort {
      background-color: rgba(83, 60, 27, 1);
    }
  }
}
/*网址content样式*/
.nav-tab {
  padding: 0.5rem;
  box-sizing: border-box;
  position: relative;
  ul {
    &.site-box-item {
      min-height: 3.2rem;
    }
  }
  .site-item {
    float: left;
    width: 5.3rem;
    height: 1.5rem;
    line-height: 1.5rem;
    margin: 1px;
    box-sizing: border-box;
    position: relative;
    background-color: rgba(255, 255, 255, 0.2);
    a {
      color: #000;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0 0.3rem;
      transition: transform 0.1s linear;
      position: absolute;
      z-index: 10;
      font-size: 0.7rem;
      // font-size:1rem;
      &:hover {
        transform: scale(1.1);
        background: #405061;
        color: #fff;
        font-weight: bold;
      }
      img.icon {
        width: 1rem;
        height: 1rem;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        position: absolute;
        left: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
      }
      .site-name {
        position: absolute;
        left: 1.3rem;
        width: 3.7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
    .site-edit {
      display: none;
      width: 100%;
      height: 100%;
      position: absolute;
      text-align: center;
      color: #fff;
      z-index: 20;
      cursor: move;
      &:active,
      &:hover {
        color: #d0d0d0;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    .site-del {
      display: none;
      // width: 100%;
      // height: 100%;
      position: absolute;
      text-align: center;
      color: #fff;
      z-index: 20;
      right: 0;
      cursor: pointer;
      .icon-delete {
        color: #fff;
        position: relative;
        font-size: 0.8rem;
        left: 30%;
        top: -10px;
        &:active,
        &:hover {
          color: #d0d0d0;
        }
      }
    }
    &.edit {
      .site-edit {
        border: 1px dashed;
        box-sizing: border-box;
      }
      .site-edit,
      .site-del {
        display: block;
      }
      a {
        opacity: 0.7;
      }
    }
  }
}
.slide-item {
  display: inline-block;
  width: 100%;
  height: 100%;
  position: relative;
  transition: height 1s linear;
}
.slide-enter-active {
  transition: all 0.3s ease-out;
}
.slide-leave-active {
  position: absolute;
  height: 0;
  opacity: 0;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(15px);
  opacity: 0;
}
.slide-move {
  transition: translateY 0s;
}
</style>
