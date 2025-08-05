<template>
  <div>
    <button
      @click="exportExcel"
      :disabled="disabled"
      class="button is-small is-danger"
    >
      <span class="icon">
        <i class="fas fa-file-download"></i>
      </span>
      <span>D05 VIETTEL</span>
    </button>
  </div>
</template>
<script>
import company from "@/config.company";
import { mixinDmBhxh } from "../../mixins/mixinDmBhxh";

import ExcelJS from "exceljs";
const { DateTime } = require("luxon");
export default {
  mixins: [mixinDmBhxh],

  props: {
    // Prop để nhận dữ liệu từ bên ngoài
    data_execl: [],
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },

  async created() {
    this.$on("danhmucs-loaded", () => {
      // console.log("Tất cả các danh mục đã được tải.");
      // console.log(this.loaihinhtg);
      // console.log(this.dmluongcs);
      // console.log(this.nguoithu);
      // console.log(this.phuongthucdong);
      // console.log(this.doituongdong);
      // console.log(this.doituongdongil);
      // console.log(this.dmtylehotro);
      // console.log(this.dmtinhthanhpho);
      // console.log(this.dmtyledongbhtn);
      // console.log(this.dmchuanngheo);
      // console.log(this.dmtylehotrodiaphuongis);
      if (this.dmluongcs.length > 0) {
        this.luongcoso = this.dmluongcs[0].luongcs;
      }
      if (this.dmtylehotro.length > 0) {
        this.tylengansachtw = this.dmtylehotro[0].tylengansachtw;
        this.tylenngansachdp = this.dmtylehotro[0].tylenngansachdp;
        this.hotrokhac = this.dmtylehotro[0].tylehotrokhac;
      }
      if (this.dmtyledongbhtn.length > 0) {
        this.tyledongbhyt = this.dmtyledongbhtn[0].tyledong;
        // console.log(this.tyledongbhyt);
      }
      if (this.dmchuanngheo.length > 0) {
        this.chuanngheo = this.dmchuanngheo[0].chuanngheo;
        // console.log(this.chuanngheo);
      }
      if (this.dmtylehotrodiaphuongis.length > 0) {
        this.tylediaphuonghotroIs =
          this.dmtylehotrodiaphuongis[0].tylediaphuong;
        this.tylehotrokhacIs = this.dmtylehotrodiaphuongis[0].tylekhac;
        // console.log(this.tylediaphuonghotroIs);
        // console.log(this.tylehotrokhacIs);
      }
      if (this.dmtylehotrodiaphuongil.length > 0) {
        this.tylediaphuonghotroIl =
          this.dmtylehotrodiaphuongil[0].tylediaphuong;
        // console.log(this.tylediaphuonghotroIl);
        // console.log(this.tylehotrokhacIs);
      }
    });
  },

  methods: {
    async exportExcel() {
      const workbook = new ExcelJS.Workbook();

      // Tải file mẫu từ URL hoặc từ input file (tuỳ thuộc môi trường bạn chạy)
      const response = await fetch(
        `${company.apiBaseURL}/static/d05viettel.xlsx`
      );
      // console.log(response);
      const arrayBuffer = await response.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      console.log(
        "Tên các sheet:",
        workbook.worksheets.map((s) => s.name)
      );

      // Chọn worksheet từ file mẫu
      const worksheet = workbook.getWorksheet("DuLieu"); // hoặc dùng chỉ số: workbook.worksheets[0]

      const startRow = 6;

      this.data_execl.sort((a, b) => a._id - b._id);

      // console.log(this.data_execl)

      this.data_execl.forEach((item, index) => {
        const rowNumber = startRow + index;
        const row = worksheet.getRow(rowNumber);

        const doituong = this.doituongdong.find(
          (d) => d.madoituong === item.madoituong
        );
        const tyleHotroTW = doituong ? doituong.tylehotro : 0;

        const base = 1500000;
        const bhxh = (base * 22) / 100;
        const tienNSNNHT = (bhxh * tyleHotroTW) / 100;
        const tienNSDP = (((1500000 * 22) / 100) * 20) / 100;

        row.getCell(1).value = `${index + 1}`;
        row.getCell(2).value = item.hoten;
        row.getCell(3).value = item.masobhxh;
        row.getCell(5).value = `${item.maphuongan} - ${item.tenphuongan}`;
        row.getCell(6).value = Number(item.muctiendong);
        row.getCell(7).value = item.tuthang;
        row.getCell(8).value = item.maphuongthucdong;
        row.getCell(9).value = "22";

        // row.getCell(10).value = tyleHotroTW.toString();
        // row.getCell(11).value = item.madoituong && tyleHotroTW > 0 ? tienNSNNHT * item.maphuongthucdong : 0;
        // row.getCell(12).value = this.tylediaphuonghotroIs;
        // row.getCell(13).value = tienNSDP * item.maphuongthucdong;
        row.getCell(10).value = item.tylensnnht;
        row.getCell(11).value =
          parseFloat(item.tiennsnnht) * parseFloat(item.maphuongthucdong);
        row.getCell(12).value = item.tylensdp;
        row.getCell(13).value =
          parseFloat(item.tiennsdp) * parseFloat(item.maphuongthucdong);

        row.getCell(16).value = Number(item.sotien);
        row.getCell(17).value =
          Number(item.sotien) + tienNSDP * item.maphuongthucdong + tienNSNNHT;
        row.getCell(18).value = item.tentinh;
        row.getCell(19).value = item.matinh;
        // row.getCell(20).value = item.tenquanhuyen;
        // row.getCell(21).value = item.maquanhuyen;
        // row.getCell(22).value = item.tenxaphuong;
        // row.getCell(23).value = item.maxaphuong;
        row.getCell(22).value = item.tenxaphuong_new;
        row.getCell(23).value = item.maxaphuong_new;
        row.getCell(24).value = item.tothon;
        row.getCell(
          25
        ).value = `Số biên lai: ${item.sobienlai}. Người nhập: ${item.tennguoitao}`;
        row.getCell(26).value = item.maphuongthucdong;

        let mucdong = item.muctiendong || 0;
        let heso = Math.floor((mucdong - 1500000) / 50000);
        heso = heso < 0 ? 0 : heso;
        row.getCell(27).value = heso;

        row.getCell(28).value = item.cccd;
        row.getCell(29).value = item.sobienlai;

        if (item.ngaybienlai) {
          const [datePart] = item.ngaybienlai.split(" ");
          const [day, month, year] = datePart.split("-");
          row.getCell(30).value = `${day}/${month}/${year}`;
        }

        const maNhanVienThu = item.sohoso.split("/").pop();
        row.getCell(31).value = `NV${maNhanVienThu}`;

        row.getCell(33).value = item.cccd;
        row.getCell(35).value = item.ngaysinh;
        row.getCell(36).value = item.gioitinh === "Nam" ? "1" : "0";

        row.getCell(45).value = item.tentinh;
        row.getCell(46).value = item.matinh;
        // row.getCell(47).value = item.tenquanhuyen;
        // row.getCell(48).value = item.maquanhuyen;
        // row.getCell(49).value = item.tenxaphuong;
        // row.getCell(50).value = item.maxaphuong;
        row.getCell(49).value = item.tenxaphuong_new;
        row.getCell(50).value = item.maxaphuong_new;

        row.getCell(51).value = item.tentinh;
        row.getCell(52).value = item.matinh;
        // row.getCell(53).value = item.tenquanhuyen;
        // row.getCell(54).value = item.maquanhuyen;
        // row.getCell(55).value = item.tenxaphuong;
        // row.getCell(56).value = item.maxaphuong;
        row.getCell(55).value = item.tenxaphuong_new;
        row.getCell(56).value = item.maxaphuong_new;

        row.getCell(57).value = item.tennguoitao;
        row.getCell(59).value = item.dienthoai;
        row.getCell(74).value = item.ghichu;

        row.commit();
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "D05_VIETTEL.xls";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  },
};
</script>

<style scoped lang="css">
@import "@/assets/customCss/common.css";
@import "@/assets/customCss/footerTable.css";

.pagination {
  margin-top: 1em;
}
</style>
