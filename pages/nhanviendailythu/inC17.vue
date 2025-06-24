<template>
  <div class="column">
    <div class="box">
      <div class="columns">
        <div class="column">
          <div class="control">
            <span style="color: #198754" class="icon is-small is-left">
              <i class="fas fa-money-bill-alt"></i>
            </span>
            <span style="font-weight: bold; color: #198754">In C17</span>
          </div>
        </div>
      </div>

      <div class="box">
        <div class="columns">
          <div class="column">
            <label class="label">Ngày kê khai (từ)</label
            ><input v-model="ngaykekhaitu" type="date" class="input is-small" />
          </div>
          <div class="column">
            <label class="label">Ngày kê khai (đến)</label
            ><input
              v-model="ngaykekhaiden"
              type="date"
              class="input is-small"
            />
          </div>
        </div>
        <hr class="navbar-divider" />
        <footer class="has-text-right">
          <div class="buttons is-right">
            <button @click="filterData(1)" class="button is-success is-small">
              <span class="icon">
                <i class="fas fa-search"></i>
              </span>
              <span>Tìm kiếm hồ sơ</span>
            </button>

            <button
              :disabled="user.role !== 2"
              @click="xuatC17()"
              class="button is-small is-danger"
            >
              <span class="icon">
                <i class="fab fa-amazon-pay"></i>
              </span>
              <span>Xuất C17</span>
            </button>
          </div>
        </footer>
      </div>

      <div style="margin-top: 20px">
        <div class="table_wrapper">
          <table
            class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
          >
            <thead style="font-weight: bold">
              <tr style="font-size: small; background-color: #faf0e6">
                <td rowspan="2" style="text-align: center; width: 3%">STT</td>
                <td rowspan="2" style="text-align: center">_ID</td>
                <td
                  style="text-align: center; cursor: pointer"
                  @click="sortByField('trangthai')"
                >
                  Trạng thái
                  <span v-if="sortBy === 'trangthai'">
                    <i v-if="!sortDesc" class="fas fa-sort-up"></i>
                    <i v-else class="fas fa-sort-down"></i>
                  </span>
                </td>

                <td style="text-align: center">Biên lai</td>
                <td rowspan="2" style="text-align: center">Ngày biên lai</td>
                <td rowspan="2" style="text-align: center">Số biên lai</td>
                <td rowspan="2" style="text-align: center">Mã số BHXH</td>
                <td rowspan="2" style="text-align: center">Số tiền</td>
              </tr>
            </thead>
            <tbody>
              <tr
                style="font-size: small"
                v-for="(item, index) in data_kekhai"
                :key="index"
              >
                <td style="text-align: center">{{ index + 1 }}</td>
                <td style="text-align: center">{{ item._id }}</td>
                <td style="text-align: center">
                  <template v-if="item.trangthai === 1">
                    <span style="font-weight: 700; color: #ffc107"
                      >Đã huỷ duyệt</span
                    ></template
                  >
                  <template v-else>
                    <template v-if="item.status_naptien == true">
                      <span style="font-weight: 700; color: #00947e"
                        >Đã duyệt</span
                      >
                    </template>
                    <template v-else>
                      <span style="font-weight: 700; color: #dc3545"
                        >Chưa duyệt</span
                      >
                    </template>
                  </template>
                </td>
                <td style="text-align: center">
                  <a @click="xemBienLai(item)">
                    <span style="color: #ff69b4" class="icon is-small is-left">
                      <i class="fas fa-print"></i>
                    </span>
                  </a>
                </td>

                <td style="text-align: center">{{ item.ngaybienlai }}</td>
                <td style="text-align: center">{{ item.sobienlai }}</td>
                <td style="text-align: center">{{ item.masobhxh }}</td>
                <td style="text-align: center">
                  {{ item.sotien | formatNumber }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin: 5px; font-weight: 700; color: #dc3545">
          Tổng tiền: {{ totalSoTien | formatNumber }}
        </div>
        <!-- Phân trang -->
        <div v-if="data_kekhai.length > 0" style="margin-top: 10px">
          <nav
            class="pagination is-centered is-rounded"
            role="navigation"
            aria-label="pagination"
          >
            <!-- Nút trang đầu tiên -->
            <button
              :disabled="currentPage === 1"
              @click="goToPage(1)"
              class="pagination-previous button is-info is-light is-small"
            >
              Đầu tiên
            </button>

            <!-- Nút Previous -->
            <button
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
              class="pagination-previous button is-info is-light is-small"
            >
              Trang trước
            </button>

            <!-- Nút Next -->
            <button
              :disabled="currentPage === totalPages"
              @click="goToNextPage"
              class="pagination-next button is-danger is-light is-small"
            >
              Trang tiếp
            </button>

            <!-- Nút trang cuối cùng -->
            <button
              :disabled="currentPage === totalPages"
              @click="goToPage(totalPages)"
              class="pagination-next button is-danger is-light is-small"
            >
              Cuối cùng
            </button>

            <ul class="pagination-list">
              <!-- Hiển thị các nút phân trang -->
              <li v-for="page in visiblePages" :key="page">
                <button
                  :class="[
                    'pagination-link',
                    { 'is-current': page === currentPage },
                    'is-small',
                  ]"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
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
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
const { DateTime } = require("luxon");
import { saveAs } from "file-saver";

export default {
  data() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    return {
      data_kekhai: [],
      data_xuatmau: [],
      isActive: false,
      isActive_detail: false,
      isActive_fix: false,
      isVtVnpt: false,

      // pagi
      currentPage: 1,
      totalPages: 1,

      // new code
      kykekhai: "",
      dotkekhai: "",
      ngaykekhaiden: today,
      ngaykekhaitu: today,
      sohoso: "",
      matochuc_mst: "",
      masobhxh: "",
      hoten: "",
      maloaihinh: "",
      trangthaihs: "",
      cccd: "",
      sortBy: null, // ví dụ: 'trangthai'
      sortDesc: false, // true = giảm dần, false = tăng dần

      data_kekhai_details: [],
      isRoleSent: false,

      // input suggest
      suggestions: [],
      suggestions_diemthu: [],
      diemthu: "",
      madaily: "",
      isDiemthu: false,

      dtaDiemthu: [],
      listhsloi: [],
      selectedItem: {},

      editKey: 0,

      selectedItems: [], // chứa danh sách các dòng đã được chọn
      selectedItems_execl_export: [], // ds xuất execl
      selectAll: false,
      selectAll_execl: false,

      dulieuPheduyet: [],
      dulieuHuyPheDuyet: [],
      isLoading: false,
      isExport: false,
    };
  },

  // mounted() {
  //   this.getDateTime();
  //   this.getDmDiemthu();
  //   this.isRoleSent = this.$auth.user.res_sent;
  //   // console.log(this.$auth.user.res_sent);
  //   if (this.$auth.user.nvcongty == 0) {
  //     this.madaily = this.$auth.user.madaily;
  //     this.diemthu = this.$auth.user.tendaily;
  //     this.isDiemthu = true;
  //   }
  // },

  watch: {
    selectedItems(newVal) {
      this.selectAll = newVal.length === this.data_kekhai.length;
    },
  },

  mounted() {
    const user = this.user;

    this.dailyview = user.madaily;
    this.tochuc = user.matochuc;
    if (user.role == 2) {
      this.diemthu = "Tài khoản tổng hợp";
      // console.log(this.diemthu);
      // console.log(user.role);
    } else {
      this.diemthu = user.tendaily;
    }
    this.isRoleSent = user.res_sent;

    if (user.nvcongty == 0) {
      this.madaily = user.madaily;
      this.diemthu = user.tendaily;
      this.cccd = user.cccd;
      this.isDiemthu = true;
    }

    this.getDateTime();
    this.getDmDiemthu();
    this.hosoLoitrave();
  },

  computed: {
    user() {
      return this.$store.state.user || {};
    },

    totalSoTien() {
      if (this.data_kekhai && this.data_kekhai.length > 0) {
        return this.data_kekhai
          .filter(
            (item) => item.trangthai === 0 && item.status_naptien === true
          )
          .reduce((acc, item) => {
            const sotienStr = item.sotien?.toString().replace(/,/g, "");
            let numericValue = parseFloat(sotienStr);
            if (isNaN(numericValue)) {
              numericValue = 0;
            }
            return acc + numericValue;
          }, 0);
      }
      return 0;
    },

    visiblePages() {
      const pages = [];
      const maxVisiblePages = 5; // Số lượng trang hiển thị tối đa

      // Xác định phạm vi của các trang hiển thị
      let startPage = Math.max(
        1,
        this.currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
  },

  methods: {
    sortByField(field) {
      if (this.sortBy === field) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortBy = field;
        this.sortDesc = false;
      }

      this.data_kekhai.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return this.sortDesc ? 1 : -1;
        if (aValue > bValue) return this.sortDesc ? -1 : 1;
        return 0;
      });
    },

    toggleAll() {
      if (this.selectAll) {
        // Chỉ chọn các item có trangthai = 0 và status_naptien = false
        this.selectedItems = this.data_kekhai.filter(
          (item) => item.trangthai === 0 && item.status_naptien === false
        );
      } else {
        // Bỏ chọn tất cả
        this.selectedItems = [];
      }
    },

    toggleAll_execl() {
      if (this.selectAll_execl) {
        this.selectedItems_execl_export = this.data_kekhai;
      } else {
        // Bỏ chọn tất cả
        this.selectedItems_execl_export = [];
      }

      // console.log(this.selectedItems_execl_export);
    },

    handleClick(item) {
      if (item.status_hosoloi !== 1) return;
      this.vieweditHs(item);
    },
    // suggest điểm thu
    onInput() {
      if (!this.diemthu) {
        this.suggestions = [];
        return;
      }
      const MAX_SUGGESTIONS = 5; // Số lượng suggest tối đa
      this.suggestions = this.dtaDiemthu
        .map((c) => c.tenDiemThu)
        .filter((tenDiemThu) =>
          tenDiemThu.toLowerCase().includes(this.diemthu.toLowerCase())
        )
        .map((tenDiemThu) => tenDiemThu.trim())
        .slice(0, MAX_SUGGESTIONS);
    },
    selectSuggestion(suggestion) {
      if (suggestion) {
        this.diemthu = suggestion.trim();
        this.suggestions = [];
      }
    },
    // end suggest điểm thu

    validateMonthYear() {
      const regex = /^(0[1-9]|1[0-2])\/\d{4}$/; // Định dạng MM/YYYY
      if (!regex.test(this.kykekhai)) {
        this.kykekhai = ""; // Xóa giá trị nếu không đúng định dạng
        alert("Định dạng không đúng. Vui lòng nhập MM/YYYY.");
      }
    },

    async getDmDiemthu() {
      const res = await this.$axios.get(`/api/kekhai/danhmucdaily`);
      // console.log(res);
      this.dtaDiemthu = res.data;
    },

    formatCurrency(text) {
      const number = parseFloat(text);
      return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },

    formatISODateToDMY(isoDateString) {
      const date = new Date(isoDateString);

      // Lấy ngày, tháng và năm từ đối tượng Date
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      // Tạo chuỗi ngày tháng dd/mm/yyyy
      const formattedDate = `${day}/${month}/${year}`;

      return formattedDate;
    },

    getDateTime() {
      const nowInVietnam = DateTime.now().setZone("Asia/Ho_Chi_Minh");
      const kyKeKhai = nowInVietnam.toFormat("MM/yyyy");

      // Lấy các phần tử riêng lẻ
      const year = nowInVietnam.year; // Năm
      const month = nowInVietnam.month; // Tháng
      const day = nowInVietnam.day; // Ngày
      const hour = nowInVietnam.hour; // Giờ
      const minute = nowInVietnam.minute; // Phút
      const second = nowInVietnam.second; // Giây

      this.kykekhai = kyKeKhai;
    },

    async hosoLoitrave() {
      const madaily = { madaily: this.dailyview };
      try {
        const res = await this.$axios.post(
          `/api/kekhai/hosoloitrave-diemthu`,
          madaily
        );
        // console.log(res);
        if (res.data.success == true) {
          this.listhsloi = res.data.hs;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async view_details(data) {
      this.data_kekhai_details = [];

      const rs = await this.$axios.get(
        `/api/kekhai/get-all-kekhai-xuatmau?sohoso=${data.sohoso}`
      );
      // console.log(rs.data.kekhai);
      this.data_kekhai_details = rs.data.kekhai;
      this.data_kekhai_details = this.data_kekhai_details.map((item) => ({
        ...item,
        isSent: false, // Gán trạng thái gửi mặc định là chưa gửi
      }));
      this.isActive_detail = true;
    },

    calculateEndDate(tuNgay, soThang) {
      // Chuyển đổi tuNgay từ chuỗi "dd/mm/yyyy" sang đối tượng Date
      const [day, month, year] = tuNgay.split("/").map(Number);
      let startDate = new Date(year, month - 1, day); // Month in Date is 0-based

      // Cộng thêm số tháng vào ngày bắt đầu
      startDate.setMonth(startDate.getMonth() + Number(soThang));

      // Trừ một ngày để có ngày cuối cùng của tháng trước tháng kết thúc
      startDate.setDate(startDate.getDate() - 1);

      // Lấy ngày, tháng, năm của ngày kết thúc
      let endDay = String(startDate.getDate()).padStart(2, "0");
      let endMonth = String(startDate.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
      let endYear = startDate.getFullYear();

      // Trả về ngày kết thúc dưới dạng "dd/mm/yyyy"
      return `${endDay}/${endMonth}/${endYear}`;
    },

    async handleChange(event) {
      const selectedValue = event.target.value; // Lấy giá trị của option được chọn
      // console.log("Selected value:", selectedValue);
      if (selectedValue === "") {
        this.maloaihinh = selectedValue;
        this.isExport = false; // Không xuất khi không có loại hình nào được chọn
      } else {
        this.maloaihinh = selectedValue;
        this.isExport = true;
      }

      // console.log(this.maloaihinh);
      // console.log(this.isExport);
    },

    async handleTrangThaiChange(event) {
      const selectedValue = event.target.value; // Lấy giá trị của option được chọn
      // console.log("Selected value:", selectedValue);
      this.trangthaihs = selectedValue;
      // console.log(this.trangthaihs);
    },

    xuatC17() {
      // Bước 1: Chuẩn bị dữ liệu
      const data = this.data_kekhai.map((item) => {
        const sotien = item.sotien || 0;
        const isBHXH = ["IS", "IL"].includes(item.maloaihinh);
        const isBHYT = ["AR", "BI"].includes(item.maloaihinh);

        const ngaybienlai = item.ngaybienlai
        ? item.ngaybienlai.split(" ")[0] // Lấy phần "23-06-2025"
        : "";

        return {
          matochuc: item.matochuc,
          madaily: item.madaily,
          manhanvienthu: "NV" + item.sohoso.slice(-12),
          ngaybienlai: ngaybienlai,
          sobienlai: item.sobienlai,
          masobhxh: item.masobhxh,
          sotien_bhxh: isBHXH ? sotien.toLocaleString("vi-VN") : "",
          sotien_bhyt: isBHYT ? sotien.toLocaleString("vi-VN") : "",
          ghichu: "",
        };
      });

      // Bước 2: Tiêu đề cột
      const customHeader = [
        "Mã Tổ chức dịch vụ",
        "Mã điểm thu",
        "Mã nhân viên thu",
        "Ngày biên lai",
        "Số biên lai",
        "Mã số BHXH người tham gia",
        "Tiền thu BHXH TN",
        "Tiền thu BHYT HGĐ",
        "Ghi chú",
      ];

      // Bước 3: Tạo file Excel
      const worksheet = XLSX.utils.json_to_sheet(data, {
        header: [
          "matochuc",
          "madaily",
          "manhanvienthu",
          "ngaybienlai",
          "sobienlai",
          "masobhxh",
          "sotien_bhxh",
          "sotien_bhyt",
          "ghichu",
        ],
        skipHeader: true,
      });

      const formatCurrency = (val) =>
        val && !isNaN(val) ? Number(val).toLocaleString("vi-VN") : "";

      const total_bhxh = data.reduce(
        (sum, item) =>
          sum + (parseInt(item.sotien_bhxh.replace(/,/g, "")) || 0),
        0
      );
      const total_bhyt = data.reduce(
        (sum, item) =>
          sum + (parseInt(item.sotien_bhyt.replace(/,/g, "")) || 0),
        0
      );

      // Bước 4: Ghi tiêu đề tùy chỉnh vào hàng đầu tiên
      XLSX.utils.sheet_add_aoa(worksheet, [customHeader], { origin: "A1" });

      // Bước 5: Tạo file Excel
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "C17");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileName = `C17_${new Date().getTime()}.xlsx`;
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(dataBlob, fileName);
    },

    async filterData(page) {
      // console.log(this.data_kekhai);
      // console.log(this.$auth.user);
      // Tách chuỗi theo dấu gạch ngang
      // const parts = this.tochuc.split("-");
      // const mst = parts[parts.length - 1]; // 2902141757
      // this.matochuc_mst = mst;
      // Xây dựng đường dẫn API dựa trên mã số thuế

      if (this.user.role == 2) {
        this.trangthaihs = "dapheduyet";
        // const res = await this.$axios.get(
        //   `/api/kekhai/kykekhai-search-series-pagi-nvcty?kykekhai=${this.kykekhai}&page=${page}`
        // );
        try {
          // const res = await this.$axios.get(
          //   `/api/kekhai/kykekhai-search-hoso?kykekhai=${this.kykekhai}&dotkekhai=${this.dotkekhai}&ngaykekhai=${this.ngaykekhaitu}&ngaykekhaiden=${this.ngaykekhaiden}&sohoso=${this.sohoso}&masobhxh=${this.masobhxh}&hoten=${this.hoten}&tendaily=${this.diemthu}&maloaihinh=${this.maloaihinh}&page=${page}`
          // );
          // tạm thời bỏ điểm thu ra code ngày 07/5/2025. code sửa ngày 18/06/2025 bỏ kỳ kê khai ra khỏi thành phần tìm kiếm. thay vào đó là
          // trạng thái hồ sơ. đẩy query tên trangthaihs (đại diện thay cho trangthai và status_naptien)
          const res = await this.$axios.get(
            `/api/kekhai/kykekhai-search-hoso?trangthaihs=${this.trangthaihs}&dotkekhai=${this.dotkekhai}&ngaykekhai=${this.ngaykekhaitu}&ngaykekhaiden=${this.ngaykekhaiden}&sohoso=${this.sohoso}&masobhxh=${this.masobhxh}&hoten=${this.hoten}&maloaihinh=${this.maloaihinh}&page=${page}`
          );
          // console.log(res);
          if (res.data.results.length > 0) {
            this.data_kekhai = res.data.results;
            this.totalPages = res.data.info.pages;
            this.currentPage = page;
          } else {
            this.data_kekhai = [];
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: "error",
              title: `Không tìm thấy hồ sơ`,
            });
          }
        } catch (error) {
          this.data_kekhai = [];
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "error",
            title: `Có lỗi xảy ra`,
          });
        }
      } else {
        try {
          const res = await this.$axios.get(
            `/api/kekhai/kykekhai-search-hoso-diemthu?cccd=${this.cccd}&trangthaihs=${this.trangthaihs}&dotkekhai=${this.dotkekhai}&ngaykekhai=${this.ngaykekhaitu}&ngaykekhaiden=${this.ngaykekhaiden}&sohoso=${this.sohoso}&masobhxh=${this.masobhxh}&hoten=${this.hoten}&madaily=${this.madaily}&maloaihinh=${this.maloaihinh}&page=${page}`
          );
          if (res.data.results.length > 0) {
            this.data_kekhai = res.data.results;
            this.totalPages = res.data.info.pages;
            this.currentPage = page;
          } else {
            this.data_kekhai = [];
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: "error",
              title: `Không tìm thấy hồ sơ`,
            });
          }
        } catch (error) {
          this.data_kekhai = [];
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "error",
            title: `Có lỗi xảy ra`,
          });
        }
      }
    },

    // pagi
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.filterData(this.currentPage - 1);
      }
    },

    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.filterData(this.currentPage + 1);
      }
    },

    goToPage(page) {
      this.filterData(page); // Di chuyển đến trang được chỉ định
    },

    async xemBienLai(item) {
      // console.log(item.hosoIdentity);

      try {
        const res = await this.$axios.get(
          `/api/kekhai/view-item-bienlai?hosoIdentity=${item.hosoIdentity}`
        );

        // console.log(res);

        const hs = res.data.hs;
        if (hs && hs.urlNameInvoice) {
          const fileName = `${hs.sobienlai}_${encodeURIComponent(
            hs.hoten
          )}.pdf`;
          const pdfUrl = `http://14.224.148.17:4042/bienlaidientu/daky/${hs.urlNameInvoice}.pdf`;
          // const pdfUrl = `http://localhost:1970/bienlaidientu/${hs.urlNameInvoice}.pdf`;
          console.log(pdfUrl);

          window.open(pdfUrl, "_blank");
        } else {
          console.warn("Thiếu thông tin số biên lai hoặc họ tên!");
          this.$swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không lấy được thông tin biên lai.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        this.$swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể kết nối đến máy chủ.",
        });
      }
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

.is-disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
