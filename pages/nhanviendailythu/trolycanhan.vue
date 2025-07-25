<template>
  <div class="column">
    <div class="box">
      <div class="columns">
        <div class="column">
          <div class="control">
            <span style="color: #0dcaf0" class="icon is-small is-left">
              <i class="fab fa-centos"></i>
            </span>
            <span style="font-weight: bold; color: #0dcaf0"
              >Trợ lý cá nhân</span
            >
          </div>
        </div>
      </div>

      <div class="box">

      </div>

      <!-- Biểu tượng loading -->
      <div v-if="isLoading" class="loading-overlay">
        <!-- Biểu tượng loading -->
        <div class="loading-spinner"></div>
        <span>waitting some minute ...</span>
      </div>
    </div>
  </div>
</template>

<script>
import company from "@/config.company";

import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
const { DateTime } = require("luxon");


export default {

  data() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    return {
      
      isLoading: false,
    };
  },



  watch: {

  },

  mounted() {
    const user = this.user;

    this.dailyview = user.madaily;
    this.tochuc = user.matochuc;
    this.cccd = user.cccd
    this.isRoleSent = user.res_sent;
    this.madaily = user.madaily;
    this.diemthu = user.tendaily;

    if (user.role == 2) {
      this.diemthu = "Tài khoản tổng hợp";
    } else {
      this.diemthu = user.tendaily;
      this.isDiemthu = true;
    }

  },

  computed: {
    user() {
      return this.$store.state.user || {};
    },



  },

  methods: {


   
  },
};
</script>

<style scoped lang="css">
@import "@/assets/customCss/common.css";
@import "@/assets/customCss/footerTable.css";

.pagination {
  margin-top: 1em;
}

.is-disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
