import { AppState } from "@/store/store";

export const getConfig = (getState: () => AppState) => {
  const currentBusiness = getState().userBusiness.currentBusiness;
  const token = getState().auth.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  return { currentBusiness, config };
};
