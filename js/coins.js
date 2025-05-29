

function getCoins() {
    const coins = localStorage.getItem('coins');
    return coins ? parseInt(coins, 10) : 0;
  }
  
  function setCoins(amount) {
    localStorage.setItem('coins', amount);
    updateCoinsDisplay();
  }
  
  function addCoins(amount) {
    const current = getCoins();
    setCoins(current + amount);
  }
  
  function removeCoins(amount) {
    const current = getCoins();
    const newAmount = current - amount;
    setCoins(newAmount < 0 ? 0 : newAmount);
  }
  
  function updateCoinsDisplay() {
    const coinCountSpan = document.querySelector('#contLog .coin-count');
    if (coinCountSpan) {
      coinCountSpan.textContent = getCoins();
    }
  }
  

  document.addEventListener('DOMContentLoaded', updateCoinsDisplay);
 