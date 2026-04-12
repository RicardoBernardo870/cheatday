import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useChartTheme = () => {
  const isDark = ref(document.documentElement.classList.contains('dark'));
  let observer: MutationObserver | null = null;

  onMounted(() => {
    observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  });

  onUnmounted(() => observer?.disconnect());

  const textMuted = computed(() =>
    isDark.value ? 'rgba(245,240,232,0.50)' : 'rgba(47,50,65,0.55)'
  );

  const gridColor = computed(() =>
    isDark.value ? 'rgba(255,255,255,0.07)' : 'rgba(47,50,65,0.10)'
  );

  const textColor = computed(() =>
    isDark.value ? '#f5f0e8' : '#2F3241'
  );

  return { isDark, textMuted, gridColor, textColor };
};
