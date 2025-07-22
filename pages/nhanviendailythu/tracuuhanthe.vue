<template>
  <div class="column">
    <div class="box">
      <!-- Header -->
      <div class="columns">
        <div class="column">
          <div class="control">
            <span style="color: #198754" class="icon is-small is-left">
              <i class="far fa-calendar-alt"></i>
            </span>
            <span style="font-weight: bold; color: #198754">
              Tra cứu hạn thẻ
            </span>
          </div>
        </div>
      </div>

      <!-- Search Box -->
      <div class="box">
        <div class="columns">
          <div class="column">
            <label class="label">Loại hình</label>
            <div class="select is-small is-fullwidth">
              <select v-model="loaihinh" @change="handleChange">
                <option disabled value="">- Chọn loại hình -</option>
                <option value="bhyt">Bảo hiểm y tế</option>
                <option value="bhxh">Bảo hiểm xã hội</option>
              </select>
            </div>
          </div>
          <div class="column">
            <label class="label">Mã số BHXH</label>
            <input
              v-model="soSoBhxh"
              type="text"
              class="input is-small"
              placeholder="Nhập vào mã số BHXH cần tìm kiếm"
              @keyup.enter="findHanthe"
            />
          </div>
        </div>

        <hr class="navbar-divider" />

        <footer class="has-text-right">
          <button @click="findHanthe" class="button is-success is-small">
            <span class="icon">
              <i class="fas fa-search"></i>
            </span>
            <span>Tìm kiếm</span>
          </button>
        </footer>
      </div>

      <!-- Kết quả -->
      <div class="table_wrapper" style="margin-top: 20px">
        <table
          class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
        >
          <thead style="font-weight: bold">
            <tr style="font-size: small; background-color: #faf0e6">
              <td style="text-align: center; width: 3%">STT</td>
              <td style="text-align: center">Mã số BHXH</td>
              <td style="text-align: center">Họ tên</td>
              <td style="text-align: center">Ngày sinh</td>
              <td style="text-align: center">Số điện thoại</td>
              <td style="text-align: center">Giới tính</td>
              <td style="text-align: center">
                {{ loaihinh === "bhyt" ? "Hạn thẻ" : "Đã đóng đến tháng" }}
              </td>
              <td v-if="loaihinh === 'bhyt'" style="text-align: center">
                Nơi khám sức khỏe ban đầu
              </td>
              <td style="text-align: center">Tỉnh</td>
              <td style="text-align: center">Huyện</td>
              <td style="text-align: center">Xã</td>
              <td style="text-align: center">Địa chỉ</td>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in dulieuthe"
              :key="index"
              style="font-size: small"
            >
              <td style="text-align: center">{{ index + 1 }}</td>
              <td style="text-align: center">{{ item.masobhxh }}</td>
              <td style="text-align: center">{{ item.hoten }}</td>
              <td style="text-align: center">{{ item.ngaysinh }}</td>
              <td style="text-align: center">{{ item.sodienthoai }}</td>
              <td style="text-align: center">
                {{ item.gioitinh === 1 ? "Nữ" : "Nam" }}
              </td>
              <td style="text-align: center">
                {{ loaihinh === "bhyt" ? item.hanthecu : item.tuthang }}
              </td>
              <td v-if="loaihinh === 'bhyt'" style="text-align: center">
                {{ item.benhvien.tenbenhvien }}
              </td>
              <td style="text-align: center">{{ item.tinh.tentinh }}</td>
              <td style="text-align: center">{{ item.quanhuyen.tenhuyen }}</td>
              <td style="text-align: center">{{ item.xa.tenxa }}</td>
              <td style="text-align: left">{{ item.diaChi }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <span class="loading-text">
              Đang lấy thông tin dữ liệu, xin chờ trong giây lát ...
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
const { DateTime } = require("luxon");

export default {
  data() {
    return {
      isLoading: false,
      hoTen: "",
      soSoBhxh: "",
      dulieuthe: [],
      loaihinh: "",
    };
  },

  computed: {
    user() {
      return this.$store.state.user || {};
    },
  },

  methods: {
    async handleChange(event) {
      this.dulieuthe = [];
    },

    async findHanthe() {
      if (!this.soSoBhxh) return;

      if (!this.loaihinh) {
        Swal.fire({ text: "Phải chọn loại hình!", icon: "error" });
        return;
      }

      try {
        const dataFind = { masobhxh: this.soSoBhxh };
        this.isLoading = true;

        let res_data;
        if (this.loaihinh === "bhyt") {
          res_data = await this.$axios.post(`/api/kekhai/getinfo`, dataFind);
        } else {
          res_data = await this.$axios.post(
            `/api/kekhai/getinfo-bhxh`,
            dataFind
          );
        }

        const data = res_data?.data?.data;
        // console.log(data);
        
        if (data) {
          const formatted = {
            ...data,
            ngaysinh: DateTime.fromISO(data.ngaysinh).toFormat("dd/MM/yyyy"),
            ...(this.loaihinh === "bhxh" && {
              benhvien: {},
              tuthang: DateTime.fromISO(data.tuthang).toFormat("dd/MM/yyyy"),
            }),
          };

          this.dulieuthe = [formatted];
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          text: "Không tìm được thông tin người hưởng!",
          icon: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
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
