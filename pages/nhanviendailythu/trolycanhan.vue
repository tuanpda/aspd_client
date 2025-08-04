<template>
  <div class="column container">
    <div class="control mb-2">
      <span style="color: #0d6efd" class="icon is-small is-left">
        <i class="fab fa-reacteurope"></i>
      </span>
      <span style="font-weight: bold; color: #0d6efd"> Trợ lý cá nhân </span>
    </div>

    <div class="columns" style="margin-top: 10px">
      <div class="box column is-6" style="margin: 5px">
        <span style="color: #6610f2" class="icon is-small is-left">
          <i class="fa fa-bar-chart"></i>
        </span>
        <span style="font-weight: 900; color: #6610f2"
          >Biểu đồ số tiền đã thu</span
        >
        <hr class="navbar-divider" />
        <div class="select is-small">
          <select v-model="selectedYear" @change="fetchData">
            <option v-for="y in years" :key="y" :value="y">Năm {{ y }}</option>
          </select>
        </div>
        <div style="position: relative; height: 300px">
          <canvas ref="chartTongTien"></canvas>
        </div>
      </div>

      <div class="box column is-6" style="margin: 5px">
        <span style="color: #dc3545" class="icon is-small is-left">
          <i class="fa fa-area-chart"></i>
        </span>
        <span style="font-weight: 900; color: #dc3545"
          >Biểu đồ loại hồ sơ đã kê khai</span
        >
        <hr class="navbar-divider" />
        <div class="select is-small">
          <select v-model="selectedYearLoaihinh" @change="fetchLoaihinh">
            <option v-for="y in years" :key="y" :value="y">Năm {{ y }}</option>
          </select>
        </div>
        <div style="position: relative; height: 300px">
          <canvas ref="chartLoaihinh"></canvas>
        </div>
      </div>
    </div>

    <div class="columns" style="margin-top: 10px; margin-bottom: 10px">
      <div class="box column is-6" style="margin: 5px">
        <span style="color: #198754" class="icon is-small is-left">
          <i class="fas fa-paperclip"></i>
        </span>
        <span style="font-weight: 900; color: #198754"
          >Hồ sơ chuẩn bị đến hạn đóng tiếp (dưới 30 ngày)</span
        >
        <hr class="navbar-divider" />
        <div style="margin-top: 10px">
          <span style="font-weight: 500; color: red">Bảo hiểm y tế</span>
        </div>
        <div style="">
          <div class="table_wrapper">
            <table
              class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
            >
              <thead style="font-weight: bold">
                <tr style="font-size: small; background-color: #faf0e6">
                  <td rowspan="2" style="text-align: center">Mã số BHXH</td>
                  <td rowspan="2" style="text-align: center">Người hưởng</td>
                  <td rowspan="2" style="text-align: center">Ngày sinh</td>
                  <td rowspan="2" style="text-align: center">Giới tính</td>
                  <td rowspan="2" style="text-align: center">CCCD</td>
                  <td rowspan="2" style="text-align: center">Điện thoại</td>
                  <td rowspan="2" style="text-align: center">Phương án</td>
                  <td rowspan="2" style="text-align: center">Số tiền</td>
                  <td rowspan="2" style="text-align: center">Từ ngày</td>
                  <td rowspan="2" style="text-align: center">Số tháng</td>
                  <td rowspan="2" style="text-align: center">Mức tiền đóng</td>
                  <td rowspan="2" style="text-align: center">Đến ngày</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="hosodenhanbhyt.length === 0"
                  style="text-align: center; font-style: italic"
                >
                  <td colspan="12">
                    <span style="font-weight: 500; color: red"
                      >Không có dữ liệu</span
                    >
                  </td>
                </tr>
                <tr
                  style="font-size: small"
                  v-for="(item, index) in hosodenhanbhyt"
                  :key="index"
                >
                  <td style="text-align: center">{{ item.masobhxh }}</td>
                  <td style="text-align: center">{{ item.hoten }}</td>
                  <td style="text-align: right">{{ item.ngaysinh }}</td>
                  <td style="text-align: center">{{ item.gioitinh }}</td>
                  <td style="text-align: center">{{ item.cccd }}</td>

                  <td style="text-align: center">{{ item.dienthoai }}</td>
                  <td style="text-align: center">{{ item.maphuongan }}</td>
                  <td style="text-align: right; color: red; font-weight: 700">
                    {{ item.sotien | formatNumber }}
                  </td>
                  <td style="text-align: center">{{ item.tungay }}</td>
                  <td style="text-align: center">
                    {{ item.maphuongthucdong }}
                  </td>

                  <td style="text-align: right; color: red; font-weight: 700">
                    {{ item.muctiendong | formatNumber }}
                  </td>
                  <td style="text-align: center">{{ item.denngay }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- bảo hiểm xã hội -->
        <div style="margin-top: 10px">
          <span style="font-weight: 500; color: red">Bảo hiểm xã hội</span>
        </div>
        <div style="">
          <div class="table_wrapper">
            <table
              class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
            >
              <thead style="font-weight: bold">
                <tr style="font-size: small; background-color: #faf0e6">
                  <td rowspan="2" style="text-align: center">Mã số BHXH</td>
                  <td rowspan="2" style="text-align: center">Người hưởng</td>
                  <td rowspan="2" style="text-align: center">Ngày sinh</td>
                  <td rowspan="2" style="text-align: center">Giới tính</td>
                  <td rowspan="2" style="text-align: center">CCCD</td>
                  <td rowspan="2" style="text-align: center">Điện thoại</td>
                  <td rowspan="2" style="text-align: center">Phương án</td>
                  <td rowspan="2" style="text-align: center">Số tiền</td>
                  <td rowspan="2" style="text-align: center">Từ tháng</td>
                  <td rowspan="2" style="text-align: center">Số tháng</td>
                  <td rowspan="2" style="text-align: center">Mức tiền đóng</td>
                  <td rowspan="2" style="text-align: center">Đến tháng</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="hosodenhanbhyt.length === 0"
                  style="text-align: center; font-style: italic"
                >
                  <td colspan="12">
                    <span style="font-weight: 500; color: red"
                      >Không có dữ liệu</span
                    >
                  </td>
                </tr>
                <tr
                  style="font-size: small"
                  v-for="(item, index) in hosodenhanbhyt"
                  :key="index"
                >
                  <td style="text-align: center">{{ item.masobhxh }}</td>
                  <td style="text-align: center">{{ item.hoten }}</td>
                  <td style="text-align: right">{{ item.ngaysinh }}</td>
                  <td style="text-align: center">{{ item.gioitinh }}</td>
                  <td style="text-align: center">{{ item.cccd }}</td>

                  <td style="text-align: center">{{ item.dienthoai }}</td>
                  <td style="text-align: center">{{ item.maphuongan }}</td>
                  <td style="text-align: right; color: red; font-weight: 700">
                    {{ item.sotien | formatNumber }}
                  </td>
                  <td style="text-align: center">{{ item.tuthang }}</td>
                  <td style="text-align: center">
                    {{ item.maphuongthucdong }}
                  </td>

                  <td style="text-align: right; color: red; font-weight: 700">
                    {{ item.muctiendong | formatNumber }}
                  </td>
                  <td style="text-align: center">{{ item.denthang }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="box column is-6" style="margin: 5px">
        <span style="color: #0d6efd" class="icon is-small is-left">
          <i class="far fa-newspaper"></i>
        </span>
        <span style="font-weight: 900; color: #0d6efd"
          >Phân tích báo cáo tài chính</span
        >
        <hr class="navbar-divider" />

        <div class="field is-grouped mb-2">
          <div class="select is-small">
            <select v-model="selectedMonth" @change="fetchReportCanhan">
              <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
            </select>
          </div>

          <div class="select is-small">
            <select v-model="selectedYear" @change="fetchReportCanhan">
              <option v-for="y in years" :key="y" :value="y">
                Năm {{ y }}
              </option>
            </select>
          </div>
        </div>

        <div class="table_wrapper">
          <table
            class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth mt-2"
          >
            <thead>
              <thead style="font-weight: bold">
                <tr style="font-size: small; background-color: #faf0e6">
                  <td style="text-align: center">Loại hồ sơ</td>
                  <td style="text-align: center">Mã hồ sơ</td>
                  <td style="text-align: center">Số hồ sơ</td>
                  <td style="text-align: center">Loại hình</td>
                </tr>
              </thead>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in reportcanhan"
                :key="index"
                style="font-size: small"
              >
                <td>{{ item.tenloaihinh }}</td>
                <td style="text-align: center">{{ item.maloaihinh }}</td>
                <td style="text-align: center">{{ item.sohoso }}</td>
                <td style="color: red; font-weight: 600">
                  {{ item.tongtien.toLocaleString("vi-VN") }} đ
                </td>
              </tr>
              <tr v-if="reportcanhan.length === 0">
                <td
                  colspan="4"
                  style="text-align: center; font-style: italic; color: #888"
                >
                  Không có dữ liệu
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span>Đang tải dữ liệu...</span>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
const { DateTime } = require("luxon");

export default {
  data() {
    const currentYear = new Date().getFullYear();
    return {
      isLoading: false,
      chartInstance: null,
      chartData: [],
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: currentYear,
      selectedYearLoaihinh: currentYear,
      years: Array.from({ length: 17 }, (_, i) => 2024 + i),
      chartLoaihinhInstance: null,
      loaihinhData: {},

      hosodenhanbhyt: [],
      hosodenhanbhxh: [],
      reportcanhan: {},
    };
  },

  mounted() {
    this.initUser();
    this.fetchData();
    this.fetchLoaihinh();
    this.fetchHosodenhan();
    this.fetchReportCanhan();
  },

  computed: {
    user() {
      return this.$store.state.user || {};
    },
  },

  methods: {
    initUser() {
      const user = this.user;
      this.dailyview = user.madaily;
      this.tochuc = user.matochuc;
      this.cccd = user.cccd;
      this.isRoleSent = user.res_sent;
      this.madaily = user.madaily;
      this.diemthu = user.role === 2 ? "Tài khoản tổng hợp" : user.tendaily;
      this.isDiemthu = user.role !== 2;
    },

    async fetchData() {
      this.isLoading = true;
      const monthlyData = Array(12).fill(0);

      try {
        for (let month = 1; month <= 12; month++) {
          const res = await this.$axios.get(
            `/api/kekhai/baocao-tongtien-theo-daily-thang-nam?nam=${this.selectedYear}&thang=${month}`
          );

          if (res.status === 200 && Array.isArray(res.data.data)) {
            const tong = res.data.data.reduce(
              (sum, item) => sum + parseFloat(item.tongtien || 0),
              0
            );
            monthlyData[month - 1] = tong;
          }
        }

        this.chartData = monthlyData;
        this.$nextTick(() => this.renderChart());
      } catch (error) {
        console.error("Lỗi tải dữ liệu biểu đồ:", error);
      } finally {
        this.isLoading = false;
      }
    },

    renderChart() {
      if (!this.$refs.chartTongTien) return;
      if (this.chartInstance) this.chartInstance.destroy();

      const ctx = this.$refs.chartTongTien.getContext("2d");
      const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Tổng tiền (VNĐ)",
              data: this.chartData,
              backgroundColor: "#dc3545",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          locale: "vi-VN",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `Tổng tiền: ${ctx.parsed.y.toLocaleString("vi-VN")} đ`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => `${parseInt(val).toLocaleString("vi-VN")} đ`,
              },
            },
          },
        },
      });
    },

    async fetchLoaihinh() {
      this.isLoading = true;
      const dataByLoai = {};
      try {
        for (let month = 1; month <= 12; month++) {
          const res = await this.$axios.get(
            `/api/kekhai/baocao-loaihinh-kekhai-theo-thang-nam-daily?nam=${this.selectedYearLoaihinh}&thang=${month}&cccd=${this.cccd}`
          );

          if (res.status === 200) {
            for (const item of res.data.data) {
              if (!dataByLoai[item.maloaihinh]) {
                dataByLoai[item.maloaihinh] = Array(12).fill(0);
              }
              dataByLoai[item.maloaihinh][month - 1] += item.soLuong;
            }
          }
        }
        this.loaihinhData = dataByLoai;
        this.$nextTick(() => this.renderLoaihinhChart());
      } catch (err) {
        console.error("Lỗi tải dữ liệu biểu đồ:", err);
      } finally {
        this.isLoading = false;
      }
    },

    renderLoaihinhChart() {
      if (!this.$refs.chartLoaihinh) return;
      if (this.chartLoaihinhInstance) this.chartLoaihinhInstance.destroy();

      const ctx = this.$refs.chartLoaihinh.getContext("2d");
      const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

      const datasets = Object.entries(this.loaihinhData).map(
        ([label, data], i) => ({
          label,
          data,
          backgroundColor: `hsl(${(i * 60) % 360}, 70%, 60%)`,
        })
      );

      this.chartLoaihinhInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} hồ sơ`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                stepSize: 1,
                callback: (val) => (Number.isInteger(val) ? val : null),
              },
            },
          },
        },
      });
    },

    async fetchHosodenhan() {
      this.isLoading = true;

      try {
        const res = await this.$axios.get(
          `/api/kekhai/hosocanhbaodenhanbhyt?cccd=${this.cccd}`
        );
        // console.log(res.data.hs);
        this.hosodenhanbhyt = res.data.hs;

        const resbhxh = await this.$axios.get(
          `/api/kekhai/hosocanhbaodenhanbhxh?cccd=${this.cccd}`
        );
        // console.log(resbhxh.data.hs);
        this.hosodenhanbhxh = resbhxh.data.hs;
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReportCanhan() {
      this.isLoading = true;
      console.log(this.selectedMonth);
      console.log(this.selectedYear);
      try {
        const res = await this.$axios.get(`/api/kekhai/baocaotaichinhcanhan`, {
          params: {
            cccd: this.cccd,
            thang: this.selectedMonth,
            nam: this.selectedYear,
          },
        });
        // console.log(res);

        this.reportcanhan = res.data.hs;
      } catch (error) {
        console.error("Lỗi tải dữ liệu báo cáo tài chính:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/customCss/common.css";

.equal-box {
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.table_wrapper {
  max-height: 300px; /* Giới hạn chiều cao */
}
</style>
