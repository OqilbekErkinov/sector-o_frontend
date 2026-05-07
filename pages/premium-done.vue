<template>
  <div class="promo-wrapper container">
    <div class="image-premium">
      <NuxtImg format="webp" loading="lazy" src='/images/premium.webp' alt="premium" class="premium-img" />
    </div>
    <h1 class="maintitle">Спасибо за покупку!</h1>
    <h3 class="sub-title">Теперь нужно добавить 10 ваших фотографи чтобы обучить модель</h3>
    <p class="sub-text">
      <span class="text-light">Следует заметить:</span> Для наилучшего результата загрузи обычные фото подойдут любые,
      но студийные фотографии могут
      дать еще более крутой эффект!
    </p>
    <p class="sub-text2"><span style="font-weight: bold;">Важно</span><span class="text-danger">!</span> <br>
      Используйте разные ракурсы, выражения лиц, освещение и фоны используйте крупный план, лицо должно быть хорошо
      видно, это придаст нейрофотографиям максимально естественный эффект.
    </p>
    <NuxtLink to="/selection">
      <button class="continue-button">Продолжать</button>
    </NuxtLink>
  </div>
</template>