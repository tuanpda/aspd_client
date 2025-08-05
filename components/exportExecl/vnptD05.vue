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
      <span>D05 VNPT</span>
    </button>
  </div>
</template>
<script>
import company from "@/config.company";
const countries = require("../../data/countries");
const dantoc = require("../../data/dantoc");
const reles = require("../../data/moiquanhe");
const mhbhyt = require("../../data/muchuongbhyt");
const titleVnptD05 = require("../../data/titleVnptD05");
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
    // từ A - BU
    generateColumnNamesAtoBD() {
      const columns = [];
      let columnName = "";
      let num = 1;
      while (columnName !== "BU") {
        let tempNum = num;
        columnName = "";
        while (tempNum > 0) {
          let remainder = (tempNum - 1) % 26;
          columnName =
            String.fromCharCode("A".charCodeAt(0) + remainder) + columnName;
          tempNum = Math.floor((tempNum - 1) / 26);
        }
        columns.push(columnName);
        num++;
      }
      return columns;
    },

    // Xác định số thứ tự của cột trong excel
    columnToIndex(columnName) {
      let index = 0;
      for (let i = 0; i < columnName.length; i++) {
        index = index * 26 + (columnName.charCodeAt(i) - "A".charCodeAt(0) + 1);
      }
      return index;
    },

    async exportExcel1() {
      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();
      // Tạo worksheet mới
      const worksheet = workbook.addWorksheet("Dữ Liệu", {
        views: [{ state: "frozen", xSplit: 3, ySplit: 3 }],
      });

      // 2. THIẾT KẾ SHEET DỮ LIỆU
      // cột định nghĩa từ A - BD
      const columnNamesABD = this.generateColumnNamesAtoBD();

      // style AB1
      const myFontsAB1 = {
        timesNewRoman: {
          name: "Times New Roman", // Tên kiểu chữ
          size: 10, // Kích thước chữ
          bold: true, // Không in đậm
          italic: false, // Không in nghiêng
          underline: false, // Không gạch chân
          color: { argb: "FFFF0000" }, // Màu đỏ (ARGB hex)
        },
      };

      // style C1
      const myFontsC1 = {
        timesNewRoman: {
          name: "Times New Roman", // Tên kiểu chữ
          size: 10, // Kích thước chữ
          bold: true, // Không in đậm
          italic: true, // Không in nghiêng
          underline: true, // Không gạch chân
          color: { argb: "FF3BB5F5" }, // Màu xanh nhạt (ARGB hex)
        },
      };

      // style row 2
      const myFontsRow2 = {
        timesNewRoman: {
          name: "Times New Roman", // Tên kiểu chữ
          size: 10, // Kích thước chữ
          bold: true, // Không in đậm
          italic: false, // Không in nghiêng
          underline: false, // Không gạch chân
          color: { argb: "FFFFFFFF" }, // Màu trắng (ARGB hex)
        },
      };

      // tô màu viền đen
      const blackBorder = {
        style: "thin", // Kiểu đường viền mỏng
        color: { argb: "FF000000" }, // Màu đen (ARGB code)
      };

      // Định nghĩa màu nền
      // màu nền AB1
      const backgroundColorAB1 = {
        type: "pattern",
        pattern: "solid", // Màu nền đơn sắc
        fgColor: { argb: "FFFADEFA" }, // Màu đỏ nhạt (ARGB)
      };
      // màu nền row 2
      const backgroundColorRow2 = {
        type: "pattern",
        pattern: "solid", // Màu nền đơn sắc
        fgColor: { argb: "FF4472C4" }, // Màu xanh nhạt (ARGB)
      };

      // ROW 1
      // AB1
      worksheet.mergeCells("A1:B1");
      worksheet.getCell("A1:B1").value =
        "CHÚ Ý: Những cột màu xanh đậm là bắt buộc phải nhập; Dữ liệu nhập bắt đàu từ dòng thứ 4";
      worksheet.getRow(1).height = 100;
      worksheet.getCell("A1:B1").style.font = myFontsAB1.timesNewRoman;
      worksheet.getCell("A1:B1").fill = backgroundColorAB1;
      worksheet.getCell("A1:B1").alignment = {
        wrapText: true,
        vertical: "top",
        horizontal: "left",
      };
      // C1
      worksheet.getCell("C1").value = {
        text: "Tra cứu tại https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-ho-gia-dinh.aspx",
        hyperlink:
          "https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-ho-gia-dinh.aspx",
        tooltip: "Bấm vào link để xem chi tiết",
      };
      worksheet.getCell("C1").style.font = myFontsC1.timesNewRoman;
      worksheet.getCell("C1").alignment = {
        wrapText: true,
        vertical: "top",
        horizontal: "left",
      };

      // ROW 2
      // Tạo tiêu đề cho dòng thứ 2
      const headerTitles = titleVnptD05.map((item) => item.diengiai); // Lấy giá trị "diengiai"
      const row2 = worksheet.addRow(headerTitles);
      row2.height = 40;
      // Tạo tiêu đề cho dòng thứ 3
      const headerTitlesTitle = titleVnptD05.map((item) => item.tentruong); // Lấy giá trị "tentruong"
      const row3 = worksheet.addRow(headerTitlesTitle);
      row3.height = 30;

      const rowNumber = 2; // Số hàng
      // Tô màu nền cho hàng 2 từ cột `A` đến `BD`
      columnNamesABD.forEach((columnName) => {
        const cell = worksheet.getCell(`${columnName}${rowNumber}`);
        worksheet.getCell(`${columnName}${rowNumber}`).style.font =
          myFontsRow2.timesNewRoman;
        cell.fill = backgroundColorRow2;
      });

      // Đặt chiều rộng, cao và aligment cho tất cả các cột
      const numColumns = headerTitles.length; // Số lượng cột
      for (let i = 1; i <= numColumns; i++) {
        worksheet.getColumn(i).width = 15; // Đặt chiều rộng là 15
        worksheet.getColumn(i).alignment = {
          wrapText: true,
          horizontal: "center", // Căn giữa theo chiều ngang
          vertical: "middle", //middle
        };
      }

      // Đặt lại độ rộng 1 số cột
      worksheet.getColumn("A").width = 10;
      worksheet.getColumn("B").width = 25;
      worksheet.getColumn("B").alignment = {
        horizontal: "left", // Căn giữa theo chiều ngang
        vertical: "middle", //middle
      };
      worksheet.getColumn("C").width = 20;

      // Đặt chiều cao về mặc định cho các dòng từ 4 trở đi
      for (let i = 4; i <= 9999; i++) {
        const row = worksheet.getRow(i);
        row.height = "undefined"; // Đặt chiều cao về mặc định
      }

      // format định dạng text cho các cột từ A-BD và tô viền đen
      columnNamesABD.forEach((columnName) => {
        const column = worksheet.getColumn(columnName);
        // Đặt định dạng văn bản
        column.numFmt = "@";
        // Lặp qua tất cả các dòng và đặt viền cho mỗi ô
        worksheet.eachRow((row, rowNumber) => {
          row.getCell(columnName).border = {
            top: blackBorder,
            bottom: blackBorder,
            left: blackBorder,
            right: blackBorder,
          };
        });
      });

      // xử lý dữ liệu
      // console.log(this.data_xuatmau);
      // Bắt đầu từ dòng 9
      const startRow = 4;

      // Xác định số thứ tự của cột "X"
      const col = "Z";
      const columnIndex = this.columnToIndex(col);
      // console.log(`Cột ${col} là cột thứ:`, columnIndex);

      // Sắp xếp data_execl theo _id tăng dần trước khi ghi
      this.data_execl.sort((a, b) => a._id - b._id);

      // Ghi dữ liệu vào worksheet AR BI
      this.data_execl.forEach((item, index) => {
        const rowNumber = startRow + index; // Dòng hiện tại

        // Thêm hàng dữ liệu vào worksheet
        const row = worksheet.getRow(rowNumber);

        // Gán các trường dữ liệu khác vào các cột tương ứng
        row.getCell(1).value = `${index + 1}`; // Cột A
        row.getCell(2).value = item.hoten; // Cột B
        row.getCell(3).value = item.masobhxh; // Cột C

        // Cột E
        row.getCell(5).value = `${item.maphuongan} - ${item.tenphuongan}`;

        row.getCell(6).value = Number(item.muctiendong); // cột F
        row.getCell(7).value = item.tuthang; // cột g
        row.getCell(8).value = item.maphuongthucdong; // cột H
        row.getCell(9).value = "22"; // cột I

        const doituong = this.doituongdong.find(
          (d) => d.madoituong === item.madoituong
        );
        const tyleHotroTW = doituong ? doituong.tylehotro : 0;
        // console.log(tyleHotroTW);

        // tạm thời làm thủ công sau sửa sau
        // Cột J
        // if (item.madoituong !== null || item.madoituong !== "") {
        //   if (item.madoituong == "BT") {
        //     row.getCell(10).value = "20";
        //   } else if (item.madoituong == "CN") {
        //     row.getCell(10).value = "40";
        //   } else {
        //     row.getCell(10).value = "50";
        //   }
        // }

        row.getCell(10).value = tyleHotroTW.toString();

        // Cột K
        let tienNSNNHT = 0;
        // if (item.madoituong !== null || item.madoituong !== "") {
        //   if (item.madoituong == "BT") {
        //     tienNSNNHT = (((1500000 * 22) / 100) * 20) / 100;
        //     row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
        //   } else if (item.madoituong == "CN") {
        //     tienNSNNHT = (((1500000 * 22) / 100) * 40) / 100;
        //     row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
        //   } else {
        //     tienNSNNHT = (((1500000 * 22) / 100) * 50) / 100;
        //     row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
        //   }
        // }

        if (item.madoituong && tyleHotroTW > 0) {
          const base = 1500000;
          const bhxh = (base * 22) / 100;
          const tienNSNNHT = (bhxh * tyleHotroTW) / 100;

          row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
        } else {
          row.getCell(11).value = 0;
        }

        // cột L % ngân sách địa phương hỗ trợ
        // row.getCell(12).value = "20";
        row.getCell(12).value = this.tylediaphuonghotroIs;

        // cột M
        const tienNSDP = (((1500000 * 22) / 100) * 20) / 100;
        row.getCell(13).value = tienNSDP * item.maphuongthucdong;

        // cột P
        row.getCell(16).value = Number(item.sotien);

        // cột Q
        row.getCell(17).value =
          Number(item.sotien) +
          Number(tienNSDP * item.maphuongthucdong) +
          Number(tienNSNNHT);

        // // row.getCell(7).value = item.tylengansachdiaphuong; // Cột G ngân sách địa phương\
        // row.getCell(7).value = "20"; // để 0 theo quỳnh nói

        // if (item.ngaybienlai !== null || item.ngaybienlai !== "") {
        //   const [datePart] = item.ngaybienlai.split(" ");
        //   const [day, month, year] = datePart.split("-");

        //   const formattedDate = `${day}/${month}/${year}`;

        //   row.getCell(8).value = formattedDate; // Cột H ngày biên lai
        // }
        // row.getCell(9).value = item.sobienlai; // Cột I số biên lai

        // // console.log(item.manguoithu);

        // if (item.manguoithu == null || item.manguoithu == "") {
        //   row.getCell(10).value = "Mặc định";
        //   row.getCell(11).value = item.tienluongcs; // Cột K lương cs
        // } else {
        //   if (item.manguoithu !== 1) {
        //     row.getCell(10).value = item.manguoithu; // Cột J người thứ
        //     // gán luôn cột mức tiền đóng
        //     // console.log(typeof item.tienluongcs);
        //     if (item.manguoithu == 2) {
        //       row.getCell(11).value = "1638000";
        //     } else if (item.manguoithu == 3) {
        //       row.getCell(11).value = "1404000";
        //     } else if (item.manguoithu == 4) {
        //       row.getCell(11).value = "1170000";
        //     } else if (item.manguoithu == 5) {
        //       row.getCell(11).value = "936000";
        //     }
        //   } else {
        //     row.getCell(10).value = "Mặc định";
        //     row.getCell(11).value = item.tienluongcs; // Cột K lương cs
        //   }
        // }

        // row.getCell(12).value = item.sotien; // Cột L tiền thực tế

        // row.getCell(14).value = item.tungay; // Cột N

        row.getCell(18).value = item.tentinh; // Cột R
        row.getCell(19).value = item.matinh; // Cột S
        row.getCell(20).value = item.tenquanhuyen; // Cột T
        row.getCell(21).value = item.maquanhuyen; // Cột U
        row.getCell(22).value = item.tenxaphuong; // Cột V
        row.getCell(23).value = item.maxaphuong; // Cột W

        row.getCell(24).value = item.tothon; // Cột X
        row.getCell(
          25
        ).value = `Số biên lai: ${item.sobienlai}. Người nhập: ${item.tennguoitao}`; // Cột Y
        row.getCell(26).value = item.maphuongthucdong; // Cột Z
        row.getCell(26).value = item.maphuongthucdong;
        row.getCell(28).value = item.cccd; // Cột AB
        // cột AA hệ số
        let mucdong = item.muctiendong || 0;
        let heso = Math.floor((mucdong - 1500000) / 50000);
        heso = heso < 0 ? 0 : heso;
        row.getCell(27).value = heso;

        row.getCell(29).value = item.sobienlai; // Cột AC

        if (item.ngaybienlai !== null || item.ngaybienlai !== "") {
          const [datePart] = item.ngaybienlai.split(" ");
          const [day, month, year] = datePart.split("-");

          const formattedDate = `${day}/${month}/${year}`;

          row.getCell(30).value = formattedDate; // Cột AD ngày biên lai
        }

        const maNhanVienThu = item.sohoso.split("/").pop();
        row.getCell(31).value = `NV${maNhanVienThu}`;

        row.getCell(33).value = item.cccd; // Cột AG
        row.getCell(35).value = item.ngaysinh; // Cột AI
        if (item.gioitinh == "Nam") {
          row.getCell(36).value = "1"; // Cột AJ
        } else {
          row.getCell(36).value = "0"; // Cột AJ
        }

        // Cột AS 45 - AX 50
        row.getCell(45).value = item.tentinh;
        row.getCell(46).value = item.matinh;
        row.getCell(47).value = item.tenquanhuyen;
        row.getCell(48).value = item.maquanhuyen;
        row.getCell(49).value = item.tenxaphuong;
        row.getCell(50).value = item.maxaphuong;

        // Cột AY 51 - BD 56
        row.getCell(51).value = item.tentinh;
        row.getCell(52).value = item.matinh;
        row.getCell(53).value = item.tenquanhuyen;
        row.getCell(54).value = item.maquanhuyen;
        row.getCell(55).value = item.tenxaphuong;
        row.getCell(56).value = item.maxaphuong;

        row.getCell(57).value = item.tennguoitao; // Cột BE
        row.getCell(59).value = item.dienthoai; // Cột BG
        row.getCell(74).value = item.ghichu; // Cột BV

        row.commit(); // Xác nhận thay đổi cho hàng
      });

      // Xuất workbook thành tệp Excel
      const buffer = await workbook.xlsx.writeBuffer();
      // Tạo blob để tải xuống
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Tạo URL để tải xuống
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> để kích hoạt tải xuống
      const a = document.createElement("a");
      a.href = url;
      a.download = "D05_VNPT.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    async exportExcel() {
      const workbook = new ExcelJS.Workbook();

      // Tải file mẫu từ URL hoặc từ input file (tuỳ thuộc môi trường bạn chạy)
      const response = await fetch(`${company.apiBaseURL}/static/d05.xlsx`); // cập nhật đúng đường dẫn tới file mẫu
      const arrayBuffer = await response.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      // console.log("Tên các sheet:", workbook.worksheets.map(s => s.name));

      // Chọn worksheet từ file mẫu
      const worksheet = workbook.getWorksheet("Dữ Liệu"); // hoặc dùng chỉ số: workbook.worksheets[0]

      const startRow = 4;

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
      a.download = "D05_VNPT.xlsx";
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
