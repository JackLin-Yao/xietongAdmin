<script setup>
import { deliverGoodsList, deliverGoodsDetail } from "@/api/purchase/list";
import Table from "@/components/table/index.vue";
const tabHeaderInfo = ref([
  {
    label: "全部",
  },
  {
    label: "未签收",
  },
  {
    label: "已完成",
  },
]);

const handleClick = (tab, event) => {
  // paneName

  if (tab.paneName == "0") {
    getDeliverGoodsList();
  } else if (tab.paneName == "1") {
    getDeliverGoodsList({ pageNum: pageNum.value, pageSize: pageSize.value }, 0); //此处写逻辑
  } else if (tab.paneName == "2") {
    getDeliverGoodsList({ pageNum: pageNum.value, pageSize: pageSize.value }, 1); //此处写逻辑
  }
};
let totalNum = ref(null);
const loading = ref(false);
let pageNum = ref("1");
let pageSize = ref("20");
const tableData = ref([]);
let options = [
  {
    label: "送货单号",
    prop: "id",
    align: "center",
    width: 55,

    // width: 120
  },
  {
    label: "采购单号",
    prop: "poNum",
    align: "center",
    slot: "purchaseNumber",

    // width: 120
  },

  {
    label: "供应商",
    prop: "vendName",
    align: "center",
    slot: "name",
    width: 300,
  },
  {
    label: "供应商编码",
    prop: "vendNum",
    align: "center",
  },
  {
    label: "送货状态",
    slot: "status",
    props: "receiveStatus",
  },

  {
    label: "操作",
    action: true,
    align: "center",
  },
];
const getDeliverGoodsList = async (params, status = "") => {
  loading.value = true;
  await deliverGoodsList(
    { params, pageNum: pageNum.value, pageSize: pageSize.value },
    status
  )
    .then((res) => {
      tableData.value = res.rows;
    })
    .finally(() => {
      loading.value = false;
    });
};
getDeliverGoodsList();
</script>

<template>
  <div class="dlivergoods">
    <el-tabs class="demo-tabs" type="border-card" @tab-click="handleClick">
      <template v-for="tabitem in tabHeaderInfo" :key="tabitem.label">
        <el-tab-pane :label="tabitem.label">
          <Table :loading="loading" :data="tableData" :options="options"
            ><template #action="{ scope }">
              <el-button color="#626aef"
                ><router-link :to="'delivery/' + scope.row.id"
                  >查看详情</router-link
                ></el-button
              >
            </template>
            <template #name="{ scope }">
              <el-tag>{{ scope.row.vendName }}</el-tag>
            </template>
            <template #status="{ scope }">
              <el-tag type="warning" v-if="!scope.row.receiveStatus == '1'">
                未送达</el-tag
              ><el-tag v-else> 已送达</el-tag>
            </template>
            <template template #purchaseNumber="{ scope }">
              <el-link type="primary">
                <router-link :to="'delivery/' + scope.row.id">{{
                  scope.row.poNum
                }}</router-link></el-link
              >
            </template>
          </Table>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
