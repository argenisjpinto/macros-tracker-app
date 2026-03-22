type FloatingActionButtonProps = {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      className="fixed right-6 bottom-28 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-40 transition-transform active:scale-90 duration-150"
      onClick={onClick}
      type="button"
    >
      <span className="material-symbols-outlined text-3xl">add</span>
    </button>
  )
}
