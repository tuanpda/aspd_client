import cookieparser from "cookieparser";
import companyConfig from "~/config.company";

export default async function ({ store, redirect, req, app, route }) {
  // console.log(req);
  // console.log(req.headers.cookie);
  // console.log('Middleware chạy ở:', process.server ? 'Server' : 'Client');
  // console.log(companyConfig.port_backend);

  // Những route không cần login
  const publicRoutes = [`/tracuubienlaidientu-${companyConfig.namebienlai}`];

  if (publicRoutes.includes(route.path)) {
    // Bỏ qua kiểm tra login cho route này
    return;
  }
  if (process.server) {
    const cookie = req && req.headers && req.headers.cookie;

    if (!cookie) {
      console.log("Không có cookie");
      redirect("/login"); // nếu muốn chuyển hướng
    } else {
      // console.log('Có cookie:', cookie);
      console.log("Có cookie:");
      try {
        const res = await app.$axios.$get(
          `http://localhost:${companyConfig.port_backend}/api/users/auth/user`
        );
        // const res = await app.$axios.$get("http://localhost:1552/api/users/auth/user");
        // console.log('API trả về:', res.user);
        store.commit("setUser", res.user);

        const user = store.state.user;
        // console.log(user.role);

        if (route.path === "/login") {
          if (user.role === 9) {
            return redirect("/bienlaidientu");
          } else {
            return redirect("/");
          }
        }

        // Nếu user là role = 9 mà đang vào trang "/", redirect sang /bienlaidentu
        if (user.role === 9 && route.path === "/") {
          console.log("User role=9 đang vào / → redirect sang /bienlaidientu");
          return redirect("/bienlaidientu");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
  }
}
