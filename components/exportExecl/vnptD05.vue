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
      <span>Xuất D05</span>
    </button>
  </div>
</template>
<script>
const countries = require("../../data/countries");
const dantoc = require("../../data/dantoc");
const reles = require("../../data/moiquanhe");
const mhbhyt = require("../../data/muchuongbhyt");
const titleVnptD05 = require("../../data/titleVnptD05");

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

    async exportExcel() {
      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();
      // Tạo worksheet mới
      const worksheet = workbook.addWorksheet("Dữ Liệu", {
        views: [{ state: "frozen", xSplit: 3, ySplit: 3 }],
      });

      // 1. TẠO CÁC SHEET PHỤ LỤC 1 BÊN
      // Tạo worksheet DM Quốc tịch
      // console.log(countries);
      const worksheetDmQt = workbook.addWorksheet("DM Quốc tịch");
      worksheetDmQt.columns = [
        { header: "Mã quốc gia", key: "code", width: 15 }, // Cột 1
        { header: "Tên Quốc gia/ Vùng lãnh thổ", key: "name", width: 30 }, // Cột 2 với chiều rộng 30
      ];
      // Tô màu cho tiêu đề
      const headerRow = worksheetDmQt.getRow(1); // Lấy hàng tiêu đề
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" }, // Màu xanh nước biển nhạt
        };
      });
      // Căn giữa tiêu đề
      headerRow.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center", // Căn giữa theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      // Tạo các hàng từ dữ liệu JSON
      countries.forEach((country) => {
        const row = worksheetDmQt.addRow([country.code, country.name]); // Thêm từng hàng vào Excel
        // Chỉ căn giữa cột đầu tiên
        row.getCell(1).alignment = {
          horizontal: "center", // Căn giữa dữ liệu theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      worksheetDmQt.autoFilter = {
        from: "A1",
        to: "B1",
      };

      // Tạo worksheet DM dân tộc
      // console.log(dantoc);
      const worksheetDmDt = workbook.addWorksheet("Dân tộc");
      worksheetDmDt.columns = [
        { header: "Mã dân tộc", key: "id", width: 15 }, // Cột 1
        { header: "Tên dân tộc", key: "name", width: 30 }, // Cột 2 với chiều rộng 30
      ];
      // Tô màu cho tiêu đề
      const headerRowdt = worksheetDmDt.getRow(1); // Lấy hàng tiêu đề
      headerRowdt.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" }, // Màu xanh nước biển nhạt
        };
      });
      // Căn giữa tiêu đề
      headerRowdt.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center", // Căn giữa theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      // Tạo các hàng từ dữ liệu JSON
      dantoc.forEach((dt) => {
        const row = worksheetDmDt.addRow([dt.id, dt.name]); // Thêm từng hàng vào Excel
        // Chỉ căn giữa cột đầu tiên
        row.getCell(1).alignment = {
          horizontal: "center", // Căn giữa dữ liệu theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      worksheetDmDt.autoFilter = {
        from: "A1",
        to: "B1",
      };

      // Tạo worksheet DM mối quan hệ
      const worksheetDmMqh = workbook.addWorksheet("Mối quan hệ");
      worksheetDmMqh.columns = [
        { header: "Mã mối quan hệ", key: "code", width: 20 }, // Cột 1
        { header: "Mối quan hệ", key: "name", width: 30 }, // Cột 2 với chiều rộng 30
      ];
      // Tô màu cho tiêu đề
      const headerRowmqh = worksheetDmMqh.getRow(1); // Lấy hàng tiêu đề
      headerRowmqh.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" }, // Màu xanh nước biển nhạt
        };
      });
      // Căn giữa tiêu đề
      headerRowmqh.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center", // Căn giữa theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      // Tạo các hàng từ dữ liệu JSON
      reles.forEach((dt) => {
        const row = worksheetDmMqh.addRow([dt.code, dt.name]); // Thêm từng hàng vào Excel
        // Chỉ căn giữa cột đầu tiên
        row.getCell(1).alignment = {
          horizontal: "center", // Căn giữa dữ liệu theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      worksheetDmMqh.autoFilter = {
        from: "A1",
        to: "B1",
      };

      // Tạo worksheet DM mức hưởng bhyt
      const worksheetDmMhbhyt = workbook.addWorksheet("Mức hưởng BHYT");
      worksheetDmMhbhyt.columns = [
        { header: "Mã", key: "code", width: 15 }, // Cột 1
        { header: "Diễn giải", key: "name", width: 100 }, // Cột 2 với chiều rộng 30
      ];
      // Tô màu cho tiêu đề
      const headerRowMhbhyt = worksheetDmMhbhyt.getRow(1); // Lấy hàng tiêu đề
      headerRowMhbhyt.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" }, // Màu xanh nước biển nhạt
        };
      });
      // Căn giữa tiêu đề
      headerRowMhbhyt.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center", // Căn giữa theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
      });
      // Tạo các hàng từ dữ liệu JSON
      mhbhyt.forEach((dt) => {
        const row = worksheetDmMhbhyt.addRow([dt.code, dt.name]); // Thêm từng hàng vào Excel
        // Chỉ căn giữa cột đầu tiên
        row.getCell(1).alignment = {
          horizontal: "center", // Căn giữa dữ liệu theo chiều ngang
          vertical: "middle", // Căn giữa theo chiều dọc (tùy chọn)
        };
        row.getCell(2).alignment = {
          wrapText: true, // Bọc văn bản để tránh tràn nội dung
        };
      });
      worksheetDmMhbhyt.autoFilter = {
        from: "A1",
        to: "B1",
      };

      // Tạo worksheet DM DMHC
      const worksheetDmDmhc = workbook.addWorksheet("DMHC");
      worksheetDmDmhc.getCell("A1").value = {
        text: "Tra cứu danh mục hành chính, bệnh viện",
        hyperlink:
          "http://viettel-ca.vn/download/soft/danh_muc_hanh_chinh.xlsx",
        tooltip: "Download từ trang chủ của Viettel",
      };
      worksheetDmDmhc.getCell("A1").font = {
        underline: true, // Gạch dưới
        color: { argb: "0000FF" }, // Màu xanh lam
      };
      worksheetDmDmhc.getColumn(1).width = 60;

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
      row3.height = 1;

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
        row.getCell(6).value = `${item.maphuongan} - ${item.tenphuongan}`;

        row.getCell(6).value = Number(item.muctiendong); // cột F
        row.getCell(7).value = item.tuthang; // cột g
        row.getCell(8).value = item.maphuongthucdong; // cột H
        row.getCell(9).value = "22"; // cột I

        // tạm thời làm thủ công sau sửa sau
        // Cột J
        if (item.madoituong !== null || item.madoituong !== "") {
          if (item.madoituong == "BT") {
            row.getCell(10).value = "10";
          } else if (item.madoituong == "CN") {
            row.getCell(10).value = "25";
          } else {
            row.getCell(10).value = "30";
          }
        }

        // Cột K
        if (item.madoituong !== null || item.madoituong !== "") {
          if (item.madoituong == "BT") {
            const tienNSNNHT = (((1500000 * 22) / 100) * 10) / 100;
            row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
          } else if (item.madoituong == "CN") {
            const tienNSNNHT = (((1500000 * 22) / 100) * 25) / 100;
            row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
          } else {
            const tienNSNNHT = (((1500000 * 22) / 100) * 30) / 100;
            row.getCell(11).value = tienNSNNHT * item.maphuongthucdong;
          }
        }

        // cột L
        row.getCell(12).value = "20";

        // cột M
        const tienNSDP = (((1500000 * 22) / 100) * 20) / 100;
        row.getCell(13).value = tienNSDP * item.maphuongthucdong;

        // cột P
        row.getCell(16).value = item.sotien;

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
        row.getCell(31).value = `NV${maNhanVienThu}`; // Cột AE

        row.getCell(33).value = item.cccd; // Cột AG
        row.getCell(35).value = item.ngaysinh; // Cột AI
        if (item.gioitinh == "Nam") {
          row.getCell(36).value = "1"; // Cột AJ
        } else {
          row.getCell(36).value = "0"; // Cột AJ
        }

        row.getCell(57).value = item.tennguoitao; // Cột BE
        row.getCell(59).value = item.dienthoai; // Cột BG

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
      a.download = `D05_VNPT.xlsx`;
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
