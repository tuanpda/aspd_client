export default function ({ store, route, redirect }) {
  const user = store.state.user;
  if (!user) return;

  if (user.role === 9 && route.path !== '/bienlaidientu') {
    console.log('Redirect từ client middleware → /bienlaidientu');
    return redirect('/bienlaidientu');
  }

  if (user.role !== 9 && route.path !== '/') {
    console.log('Redirect từ client middleware → /');
    return redirect('/');
  }
}
