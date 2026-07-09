import type { UserProgram } from '~/types/userProgram'

export const useUserProgram = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const authHeaders = () => ({ Authorization: `Bearer ${token.value}` })

  const fetchPrograms = () => {
    return $fetch<UserProgram[]>(`${config.public.apiBase}/api/user-programs/`, {
      headers: authHeaders(),
    })
  }

  const fetchActiveProgram = () => {
    return $fetch<UserProgram | null>(`${config.public.apiBase}/api/user-programs/active/`, {
      headers: authHeaders(),
    })
  }

  const createProgram = (payload: Pick<UserProgram, 'name' | 'days'>) => {
    return $fetch<UserProgram>(`${config.public.apiBase}/api/user-programs/`, {
      method: 'POST',
      headers: authHeaders(),
      body: payload,
    })
  }

  const updateProgram = (id: number, payload: Partial<Pick<UserProgram, 'name' | 'days'>>) => {
    return $fetch<UserProgram>(`${config.public.apiBase}/api/user-programs/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: payload,
    })
  }

  const deleteProgram = (id: number) => {
    return $fetch(`${config.public.apiBase}/api/user-programs/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  }

  const activateProgram = (id: number) => {
    return $fetch<UserProgram>(`${config.public.apiBase}/api/user-programs/${id}/activate/`, {
      method: 'POST',
      headers: authHeaders(),
    })
  }

  const copyFromCatalog = (programId: number) => {
    return $fetch<UserProgram>(`${config.public.apiBase}/api/user-programs/copy-from-catalog/`, {
      method: 'POST',
      headers: authHeaders(),
      body: { program_id: programId },
    })
  }

  return {
    fetchPrograms,
    fetchActiveProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    activateProgram,
    copyFromCatalog,
  }
}
