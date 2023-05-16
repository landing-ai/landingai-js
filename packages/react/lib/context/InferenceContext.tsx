import { ApiInfo } from "@landingai-js/core/types";
import { createContext, useContext } from "react";

export type InferenceContextState = ApiInfo & {};

export const initialInferenceContext: InferenceContextState = {
  endpoint: '',
  key: '',
  secret: '',
};

export const InferenceContext = createContext(initialInferenceContext);

export const useInferenceContext = () => useContext(InferenceContext);