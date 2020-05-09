<!--日-->
<template>
  <div id="day">
    <el-select clearable v-model="day">
      <el-option
        :key="item.value"
        :label="item.name"
        :value="item.value"
        v-for="item in list"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    nYear: {
      type: String
    },
    nMonth: {
      type: String
    },
    nDay: {
      type: String
    }
  },
  data() {
    return {
      day: "",
      data: null,
      list: []
    };
  },
  methods: {
    mGetDate() {
      this.list = [];
      const d = new Date(parseInt(this.nYear), parseInt(this.nMonth), 0);
      var value = d.getDate();
      for (var i = 1; i <= value; i++) {
        this.list.push({
          name: i.toString().padStart(2, "0"),
          value: i.toString().padStart(2, "0")
        });
      }
    }
  },
  watch: {
    nDay: {
      handler() {
        this.day = this.nDay;
      },
      immediate: true
    },
    nYear: {
      handler(value1, value2) {
        if (this.nYear !== "" && this.nMonth) {
          this.mGetDate();
        }
      },
      immediate: true
    },
    nMonth: {
      handler(value1, value2) {
        if (this.nMonth !== "" && this.nYear) {
          this.mGetDate();
        }
      },
      immediate: true
    },
    day() {
      this.$emit("setDay", this.day);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-select {
  width: 130px;
}
</style>
