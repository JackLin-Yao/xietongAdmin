<script setup >

import { computed, ref } from 'vue';




let props = defineProps({
  // 表格的配置
  options: {

    type: Array,
    required: true
  },
  // 表格的数据
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Boolean,
    default: false
  },
  selectionBtn: {
    type: Boolean,
    default: false
  },
  index: {
    type: Boolean,
    default: false
  },
  // // 是否可以编辑行
  // isEditRow: {
  //   type: Boolean,
  //   default: false
  // },
  // // 编辑行按钮的标识
  // editRowIndex: {
  //   type: String,
  //   default: ''
  // },

  total: {
    // required: true,
    type: [Number, String]
  },
  page: {
    type: [Number, String],
    default: 1
  },
  limit: {
    type: [Number, String],
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [20, 40, 50, 60]
    }
  },
  pagerCount: {
    type: [Number, String],
    default: document.body.clientWidth < 992 ? 5 : 7
  },
})
const emit = defineEmits();
const currentPage = computed({
  get() {
    return Number(props.page)
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return Number(props.limit)
  },
  set(val) {
    emit('update:limit', val)
  }
})

function handleSizeChange(val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

const handleSelectionChange = (val) => {

  emit('selectionChang', val)

}
const cellDblclick = (row, column, cell, event) => {
  emit('DbClick', row, column, cell, event)
}
</script>

<template>
  <el-table stripe border :data="data" v-bind="$attrs" v-loading="loading" element-loading-text="数据加载中，请耐心等待..."
    @selection-change="handleSelectionChange" @cell-dblclick="cellDblclick">
    <template v-for="(tableitem, index) in options" :key="index">
      <el-table-column v-if="!tableitem.action && !tableitem.slot && !tableitem.selectionBtn && !tableitem.index"
        :label="tableitem.label" :prop="tableitem.prop" :align="tableitem.align" :width="tableitem.width">
      </el-table-column>
      <el-table-column v-else-if="tableitem.slot" :label="tableitem.label" :prop="tableitem.prop"
        :align="tableitem.align" :width="tableitem.width">
        <template #default="scope">
          <slot :name="tableitem.slot" :scope="scope"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else-if="tableitem.selectionBtn" type="selection" width="50">
      </el-table-column>
      <el-table-column v-else-if="tableitem.action" :label="tableitem.label" :prop="tableitem.prop"
        :align="tableitem.align" :width="tableitem.width">
        <template #default="scope">
          <slot name="action" :scope="scope"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else-if="tableitem.index" width="50" :label="tableitem.label" type="index"></el-table-column>
    </template>
  </el-table>
  <div class="pagination" v-if="pagination">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
      layout=" total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :pager-count="pagerCount"
      :total="Number(total)" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 7px;
  height: 40px;
  padding-right: 8px;
  background-color: #fff;

  .el-pagination {}
}
</style>
