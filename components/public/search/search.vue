/*
 * @Author: wuhao
 * @Date: 2018-12-17 17:47:32
 * @Desc: 搜索框
 * @Last Modified by: wuhao
 * @Last Modified time: 2019-10-02 21:42:50
 */
<template>
  <el-row :gutter="0" class="s-header">
    <el-col
      :lg="{span: 10, offset: 7}"
      :md="{span: 12, offset: 6}"
      :sm="{span: 14, offset: 5}"
      :xs="{span: 20, offset: 2}"
    >
      <div class="s-box">
        <ul class="s-list">
          <li>
            <el-button
              v-for="(item,key) in sItemList"
              :key="key"
              :type="item.keyActive ? 'primary': 'text'"
              size="mini"
              @click="toogleItem(item,key)"
            >{{ item.text }}</el-button>
          </li>
        </ul>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          :debounce="300"
          :clearable="true"
          :hide-loading="true"
          popper-class="s-suggest"
          placeholder="请输入内容"
          class="s-input"
          @focus="handleFocus"
          @blur="handleBlur"
          @select="choose"
          @keyup.enter.native="handleSearch(showIndex)"
        >
          <template slot-scope="{ item }">
            <div class="suggest">{{ item }}</div>
          </template>
        </el-autocomplete>
        <div class="s-btn-group">
          <button
            v-for="(temp,index) in sItemList[showIndex].btn"
            :key="index"
            :class="['s-btn',{'active':temp.sitemActive}]"
            @click="handleSearch(showIndex,index)"
          >{{ temp.name }}</button>
        </div>
        <div v-show="isSearchHistory" class="s-history" @click="selectHistory">
          <p data-label>历史搜索:</p>
          <el-tag
            v-for="(item,index) in sHistory"
            v-show="index<5"
            :key="item.kid"
            size="small"
            closable
            type="success"
            @close="delKw(item.kid)"
          >
            <span class="tagText">{{ item.keyword }}</span>
          </el-tag>
        </div>
      </div>
    </el-col>
    <!-- 百度关键词智能提示script暂放地 -->
    <div ref="bdSug" :style="{display:'none'}" />
  </el-row>
</template>
<script>
export default {
  name: "Search",
  data() {
    return {
      search: "",
      isFocus: false,
      showIndex: 0,
      btnIndex: 0,
      isPc: this.$utils.browser() == "pc" ? true : false,
      sItemList: [],
      sugList: []
    };
  },
  computed: {
    searchList() {
      return this.$store.state.searchList;
    },
    sHistory() {
      return this.$store.state.search.sHistory;
    },
    /**
     * 是否显示搜索历史
     */
    isSearchHistory() {
      return (
        this.sHistory.length > 0 &&
        this.isFocus &&
        this.$utils.browser() == "pc"
      );
    }
  },
  created() {
    // 从store中获取数据
    this.sItemList =
      JSON.parse(JSON.stringify(this.searchList)) || this.sItemList;
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    /**
     * @name jsonp搜索智能提示
     */
    // querySearch: function(inputVal, cb) {
    //   var oScript = document.createElement("script");
    //   window.handleSug = this.handleSug;
    //   this.cb = cb;
    //   oScript.src =
    //     "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" +
    //     inputVal +
    //     "&cb=handleSug&s=1"; //this.value是我们在输入框中输入的内容。handleSug是我们定义的回调函数的名称
    //   this.$refs.bdSug.appendChild(oScript);
    //   // 每次append,获得关键词后就清除,保证页面始终最多只有一个oScript
    //   this.$refs.bdSug.innerHTML = "";
    //   cb([]);
    // },
    /**
     * @name 服务器搜搜智能提示
     */
    // querySearch: async function(inputVal, cb) {
    //   cb([]); // 避免出现加载框
    //   let { status, data } = await this.$axios.get("/search/sug", {
    //     params: {
    //       type: "baidu",
    //       keyword: inputVal
    //     }
    //   });
    //   this.sugList = data;
    //   cb(this.sugList); // 将数据渲染的候选词列表中
    // },
    querySearch: async function(inputVal, cb) {
      this.sugList = [];
      cb([]); // 避免出现加载框
      var oScript = document.createElement("script");
      window.handleSug = this.handleSug;
      this.cb = cb;
      oScript.src =
        "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" +
        inputVal +
        "&cb=handleSug&s=1"; //this.value是我们在输入框中输入的内容。handleSug是我们定义的回调函数的名称
      this.$refs.bdSug.appendChild(oScript);
      // 每次append,获得关键词后就清除,保证页面始终最多只有一个oScript
      this.$refs.bdSug.innerHTML = "";
      // cb([]);
      let { status, data } = await this.$axios.get("/search/getHistory", {
        params: {
          type: "baidu",
          keyword: inputVal
        }
      });
      if (status === 200 && data.code === "01") {
        let words = data.respData;
        words.filter((item, index) => {
          if (index < 3) {
            this.sugList.unshift(item.keyword);
          }
        });
        if (words.length > 0) {
          cb(this.sugList);
        }
      }

      // cb(this.sugList); // 将数据渲染的候选词列表中
    },
    /**
     * @name 处理搜索智能提示
     * @desc 将搜索历史记录关键词放在数组前面展示,后面展示智能提示有关键词就添加'清除所有搜索记录'
     * @desc {historyLen} 当前sugList数组中历史记录关键词占的个数
     */
    handleSug(data) {
      // this.sugList = [];
      // 前面放搜索历史记录
      if (data.s && data.s.length > 0) {
        data.s.map((item, index) => {
          if (this.sugList.length < 15) {
            this.sugList.push(item);
          }
        });
      }
      this.cb(this.sugList);
    },
    handleFocus() {
      clearTimeout(this.showTimer);
      this.isFocus = true;
    },
    handleBlur() {
      this.sugList = [];
      this.showTimer = setTimeout(() => {
        this.isFocus = false;
      }, 1000);
    },
    // 选择历史记录
    selectHistory(e) {
      if (!e.target.hasAttribute("data-label")) {
        this.search = e.target.textContent.trim();
      }
    },
    choose(target) {
      this.search = target;
      this.sugList = [];
    },
    // 搜索类目切换
    toogleItem: function(item, key) {
      var sItemList = this.sItemList;
      for (var _item of sItemList) {
        _item.keyActive = false;
      }
      item.keyActive = true;
      this.showIndex = key; // 将搜索类与按钮对应
    },
    handleSearch(showIndex, index) {
      console.log("showIndex, index: ", showIndex, index);
      // 当前显示的按钮组
      let btns = this.sItemList[showIndex].btn;
      if (index === undefined) {
        btns.forEach((item, key) => {
          if (item.sitemActive === true) {
            index = key;
          }
        });
        this.cb && this.cb([]);
      } else {
        // 激活当前搜索按钮
        if (btns[index].sitemActive === false) {
          btns.forEach(item => {
            item.sitemActive = false;
          });
        }
        btns[index].sitemActive = true;
      }
      if (!this.sugList || this.sugList.length === 0) {
        this.doSearch(btns[index].query);
      }
      this.sugList = "";
    },
    doSearch(query) {
      if (!this.search) return;
      this.saveKeyword();
      //正则匹配替换关键词
      query = query.replace(/{key}/i, encodeURI(this.search));
      window.open(query);
    },
    async saveKeyword() {
      let { status, data } = await this.$axios.post("/search/saveKeyword", {
        keyword: this.search
      });
      if (status === 200 && data.code === "01") {
        this.$store.commit("search/setSHistory", data.respData);
      }
    },
    async getHistory() {
      let { status, data } = await this.$axios.get("/search/getHistory");
      if (status === 200 && data.code === "01") {
        this.$store.commit("search/setSHistory", data.respData);
      }
    },
    async delKw(kid) {
      clearTimeout(this.showTimer);
      let { status, data } = await this.$axios.post("/search/del/history", {
        kid
      });
      if (status === 200 && data.code === "01") {
        this.$message({
          type: "success",
          message: data.msg
        });
        this.getHistory();
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
@import "./search.scss";
</style>
