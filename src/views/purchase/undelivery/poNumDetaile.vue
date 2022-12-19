<script setup >
import { getPurchaseList, getPurchaseNumber, postDeliverGoods } from '@/api/purchase/list'
import { useRouter, useRoute } from 'vue-router'
import TableView from '@/components/table/index.vue';
import printJS from 'print-js'
import style from '@/assets/styles/table.scss';
import { ElMessage } from 'element-plus'

const state = reactive({
  printRef: null
});

const onPrintJs = () => {
  printJS({
    printable: printMe,
    type: 'html',
    type: 'html',
    // css: ['//unpkg.com/element-plus/dist/index.css'],
    style: style,
    scanStyles: false
  });
};
const router = useRouter()
const route = useRoute()

const poNumDetail = ref([])
let loading = ref(false)
let companyName = ref('')
let companyCode = ref('')


/**
 * 获取表格数据
 */
let poNum = route.path.split('/')[3]
const getPurchasePoNumDetail = async () => {
  await getPurchaseNumber(poNum).then((res) => {
    loading.value = true
    poNumDetail.value = res.data
    companyCode.value = res.data[0].vendNum
    companyName.value = res.data[0].name

  }).finally(() => {
    loading.value = false
  });
}
getPurchasePoNumDetail()

onMounted(() => {
  // tableData.value.map(item => {
  //   item.isEditRow = false
  // })
})


/**
 * 选中项逻辑
 */
let multipleSelection = ref([])

const dialogVisible = ref(false)

let isEdit = ref(false)
const selectCheckBoxAtion = (selection, row) => {
  if (JSON.stringify(selection).includes(JSON.stringify(row))) {
    isEdit.value = true
  }
  else {
    isEdit.value = false
  }
}
const selectCheckBoxAllAtion = (val) => {
  if (val) {
    isEdit.value = true
  }
  else {
    isEdit.value = false
  }
}
/**
 *
 * @param {CheckBox选中的行数据} val
 */
const selectionAtion = (val) => {
  if (val) {
    multipleSelection.value = val

  } else {
    multipleSelection.value = []
  }
}
/**
 *
 * @param {打印弹窗逻辑参数} params
 */
const editAtion = (params) => {
  dialogVisible.value = true
}



const openEdit = (row, column, cell, event) => {
  if (multipleSelection.value && multipleSelection.value.length > 0 && JSON.stringify(multipleSelection.value).indexOf(JSON.stringify(row)) > 0) { isEdit.value = true }

  else {
    isEdit.value = false
  }
}
const closeEdit = (row, column, cell, event) => {
  isEdit.value = false
}

const DNoption = [
  {
    label: '序号',
    index: true
  },
  {
    label: '采购单号',
    prop: 'poNum',
    width: '120'
  },
  {
    label: '行',
    prop: 'poLine',
    width: '50'
  },
  {
    label: '物料代码',
    prop: 'item',
    align: 'left',
    width: '130'
  },
  {
    label: '物料说明',
    prop: 'description',
    width: '300'
  },
  {
    label: '送货数量',
    prop: 'qtyDeliv',
    width: '80'
  },
  {
    label: '单位',
    prop: 'umdesc',
    width: '55'
  },
  {
    label: '订单备注',
    prop: 'remark',
    width: '160'
  },
  {
    label: '送货备注',
    // prop: 'utNote',
    // width: '100'
  }
]
const dilverGoodsAtion = async () => {
  if (multipleSelection.value && multipleSelection.value.length > 0) {
    let selectionObject = toRaw(multipleSelection.value)
    await postDeliverGoods(multipleSelection.value).then((result) => {
      getPurchasePoNumDetail()
      ElMessage.success('发货成功')
    })
  } else {
    ElMessage.error('请选择要发货的数量')
  }

}


</script>

<template>
  <div class="poNumDetaile">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>采购单号：{{ poNum }}</span>
        </div>
      </template>
      <div class="detail-list">

        <div class="detail-list-item">供应商编码：{{ companyCode }}</div>
        <div class="detail-list-item">供应商：<el-tag size="large">{{ companyName }}</el-tag></div>

      </div>
    </el-card>
    <el-card class="boxList-card">
      <template #header>
        <div class="card-header">
          <div><span>明细</span>
          </div>

          <div>
            <el-button @click="editAtion">打印</el-button>
            <el-button @click="dilverGoodsAtion">物料发货</el-button>
          </div>

        </div>


      </template>

      <el-table stripe :data="poNumDetail" v-bind="$attrs" v-loading="loading" element-loading-text="数据加载中，请耐心等待..."
        @select-all="selectCheckBoxAllAtion" @select="selectCheckBoxAtion" @selection-change="selectionAtion">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="项次" prop='poLine' align='left' width="55"> </el-table-column>
        <el-table-column label="物料" align='left'>
          <template #default="scope">
            <div>
              <span>物料号：</span><br />
              <span>{{ scope.row.item }}</span>
            </div>
            <div>
              <span>物料说明：</span><br />
              <span>{{ scope.row.description }}</span>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="物料规格" prop='itemDesc' align='left'> </el-table-column>
        <el-table-column label="请购单行备注" prop='utNote' align='left'> </el-table-column>
        <el-table-column label="到期日期 / 承诺日期" align='left' width="200">
          <template #default="scope">

            <div style="margin-bottom: 5px;">
              <span>到期日期:</span>
              <el-tag type="success">{{ scope.row.dueDate }}</el-tag>
            </div>

            <div>
              <span>承诺日期:</span>
              <el-tag type="warning">{{ scope.row.promiseDate }}</el-tag>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="数量信息" align='left' width="200">
          <template #default="scope">
            <div style="margin-bottom: 5px;">
              <span>订购数量：</span>
              <span>{{ scope.row.qtyOrdered }}</span>
            </div>
            <div style="margin-bottom: 5px;">
              <span>未送货数量: </span>
              <el-tag type="warning">{{ scope.row.qtyUndeliv }}</el-tag>
            </div>
            <!-- <div>
              <span>已发货数量：</span>
              <el-tag type="success">{{ scope.row.qtyDeliv
              }}</el-tag>
            </div> -->
            <div>
              <span>单位说明：</span>
              <span>{{ scope.row.umdesc }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货数量" prop='qtyOrdered' align='center' width="200">
          <template #default="scope">
            <!-- <el-input v-if="isEdit && JSON.stringify(multipleSelection).includes(JSON.stringify(scope.row))"
              type="number" v-model="scope.row.qtyDeliv" placeholder=" " clearable min="0"
              @input="dilverGoodsCheck(scope.row.qtyDeliv, scope.row.qtyUndeliv)"
              @blur="scope.row.qtyDeliv > scope.row.qtyUndeliv ? value = scope.row.qtyUndeliv : scope.row.qtyDeliv = 0">
              <template #prepend>发货数量</template>
            </el-input> -->
            <el-input-number v-if="isEdit && JSON.stringify(multipleSelection).includes(JSON.stringify(scope.row))"
              v-model="scope.row.qtyDeliv" :min="0" :max="scope.row.qtyUndeliv" />
            <div v-else>{{ scope.row.qtyDeliv }}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop='remark' align='center' width="200">
          <template #default="scope">
            <el-input v-if="isEdit && JSON.stringify(multipleSelection).includes(JSON.stringify(scope.row))"
              type="textarea" v-model="scope.row.remark" placeholder=" 请输入内容" clearable maxlength="150">
              <template #prepend>备注</template>
            </el-input>
            <div v-else>{{ scope.row.remark }}</div>
          </template>

        </el-table-column>

      </el-table>

      <el-dialog v-model="dialogVisible" fullscreen destroy-on-close :show-close="false">
        <template #header>
          <el-button v-print="'#printMe'">打印</el-button>
          <el-button @click="onPrintJs">打印</el-button>
        </template>
        <el-card style="width: 1250px;">
          <div id="printMe" ref="printRef" style="width: 1200px;">
            <div class="dialog-header" style="width: 1200px;">
              <div>
                <span class="companyNmae">{{ companyName }}</span><br />
                <span>（{{ companyCode }}）</span>
                <span>送货单</span>
              </div>
            </div>
            <div class="table-header" style="width: 1200px;">
              <div class="table-header-left">
                <!-- <div></div> -->1111111111111111111111
              </div>
              <div class="table-header-right">
                <!-- <div></div> -->1111111111111
              </div>
            </div>

            <TableView :data="multipleSelection" :options="DNoption" style="width: 1170px;page-break-after:always; ">
            </TableView>
          </div>
        </el-card>


      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  padding-right: 8px;
  background-color: #fff;

  .el-pagination {}
}

.poNumDetaile {
  padding: 10px;

  .detail-list {
    display: flex;
    flex-wrap: wrap;

    .detail-list-item {
      height: 30px;
      width: calc(100% / 4);
      // background-color: #287;
      padding: 5px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 100%;
  }

  .boxList-card {
    width: 100%;
    margin-top: 3px;
    padding-bottom: 1.5px;
  }
}



::v-deep .el-dialog__footer {
  position: absolute;
  bottom: 0;
  right: 0;
}

.dialog-header {
  display: flex;
  justify-content: center;
  position: relative;

  .companyNmae {
    font-size: 18px;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .table-header-left {

      height: 200px;
      background-color: aqua;
    }

    .table-header-right {
      width: 20px;
      height: 20px;
      background-color: aqua;
    }
  }
}

.editInput {
  position: absolute;

  height: auto;
  min-width: 200px;
  max-width: 400px;
  padding: 0;
  z-index: 12;
}

.el-input {
  outline: 0;
  border: 1px solid #c0f2f9;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px #c0f2f9;
}
</style>

