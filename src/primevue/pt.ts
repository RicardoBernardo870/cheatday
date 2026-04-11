/**
 * PrimeVue Global Passthrough (PT) Configuration
 *
 * All PrimeVue components run in unstyled mode. This file is the single
 * source of truth for every component's Tailwind + glass utility classes.
 *
 * Material hierarchy (mirrors Apple's system materials):
 *   glass-thin     → systemUltraThinMaterial  (tooltips, context menus)
 *   glass          → systemThinMaterial        (inputs, interactive surfaces)
 *   glass-card     → systemMaterial            (cards, panels)
 *   glass-strong   → systemThickMaterial       (dropdowns, popovers)
 *   glass-elevated → systemUltraThickMaterial  (modals, reward layer)
 *   glass-primary  → Saffron Sunset CTA        (primary actions)
 */

// ── Progress bar colour based on usage % ─────────────────────────────────
// green(<40%) → amber(40-80%) → saffron(80-100%) → burgundy(≥100%)
const progressColor = (value: number | null | undefined): string => {
  const v = value ?? 0;
  if (v < 40)  return 'bg-success  shadow-[0_0_12px_rgba(93,199,183,0.55)]';
  if (v < 80)  return 'bg-warn     shadow-[0_0_10px_rgba(255,191,94,0.50)]';
  if (v < 100) return 'bg-primary  shadow-[0_0_10px_rgba(255,130,58,0.50)]';
  return              'bg-danger   shadow-[0_0_10px_rgba(163,21,47,0.55)]';
}

// ── PT config ─────────────────────────────────────────────────────────────
export const pt = {

  /* ═══════════════════════ BUTTON ══════════════════════════════════════ */
  button: {
    root: {
      class: [
        'glass-primary',
        'text-white font-semibold text-sm',
        'px-5 py-2.5 rounded-xl',
        'flex items-center justify-center gap-2',
        'transition-all duration-200',
        'hover:scale-[1.02] hover:brightness-110',
        'active:scale-[0.97]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      ],
    },
    label: 'font-semibold',
    icon:  'text-base leading-none',
  },

  /* ═══════════════════════ INPUT TEXT ══════════════════════════════════ */
  inputtext: {
    root: {
      class: [
        'glass',
        'w-full px-3 py-2.5 rounded-xl',
        'text-[color:var(--color-text)]',
        'placeholder:text-[color:var(--color-text-muted)]',
        'focus:outline-none focus:ring-2 focus:ring-success/60',
        'transition-all duration-200',
        'disabled:opacity-50',
      ],
    },
  },

  /* ═══════════════════════ SLIDER ══════════════════════════════════════ */
  slider: {
    root: {
      class: [
        'relative flex items-center',
        'w-full h-1.5 rounded-full',
        'bg-[color:var(--glass-bg-strong)]',
        'cursor-pointer',
      ],
    },
    range: {
      class: [
        'absolute h-full rounded-full',
        'bg-primary',
        'transition-all duration-150',
      ],
    },
    handle: {
      class: [
        'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
        'w-5 h-5 rounded-full',
        'bg-white shadow-md shadow-black/30',
        'border-2 border-primary',
        'transition-transform duration-150',
        'hover:scale-110 active:scale-125',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      ],
    },
  },

  /* ═══════════════════════ PROGRESS BAR ════════════════════════════════ */
  progressbar: {
    root: {
      class: [
        'glass-thin rounded-full overflow-hidden',
        'h-2.5 w-full',
      ],
    },
    value: ({ props }: { props: { value?: number | null } }) => ({
      class: [
        'h-full rounded-full',
        'transition-all duration-700 ease-out',
        progressColor(props.value),
      ],
    }),
  },

  /* ═══════════════════════ TOAST ═══════════════════════════════════════ */
  toast: {
    root: {
      class: 'mt-4 mr-4 z-50 pointer-events-none',
    },
    message: {
      class: [
        'glass-elevated rounded-2xl p-4 mb-3',
        'flex gap-3 items-start',
        'pointer-events-auto',
        'animate-slide-up',
      ],
    },
    icon:    'text-xl shrink-0 mt-0.5',
    content: 'flex flex-col gap-0.5 min-w-0',
    summary: 'font-semibold text-sm leading-tight',
    detail:  'text-xs opacity-70 leading-snug',
    closeButton: {
      class: [
        'ml-auto shrink-0 p-1 rounded-lg',
        'text-[color:var(--color-text-muted)]',
        'hover:text-[color:var(--color-text)]',
        'transition-colors',
        'focus:outline-none',
      ],
    },
  },

  /* ═══════════════════════ DIALOG ══════════════════════════════════════ */
  dialog: {
    root: {
      class: [
        'glass-elevated rounded-2xl',
        'w-full max-w-sm mx-auto',
        'overflow-hidden',
      ],
    },
    header: {
      class: [
        'px-5 py-4',
        'border-b border-[color:var(--rim-top)]',
        'font-semibold text-lg',
        'flex items-center justify-between',
      ],
    },
    content: { class: 'px-5 py-4' },
    footer:  { class: 'px-5 pb-5 flex gap-3 justify-end' },
    closeButton: {
      class: [
        'p-1.5 rounded-lg',
        'text-[color:var(--color-text-muted)]',
        'hover:text-[color:var(--color-text)]',
        'hover:bg-white/10',
        'transition-colors',
        'focus:outline-none',
      ],
    },
    mask: {
      class: 'fixed inset-0 backdrop-blur-sm bg-black/40 flex items-end sm:items-center justify-center',
    },
  },

  /* ═══════════════════════ PANEL ═══════════════════════════════════════ */
  panel: {
    root:    { class: 'glass-card rounded-2xl overflow-hidden' },
    header:  {
      class: [
        'px-4 py-3',
        'border-b border-[color:var(--rim-top)]',
        'flex items-center justify-between',
      ],
    },
    title:   'font-semibold text-base',
    content: { class: 'p-4 text-sm text-[color:var(--color-text)]' },
    toggler: {
      class: [
        'p-1 rounded-lg',
        'text-[color:var(--color-text-muted)]',
        'hover:text-[color:var(--color-text)]',
        'transition-colors',
      ],
    },
  },

  /* ═══════════════════════ DROPDOWN / SELECT ═══════════════════════════ */
  dropdown: {
    root: {
      class: [
        'glass px-3 py-2 rounded-xl',
        'flex items-center gap-2 cursor-pointer',
        'text-[color:var(--color-text)]',
        'focus:outline-none focus:ring-2 focus:ring-success/60',
      ],
    },
    panel: {
      class: [
        'glass-strong rounded-2xl mt-2 overflow-hidden',
        'shadow-[0_16px_48px_rgba(0,0,0,0.35)]',
      ],
    },
    item: {
      class: [
        'px-3 py-2.5 cursor-pointer text-sm',
        'hover:bg-white/10',
        'data-[p-highlight=true]:text-primary data-[p-highlight=true]:bg-white/10',
        'transition-colors duration-150',
      ],
    },
    trigger: { class: 'ml-auto text-[color:var(--color-text-muted)]' },
  },

  /* ═══════════════════════ TABVIEW ═════════════════════════════════════ */
  tabview: {
    nav:        { class: 'glass rounded-xl p-1 flex gap-1' },
    navcontent: 'flex gap-1 w-full',
    inkbar:     { class: 'hidden' },
    tab: {
      class: [
        'flex-1 px-4 py-2 rounded-lg',
        'text-sm font-medium text-center',
        'text-[color:var(--color-text-muted)]',
        'data-[p-highlight=true]:glass-primary data-[p-highlight=true]:text-white',
        'transition-all duration-200',
      ],
    },
    panel: { class: 'mt-3' },
  },

  /* ═══════════════════════ DATEPICKER ══════════════════════════════════ */
  datepicker: {
    root: { class: 'w-full' },
    pcInput: {
      root: {
        class: [
          'glass w-full px-3 py-2.5 rounded-xl',
          'text-[color:var(--color-text)]',
          'focus:outline-none focus:ring-2 focus:ring-success/60',
        ],
      },
    },
    panel: {
      class: [
        'glass-strong rounded-2xl mt-2 overflow-hidden p-3',
        'shadow-[0_16px_48px_rgba(0,0,0,0.35)]',
      ],
    },
    calendar: { class: 'w-full' },
    header: { class: 'flex items-center justify-between mb-2' },
    pcPreviousButton: {
      root: {
        class: [
          'p-1.5 rounded-lg',
          'text-[color:var(--color-text-muted)]',
          'hover:text-[color:var(--color-text)] hover:bg-white/10',
          'transition-colors',
        ],
      },
    },
    pcNextButton: {
      root: {
        class: [
          'p-1.5 rounded-lg',
          'text-[color:var(--color-text-muted)]',
          'hover:text-[color:var(--color-text)] hover:bg-white/10',
          'transition-colors',
        ],
      },
    },
    title: { class: 'font-semibold text-sm text-[color:var(--color-text)] cursor-pointer' },
    dayView: { class: 'w-full border-collapse' },
    tableHeaderCell: {
      class: 'text-xs text-[color:var(--color-text-muted)] text-center p-1.5 font-medium',
    },
    tableBody: { class: '' },
    tableBodyRow: { class: '' },
    dayCell: { class: 'p-0.5 text-center' },
    day: ({ context }: { context: { selected: boolean; disabled: boolean; today: boolean; otherMonth: boolean } }) => ({
      class: [
        'w-8 h-8 mx-auto rounded-lg text-xs inline-flex items-center justify-center transition-all',
        context.selected
          ? 'glass-primary text-white font-bold'
          : context.today
            ? 'font-bold text-primary'
            : context.otherMonth
              ? 'text-[color:var(--color-text-muted)] opacity-40'
              : 'text-[color:var(--color-text)] hover:bg-white/10 cursor-pointer',
        context.disabled ? 'opacity-30 !cursor-not-allowed pointer-events-none' : '',
      ],
    }),
    monthView: { class: 'grid grid-cols-3 gap-2 my-2' },
    month: ({ context }: { context: { selected: boolean; disabled: boolean } }) => ({
      class: [
        'py-2 rounded-lg text-sm transition-all',
        context.selected
          ? 'glass-primary text-white font-bold'
          : 'text-[color:var(--color-text)] hover:bg-white/10 cursor-pointer',
        context.disabled ? 'opacity-30 !cursor-not-allowed pointer-events-none' : '',
      ],
    }),
    yearView: { class: 'grid grid-cols-4 gap-2 my-2' },
    year: ({ context }: { context: { selected: boolean; disabled: boolean } }) => ({
      class: [
        'py-2 rounded-lg text-sm transition-all',
        context.selected
          ? 'glass-primary text-white font-bold'
          : 'text-[color:var(--color-text)] hover:bg-white/10 cursor-pointer',
        context.disabled ? 'opacity-30 !cursor-not-allowed pointer-events-none' : '',
      ],
    }),
  },

  /* ═══════════════════════ CHECKBOX ════════════════════════════════════ */
  checkbox: {
    root: {
      class: [
        'relative w-5 h-5 rounded-md cursor-pointer',
        'glass transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-success/60',
      ],
    },
    box: {
      class: [
        'w-full h-full rounded-md flex items-center justify-center',
        'data-[p-checked=true]:bg-success data-[p-checked=true]:shadow-[0_0_8px_rgba(93,199,183,0.5)]',
        'transition-all duration-200',
      ],
    },
    icon: 'text-white text-xs',
  },
};
