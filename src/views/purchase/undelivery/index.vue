<script setup>
import { getPurchaseList, getPurchaseNumber } from "@/api/purchase/list";
import Table from "@/components/table/index.vue";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
const route = useRoute();
const tableData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
let totalNum = ref(null);
let pageNum = ref("1");
let pageSize = ref("20");
let options = [
  {
    label: "采购单号",
    prop: "poNum",
    align: "center",
    slot: "purchaseNumber",
    // width: 120
  },
  {
    label: "物料",
    // prop: 'left',
    slot: "item",
    align: "left",
    // width: 200
  },
  {
    label: "物料规格",
    prop: "itemDesc",
    align: "center",
  },
  {
    label: "供应商",
    prop: "name",
    align: "center",
    width: 300,
    slot: "name",
  },
  {
    label: "供应商编码",
    prop: "vendNum",
    align: "center",
  },

  {
    label: "操作",
    action: true,
    align: "center",
  },
];

const getPurchaseUndeliveryList = async (params) => {
  loading.value = true;
  await getPurchaseList({ params, pageNum: pageNum.value, pageSize: pageSize.value })
    .then((result) => {
      tableData.value = result.rows;
      totalNum.value = result.total;
      ElMessage.success("加载成功");
    })
    .finally(() => {
      loading.value = false;
    });
};

getPurchaseUndeliveryList();

const handleClick = (tab, event) => {
  // paneName

  if (tab.paneName == "0") {
    getPurchaseUndeliveryList();
  } else if (tab.paneName == "1") {
    alert(2); //此处写逻辑
  } else if (tab.paneName == "2") {
    alert(3); //此处写逻辑
  }
};

const queryParams = ref("");
</script>

<template>
  <div class="undelivery">
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 3px">
      <!-- <el-form :inline="true" :model="queryParams" class="demo-form-inline"> -->
      <el-input size="default" v-model="queryParams" placeholder="请输入搜索内容" style="max-width: 180px">
      </el-input>
      <el-button size="default" type="primary" class="ml10" @click="getPurchaseUndeliveryList(queryParams)">
        <el-icon>
          <Search />
        </el-icon>
        查询
      </el-button>
      <!-- </el-form> -->
    </el-card>

    <el-tabs class="demo-tabs" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未交货采购订单 ">
        <Table stripe :data="tableData" :options="options" height="650" pagination :total="Number(totalNum)"
          :loading="loading" @pagination="getPurchaseUndeliveryList" v-model:page="pageNum" v-model:limit="pageSize">
          <template #data="{ scope }">
            <div style="display: flex; align-items: center">
              <el-icon>
                <timer />
              </el-icon>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </div>
          </template>
          <template #name="{ scope }">
            <el-tag>{{ scope.row.name }}</el-tag>
          </template>
          <template #action="{ scope }">
            <el-button color="#626aef"><router-link :to="'poNum/' + scope.row.poNum">查看详情</router-link></el-button>
          </template>

          <template template #purchaseNumber="{ scope }">
            <el-link type="primary">
              <router-link :to="'poNum/' + scope.row.poNum">{{
                  scope.row.poNum
              }}</router-link></el-link>
          </template>
          <template #item="{ scope }">
            <div>
              <span>物料号：</span><br />
              <span>{{ scope.row.item }}</span>
            </div>
            <div>
              <span>物料说明：</span><br />
              <span>{{ scope.row.description }}</span>
            </div>
          </template>
        </Table>
      </el-tab-pane>
      <el-tab-pane label="交货采购订单 "></el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" title="Tips" draggable fullscreen>
      <span>It's a draggable Dialog</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.undelivery {
  padding: 8px;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  padding-right: 8px;
  background-color: #fff;

  .el-pagination {}
}

.table-container {}
</style>
