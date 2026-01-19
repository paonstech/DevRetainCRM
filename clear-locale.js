// Bu dosyayı tarayıcı console'unda çalıştır
localStorage.removeItem('locale_selected');
document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
console.log('✅ Dil seçimi sıfırlandı! Sayfa yenileniyor...');
location.reload();
