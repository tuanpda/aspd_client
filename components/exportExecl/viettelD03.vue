<template>
  <div>
    <button
      @click="exportExcel"
      :disabled="disabled"
      class="button is-small is-info"
    >
      <span class="icon">
        <i class="fas fa-file-download"></i>
      </span>
      <span>D03 VIETTEL</span>
    </button>
  </div>
</template>
<script>
import company from "@/config.company";

import ExcelJS from "exceljs";
const { DateTime } = require("luxon");
export default {
  components: {},
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

  methods: {
    async exportExcel() {
      const workbook = new ExcelJS.Workbook();

      // Tải file mẫu D03
      const response = await fetch(
        `${company.apiBaseURL}/static/d03viettel.xls`
      );
      // console.log(response);

      const arrayBuffer = await response.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      // Lấy worksheet từ file mẫu
      const worksheet =
        workbook.getWorksheet("Dữ Liệu") || workbook.worksheets[0];
      if (!worksheet) {
        console.error("Không tìm thấy worksheet để ghi dữ liệu");
        return;
      }

      // Xử lý dữ liệu và ghi vào Excel
      const startRow = 6;
      this.data_execl.sort((a, b) => a._id - b._id);

      this.data_execl.forEach((item, index) => {
        const rowNumber = startRow + index; // Dòng hiện tại

        // Thêm hàng dữ liệu vào worksheet
        const row = worksheet.getRow(rowNumber);

        // Gán các trường dữ liệu khác vào các cột tương ứng
        row.getCell(1).value = `${index + 1}`; // Cột A
        row.getCell(2).value = item.hoten; // Cột B
        row.getCell(3).value = item.masobhxh; // Cột C

        // Cột F
        // row.getCell(6).value = `${item.maphuongan} - ${item.tenphuongan}`;
        row.getCell(6).value = `${item.maphuongan}`;

        // row.getCell(7).value = item.tylengansachdiaphuong; // Cột G ngân sách địa phương\
        row.getCell(7).value = "20"; // để 0 theo quỳnh nói

        if (item.ngaybienlai !== null || item.ngaybienlai !== "") {
          const [datePart] = item.ngaybienlai.split(" ");
          const [day, month, year] = datePart.split("-");

          const formattedDate = `${day}/${month}/${year}`;

          row.getCell(8).value = formattedDate; // Cột H ngày biên lai
        }
        row.getCell(9).value = item.sobienlai; // Cột I số biên lai

        // console.log(item.manguoithu);

        if (item.manguoithu == null || item.manguoithu == "") {
          row.getCell(10).value = "Mặc định";
          row.getCell(11).value = item.tienluongcs; // Cột K lương cs
        } else {
          if (item.manguoithu !== 1) {
            row.getCell(10).value = item.manguoithu; // Cột J người thứ
            // gán luôn cột mức tiền đóng
            // console.log(typeof item.tienluongcs);
            if (item.manguoithu == 2) {
              row.getCell(11).value = "1638000";
            } else if (item.manguoithu == 3) {
              row.getCell(11).value = "1404000";
            } else if (item.manguoithu == 4) {
              row.getCell(11).value = "1170000";
            } else if (item.manguoithu == 5) {
              row.getCell(11).value = "936000";
            }
          } else {
            row.getCell(10).value = "Mặc định";
            row.getCell(11).value = item.tienluongcs; // Cột K lương cs
          }
        }

        row.getCell(12).value = Number(item.sotien); // Cột L tiền thực te
        row.getCell(13).value = "4"; // Cột M muc huong

        row.getCell(14).value = item.tungay; // Cột N

        row.getCell(17).value = item.tentinh; // Cột Q
        row.getCell(18).value = item.matinh; // Cột R
        // row.getCell(19).value = item.tenquanhuyen; // Cột S
        // row.getCell(20).value = item.maquanhuyen; // Cột T
        // row.getCell(21).value = item.tenxaphuong; // Cột U
        // row.getCell(22).value = item.maxaphuong; // Cột V
        // code ngày 1.8.2025 theo file đẩy ivan vnpt chính quyền 2 cấp
        // row.getCell(19).value = item.tenquanhuyen; // Cột S
        // row.getCell(20).value = item.maquanhuyen; // Cột T
        row.getCell(21).value = item.tenxaphuong_new; // Cột U
        row.getCell(22).value = item.maxaphuong_new; // Cột V

        row.getCell(23).value = item.tothon; // Cột V

        row.getCell(24).value = item.maphuongthucdong; // Cột X
        row.getCell(
          25
        ).value = `Số biên lai: ${item.sobienlai}. Người nhập: ${item.tennguoitao}`; // Cột Y
        row.getCell(26).value = item.ngaysinh; // Cột Z
        if (item.gioitinh == "Nam") {
          row.getCell(27).value = "1"; // Cột AA
        } else {
          row.getCell(27).value = "0"; // Cột AA
        }

        row.getCell(28).value = item.cccd; // Cột AB
        const maNhanVienThu = item.sohoso.split("/").pop();
        row.getCell(29).value = `NV${maNhanVienThu}`; // Cột AC
        row.getCell(30).value = item.tentinh; // Cột AD
        row.getCell(31).value = item.matinh; // Cột AE
        row.getCell(32).value = item.tenbenhvien; // Cột AF
        row.getCell(33).value = item.mabenhvien.slice(2); // Cột AG

        // cột TK1
        row.getCell(35).value = "X"; // mặc định X
        row.getCell(35).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" }, // Màu vàng (yellow)
        };
        row.getCell(36).value = item.cccd; // Cột AJ

        row.getCell(38).value = "Việt Nam"; // Cột AL
        row.getCell(39).value = "VN"; // Cột AN
        row.getCell(40).value = "Kinh"; // Cột AM

        // add thêm thông tin tỉnh
        row.getCell(42).value = item.tentinh; // Từ cột AP
        row.getCell(43).value = item.matinh;
        // row.getCell(44).value = item.tenquanhuyen;
        // row.getCell(45).value = item.maquanhuyen;
        // row.getCell(46).value = item.tenxaphuong;
        // row.getCell(47).value = item.maxaphuong; // Đến cột AU
        row.getCell(46).value = item.tenxaphuong_new;
        row.getCell(47).value = item.maxaphuong_new; // Đến cột AU

        row.getCell(48).value = item.tentinh; // Từ cột AV
        row.getCell(49).value = item.matinh;
        // row.getCell(50).value = item.tenquanhuyen;
        // row.getCell(51).value = item.maquanhuyen;
        // row.getCell(52).value = item.tenxaphuong;
        // row.getCell(53).value = item.maxaphuong; // Đến cột BA
        row.getCell(52).value = item.tenxaphuong_new;
        row.getCell(53).value = item.maxaphuong_new; // Đến cột BA

        row.getCell(54).value = item.tennguoitao; // Cột BB
        row.getCell(56).value = item.dienthoai; // Cột BD
        row.getCell(72).value = item.ghichu; // cột BT

        row.commit(); // Xác nhận thay đổi cho hàng
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "D03_VIETTEL.xls";
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
