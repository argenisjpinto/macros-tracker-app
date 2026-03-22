import { activityLevels, biometricFields, goals } from './profileData'
import { BirthDateFieldCard } from './BirthDateFieldCard'
import { BiometricFieldCard } from './BiometricFieldCard'
import type { ProfileState } from './types'

type ProfileFormSectionProps = {
  age: number
  profile: ProfileState
  setProfile: (updater: (current: ProfileState) => ProfileState) => void
}

export function ProfileFormSection({
  age,
  profile,
  setProfile,
}: ProfileFormSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <BirthDateFieldCard
          age={age}
          birthDate={profile.birthDate}
          onChange={(value) => setProfile((current) => ({ ...current, birthDate: value }))}
        />

        {biometricFields.map((field) => (
          <BiometricFieldCard
            key={field.key}
            label={field.label}
            onChange={(value) => setProfile((current) => ({ ...current, [field.key]: value }))}
            suffix={field.suffix}
            value={profile[field.key]}
          />
        ))}
      </div>

      <div className="md:col-span-4 space-y-6">
        <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
          <label className="font-label label-md uppercase tracking-wider text-on-surface-variant">
            Sexo biológico
          </label>
          <div className="flex bg-surface-container rounded-xl p-1">
            <button
              className={
                profile.sex === 'male'
                  ? 'flex-1 py-3 font-label font-bold text-sm bg-surface-container-lowest rounded-lg shadow-sm'
                  : 'flex-1 py-3 font-label font-bold text-sm text-on-surface-variant'
              }
              onClick={() => setProfile((current) => ({ ...current, sex: 'male' }))}
              type="button"
            >
              MASCULINO
            </button>
            <button
              className={
                profile.sex === 'female'
                  ? 'flex-1 py-3 font-label font-bold text-sm bg-surface-container-lowest rounded-lg shadow-sm'
                  : 'flex-1 py-3 font-label font-bold text-sm text-on-surface-variant'
              }
              onClick={() => setProfile((current) => ({ ...current, sex: 'female' }))}
              type="button"
            >
              FEMENINO
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
          <label className="font-label label-md uppercase tracking-wider text-on-surface-variant">
            Nivel de actividad
          </label>
          <div className="space-y-2">
            {activityLevels.map((activityLevel) => (
              <button
                className={
                  profile.activityLevel === activityLevel.key
                    ? 'w-full text-left p-4 rounded-xl border border-primary bg-primary-container/20'
                    : 'w-full text-left p-4 rounded-xl bg-surface-container-lowest'
                }
                key={activityLevel.key}
                onClick={() =>
                  setProfile((current) => ({ ...current, activityLevel: activityLevel.key }))
                }
                type="button"
              >
                <span
                  className={
                    profile.activityLevel === activityLevel.key
                      ? 'font-body font-bold text-primary'
                      : 'font-body font-medium text-on-surface'
                  }
                >
                  {activityLevel.label}
                </span>
                <p className="text-sm text-on-surface-variant mt-1">{activityLevel.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
          <label className="font-label label-md uppercase tracking-wider text-on-surface-variant">
            Objetivo primario
          </label>
          <div className="space-y-2">
            {goals.map((goal) => (
              <button
                className={
                  profile.goal === goal.key
                    ? 'w-full text-left p-4 rounded-xl border border-primary bg-primary-container/20 flex items-center justify-between'
                    : 'w-full text-left p-4 rounded-xl bg-surface-container-lowest flex items-center justify-between'
                }
                key={goal.key}
                onClick={() => setProfile((current) => ({ ...current, goal: goal.key }))}
                type="button"
              >
                <div>
                  <span
                    className={
                      profile.goal === goal.key
                        ? 'font-body font-bold text-primary'
                        : 'font-body font-medium text-on-surface'
                    }
                  >
                    {goal.label}
                  </span>
                  <p className="text-sm text-on-surface-variant mt-1">{goal.description}</p>
                </div>
                <span
                  className={
                    profile.goal === goal.key
                      ? 'material-symbols-outlined text-primary'
                      : 'material-symbols-outlined text-outline-variant'
                  }
                >
                  {goal.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
