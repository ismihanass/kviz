function updateCoinsDisplay() {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(response => response.json())
    .then(userData => {
      const coins = userData.coins || 0;
      console.log(userData)
      console.log(coins)
      const coinsEl = document.getElementById('coins');
      const menuCoinsEl = document.getElementById('menu-coins');
      if (coinsEl) coinsEl.textContent = `💰 ${coins}`;
      if (menuCoinsEl) menuCoinsEl.textContent = `💰 ${coins}`;
    })
    .catch(err => console.error('Greška pri dohvaćanju coina:', err));
}
document.addEventListener('DOMContentLoaded', () => {
  updateCoinsDisplay();
});
