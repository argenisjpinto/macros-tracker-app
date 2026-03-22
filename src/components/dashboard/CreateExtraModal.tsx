type CreateExtraModalProps = {
  name: string
  onChangeName: (value: string) => void
  onClose: () => void
  onCreate: () => void
}

export function CreateExtraModal({
  name,
  onChangeName,
  onClose,
  onCreate,
}: CreateExtraModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-[#2f2e2e]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-[0_20px_40px_rgba(47,46,46,0.12)]">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-label label-md uppercase tracking-wider text-outline mb-2">
              Nuevo
            </p>
            <h3 className="font-headline text-2xl font-bold text-on-background">
              Añadir comida personalizada
            </h3>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-surface-container text-outline hover:text-on-background transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <label className="block">
          <span className="font-label label-md uppercase tracking-wider text-outline mb-3 block">
            Nombre
          </span>
          <input
            className="w-full px-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body text-on-surface"
            placeholder="Ej: Batido post cena"
            type="text"
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-5 py-3 rounded-xl bg-surface-container text-on-surface font-bold"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold disabled:opacity-50"
            disabled={!name.trim()}
            onClick={onCreate}
            type="button"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}
