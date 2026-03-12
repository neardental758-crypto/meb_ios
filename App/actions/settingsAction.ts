import { DELETE_ACCOUNT } from '../types/settingsTypes'

export function deleteAccount() {
    console.log("Entra a la acción");
    return {
      type: DELETE_ACCOUNT,
    }
}

export const settingsAction = {
    deleteAccount,
  }